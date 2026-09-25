"""
src/oracle/prediction.py
─────────────────────────
Phase 5: Dynamic Edge Cost & Classical ML Prediction.
Uses a RandomForestRegressor to predict dynamic travel times
based on road features (length, maxspeed) and time constraints.
Synthesizes honest historical data for training if none exists.
"""

import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class TrafficPredictor:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=50, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False

    def _generate_synthetic_data(self, num_samples: int = 1000):
        """
        Generate synthetic historical traffic data to bootstrap the model.
        Features: [length_m, maxspeed_kmh, hour_of_day, is_weekend, weather_severity]
        Target: travel_time_seconds
        """
        np.random.seed(42)
        length_m = np.random.uniform(50, 2000, num_samples)
        maxspeed = np.random.choice([30, 40, 50, 60, 80], num_samples)
        hour = np.random.randint(0, 24, num_samples)
        weekend = np.random.randint(0, 2, num_samples)
        weather = np.random.uniform(0.0, 1.0, num_samples)
        
        X = np.column_stack([length_m, maxspeed, hour, weekend, weather])
        
        # Base time = length / speed
        speed_ms = maxspeed * (1000.0 / 3600.0)
        base_time = length_m / speed_ms
        
        # Traffic multiplier
        # Rush hours: 8-10 and 17-19
        rush_hour_penalty = np.where(((hour >= 8) & (hour <= 10)) | ((hour >= 17) & (hour <= 19)), 1.8, 1.0)
        weather_penalty = 1.0 + weather * 0.5
        
        y = base_time * rush_hour_penalty * weather_penalty
        
        # Add noise
        y += np.random.normal(0, base_time * 0.1, num_samples)
        y = np.maximum(y, base_time * 0.5) # Never faster than 2x limit
        
        return X, y

    def train(self):
        """Train the Random Forest on historical data."""
        logger.info("Training classical ML traffic predictor...")
        X, y = self._generate_synthetic_data()
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
        self.is_trained = True
        logger.info("Traffic prediction model trained. R^2 score: %.3f", self.model.score(X_scaled, y))

    def predict_edge_time(self, length_m: float, maxspeed: float, hour: int = 14, weekend: int = 0, weather: float = 0.2) -> float:
        if not self.is_trained:
            self.train()
        
        X = np.array([[length_m, maxspeed, hour, weekend, weather]])
        X_scaled = self.scaler.transform(X)
        return self.model.predict(X_scaled)[0]
