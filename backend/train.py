"""
Training script for FIFA Player Rating (OVR) Predictor.
Milestone 3: Model comparison, selection, pipeline serialization, and metadata generation.
"""

import os
import sys
import json
import time
from pathlib import Path

import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split, KFold, cross_val_score
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score
from sklearn.inspection import permutation_importance

# Ensure backend root is in python path
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

SEED = 42
FEATURE_COLS = ["pace", "shooting", "passing", "dribbling", "defending", "physical", "position"]
NUM_COLS = ["pace", "shooting", "passing", "dribbling", "defending", "physical"]
CAT_COLS = ["position"]
TARGET_COL = "overall"
MIN_TEST_SAMPLES = 25  # Minimum test samples needed for position-specific permutation importance


def load_and_clean_data(csv_path: Path):
    """
    Loads raw FIFA player dataset, extracts primary position, filters outfield players,
    maps wingbacks (LWB->LB, RWB->RB), and sets up feature columns.
    """
    if not csv_path.exists():
        raise FileNotFoundError(f"Dataset not found at {csv_path}")

    print(f"Loading raw dataset from {csv_path}...")
    df = pd.read_csv(csv_path, low_memory=False)
    raw_rows = len(df)
    print(f"Raw rows: {raw_rows}")

    # Extract primary position (first listed value in player_positions)
    primary_pos = df["player_positions"].astype(str).apply(lambda x: x.split(",")[0].strip())

    # Outfield players only (GK excluded from this model)
    outfield_mask = primary_pos != "GK"
    outfield_df = df[outfield_mask].copy()

    # Map positions
    cleaned_pos = primary_pos[outfield_mask].replace({"LWB": "LB", "RWB": "RB"})
    outfield_df["position"] = cleaned_pos

    # In raw dataset, physical is named 'physic'
    if "physical" not in outfield_df.columns and "physic" in outfield_df.columns:
        outfield_df["physical"] = outfield_df["physic"]

    # Select columns and drop any invalid rows
    required_cols = FEATURE_COLS + [TARGET_COL]
    cleaned_df = outfield_df[required_cols].dropna().copy()

    # Ensure correct data types
    for col in NUM_COLS + [TARGET_COL]:
        cleaned_df[col] = cleaned_df[col].astype(float)
    cleaned_df[TARGET_COL] = cleaned_df[TARGET_COL].astype(int)

    cleaned_rows = len(cleaned_df)
    print(f"Cleaned outfield rows: {cleaned_rows}")
    print(f"Positions distribution:\n{cleaned_df['position'].value_counts().to_dict()}")

    return cleaned_df, raw_rows, cleaned_rows


def build_preprocessor():
    """
    Builds ColumnTransformer with passthrough for numeric attributes
    and OneHotEncoder for player position.
    """
    return ColumnTransformer(
        transformers=[
            ("num", "passthrough", NUM_COLS),
            (
                "cat",
                OneHotEncoder(handle_unknown="ignore", sparse_output=False),
                CAT_COLS,
            ),
        ]
    )


def compute_normalized_importance(perm_result, feature_names):
    """
    Extracts mean permutation importance for numeric feature attributes,
    clamps negatives to zero, and normalizes to sum to 1.0.
    """
    means = np.maximum(0.0, perm_result.importances_mean[: len(feature_names)])
    total = means.sum()
    if total > 0:
        norm = means / total
    else:
        norm = np.ones(len(feature_names)) / len(feature_names)
    return {name: round(float(val), 4) for name, val in zip(feature_names, norm)}


