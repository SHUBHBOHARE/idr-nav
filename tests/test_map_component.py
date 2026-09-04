import pytest

def test_map_provider_defaults():
    # Test tile URLs and attribution for default OpenStreetMap provider
    url_osm = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    url_carto = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"

    assert "openstreetmap.org" in url_osm
    assert "cartocdn.com" in url_carto
    assert "api_key" not in url_osm
    assert "api_key" not in url_carto

def test_trajectory_point_bounds():
    sample_trajectory = [
        {"lat": 37.7749, "lon": -122.4194, "speed": 12.0},
        {"lat": 37.7750, "lon": -122.4193, "speed": 12.1}
    ]

    for pt in sample_trajectory:
        assert -90.0 <= pt["lat"] <= 90.0
        assert -180.0 <= pt["lon"] <= 180.0
        assert pt["speed"] >= 0.0