def train():
    data_path = backend_dir / "data" / "players_22.csv"
    models_dir = backend_dir / "models"
    models_dir.mkdir(parents=True, exist_ok=True)
    model_save_path = models_dir / "ovr_model.joblib"
    meta_save_path = models_dir / "model_meta.json"

    # 1. Load and clean data
    cleaned_df, raw_rows, cleaned_rows = load_and_clean_data(data_path)

    X = cleaned_df[FEATURE_COLS]
    y = cleaned_df[TARGET_COL]

    # 2. Train/Test split (80/20, fixed seed = 42)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=SEED
    )
    train_rows = len(X_train)
    test_rows = len(X_test)
    print(f"Train split rows: {train_rows}, Test split rows: {test_rows}")

    # 3. Model Candidates
    candidates = {
        "Linear Regression": LinearRegression(),
        "Random Forest Regressor": RandomForestRegressor(
            random_state=SEED, n_estimators=100, n_jobs=-1
        ),
        "Gradient Boosting Regressor": GradientBoostingRegressor(
            random_state=SEED
        ),
    }

    kf = KFold(n_splits=5, shuffle=True, random_state=SEED)
    cv_mae_results = {}

    print("\n--- Running 5-Fold Cross Validation on Training Split ---")
    for name, model in candidates.items():
        pipe = Pipeline(
            steps=[
                ("preprocessor", build_preprocessor()),
                ("regressor", model),
            ]
        )
        scores = cross_val_score(
            pipe,
            X_train,
            y_train,
            cv=kf,
            scoring="neg_mean_absolute_error",
            n_jobs=-1,
        )
        mae = float(-scores.mean())
        std = float(scores.std())
        cv_mae_results[name] = round(mae, 4)
        print(f"{name:30s} CV MAE = {mae:.4f} (+/- {std:.4f})")

    # 4. Model Selection (lowest 5-fold CV MAE)
    selected_name = min(cv_mae_results, key=cv_mae_results.get)
    print(f"\nSelected Model based on lowest CV MAE: {selected_name}")

    # 5. Fit selected pipeline on full training split
    selected_model_instance = candidates[selected_name]
    final_pipeline = Pipeline(
        steps=[
            ("preprocessor", build_preprocessor()),
            ("regressor", selected_model_instance),
        ]
    )
    print(f"Fitting final {selected_name} pipeline on full training set ({train_rows} rows)...")
    t0 = time.time()
    final_pipeline.fit(X_train, y_train)
    fit_time = time.time() - t0
    print(f"Training completed in {fit_time:.2f}s")

    # 6. Evaluate on held-out test split
    y_pred = final_pipeline.predict(X_test)
    test_mae = float(mean_absolute_error(y_test, y_pred))
    test_rmse = float(root_mean_squared_error(y_test, y_pred))
    test_r2 = float(r2_score(y_test, y_pred))

    print("\n--- Test Split Performance ---")
    print(f"Test MAE:  {test_mae:.4f}")
    print(f"Test RMSE: {test_rmse:.4f}")
    print(f"Test R²:   {test_r2:.4f}")

    # 7. Compute Permutation Feature Importance
    print("\n--- Computing Permutation Feature Importance on Test Set ---")
    perm_global = permutation_importance(
        final_pipeline,
        X_test,
        y_test,
        scoring="neg_mean_absolute_error",
        n_repeats=5,
        random_state=SEED,
        n_jobs=-1,
    )
    global_importance = compute_normalized_importance(perm_global, NUM_COLS)
    print(f"Global feature importance: {global_importance}")

    # Position-specific permutation importance
    position_importance = {}
    positions_in_test = sorted(X_test["position"].unique())
    print("\nPosition-specific permutation importance:")
    for pos in positions_in_test:
        sub_mask = X_test["position"] == pos
        sub_X = X_test[sub_mask]
        sub_y = y_test[sub_mask]
        sub_count = len(sub_X)

        if sub_count >= MIN_TEST_SAMPLES:
            perm_pos = permutation_importance(
                final_pipeline,
                sub_X,
                sub_y,
                scoring="neg_mean_absolute_error",
                n_repeats=5,
                random_state=SEED,
                n_jobs=-1,
            )
            imp = compute_normalized_importance(perm_pos, NUM_COLS)
            position_importance[pos] = imp
            print(f"  {pos:4s} ({sub_count:3d} samples): {imp}")
        else:
            print(f"  {pos:4s} ({sub_count:3d} samples < {MIN_TEST_SAMPLES}): Fallback to global importance")

    # 8. Save Pipeline Model
    print(f"\nSaving pipeline to {model_save_path}...")
    joblib.dump(final_pipeline, model_save_path, compress=3)
    model_size_bytes = os.path.getsize(model_save_path)
    model_size_mb = model_size_bytes / (1024 * 1024)
    print(f"Model saved successfully. File size: {model_size_mb:.2f} MB ({model_size_bytes} bytes)")

    # 9. Save Metadata JSON
    metadata = {
        "model_name": selected_name,
        "selected_model": selected_name,
        "seed": SEED,
        "raw_rows": raw_rows,
        "cleaned_rows": cleaned_rows,
        "train_rows": train_rows,
        "test_rows": test_rows,
        "cv_mae": cv_mae_results,
        "test_metrics": {
            "mae": round(test_mae, 4),
            "rmse": round(test_rmse, 4),
            "r2": round(test_r2, 4),
        },
        "features": FEATURE_COLS,
        "numeric_features": NUM_COLS,
        "positions": sorted(list(cleaned_df["position"].unique())),
        "model_file_size_bytes": model_size_bytes,
        "model_file_size_mb": round(model_size_mb, 2),
        "global_feature_importance": global_importance,
        "position_feature_importance": position_importance,
        "training_timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
    }

    print(f"Saving metadata to {meta_save_path}...")
    with open(meta_save_path, "w") as f:
        json.dump(metadata, f, indent=2)
    print("Metadata saved successfully.")

    return metadata


if __name__ == "__main__":
    train()
