import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { TrajectoryPoint } from '../types/navigation';
import { getMapProvider } from './providers';
import { safeToFixed } from '../utils/formatters';

// Custom Vehicle Marker Icon
const vehicleIcon = L.divIcon({
  className: 'custom-vehicle-marker',
  html: `<div style="
    width: 22px;
    height: 22px;
    background-color: #00B8FF;
    border: 3px solid #070B14;
    border-radius: 50%;
    box-shadow: 0 0 15px #00B8FF;
    animation: pulse 1.5s infinite;
  "></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11]
});

interface VehicleMapProps {
  currentLat: number;
  currentLon: number;
  providerType?: string;
  trajectories: {
    ground_truth?: TrajectoryPoint[];
    gnss?: TrajectoryPoint[];
    dead_reckoning?: TrajectoryPoint[];
    ai_dead_reckoning?: TrajectoryPoint[];
    fused?: TrajectoryPoint[];
    map_matched?: TrajectoryPoint[];
  };
}

export const VehicleMap: React.FC<VehicleMapProps> = ({
  currentLat,
  currentLon,
  providerType = 'osm',
  trajectories
}) => {
  const provider = useMemo(() => getMapProvider(providerType), [providerType]);
  const tileConfig = provider.getConfig();

  const center: [number, number] = useMemo(() => [
    currentLat && !isNaN(currentLat) ? currentLat : 37.7749,
    currentLon && !isNaN(currentLon) ? currentLon : -122.4194
  ], [currentLat, currentLon]);

  const groundTruthPts = useMemo(
    () => (trajectories.ground_truth || []).map(p => [p.lat, p.lon] as [number, number]),
    [trajectories.ground_truth]
  );

  const gnssPts = useMemo(
    () => (trajectories.gnss || []).map(p => [p.lat, p.lon] as [number, number]),
    [trajectories.gnss]
  );

  const rawDrPts = useMemo(
    () => (trajectories.dead_reckoning || []).map(p => [p.lat, p.lon] as [number, number]),
    [trajectories.dead_reckoning]
  );

  const aiDrPts = useMemo(
    () => (trajectories.ai_dead_reckoning || []).map(p => [p.lat, p.lon] as [number, number]),
    [trajectories.ai_dead_reckoning]
  );

  const fusedPts = useMemo(
    () => (trajectories.fused || []).map(p => [p.lat, p.lon] as [number, number]),
    [trajectories.fused]
  );

  const mapMatchedPts = useMemo(
    () => (trajectories.map_matched || []).map(p => [p.lat, p.lon] as [number, number]),
    [trajectories.map_matched]
  );

  return (
    <div className="relative w-full h-[480px] rounded-xl overflow-hidden border border-border shadow-2xl bg-surface">
      <MapContainer
        center={center}
        zoom={16}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          url={tileConfig.url}
          attribution={tileConfig.attribution}
          subdomains={tileConfig.subdomains}
          maxZoom={tileConfig.maxZoom}
        />

        {/* 1. Ground Truth - Gray Dashed */}
        {groundTruthPts.length > 1 && (
          <Polyline
            positions={groundTruthPts}
            pathOptions={{ color: '#94A3B8', weight: 2, dashArray: '5, 5' }}
          />
        )}

        {/* 2. Raw GNSS - Red */}
        {gnssPts.length > 1 && (
          <Polyline
            positions={gnssPts}
            pathOptions={{ color: '#EF4444', weight: 3, opacity: 0.8 }}
          />
        )}

        {/* 3. Raw IMU DR - Amber */}
        {rawDrPts.length > 1 && (
          <Polyline
            positions={rawDrPts}
            pathOptions={{ color: '#F59E0B', weight: 2, opacity: 0.7 }}
          />
        )}

        {/* 4. AI Dead Reckoning - Yellow */}
        {aiDrPts.length > 1 && (
          <Polyline
            positions={aiDrPts}
            pathOptions={{ color: '#EAB308', weight: 3 }}
          />
        )}

        {/* 5. Map Matched - Purple */}
        {mapMatchedPts.length > 1 && (
          <Polyline
            positions={mapMatchedPts}
            pathOptions={{ color: '#8B5CF6', weight: 4 }}
          />
        )}

        {/* 6. EKF Fused Trajectory - Cyan */}
        {fusedPts.length > 1 && (
          <Polyline
            positions={fusedPts}
            pathOptions={{ color: '#00B8FF', weight: 5 }}
          />
        )}

        {/* Vehicle Position Marker */}
        <Marker position={center} icon={vehicleIcon}>
          <Popup>
            <div className="text-xs font-bold text-gray-900">
              Vehicle Position<br />
              Lat: {safeToFixed(center[0], 6)}<br />
              Lon: {safeToFixed(center[1], 6)}
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Trajectory Legend Overlay */}
      <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-md p-3 rounded-xl border border-border shadow-xl text-xs space-y-1.5 z-[1000]">
        <div className="font-bold text-text mb-1 uppercase tracking-wider text-[10px]">Trajectory Layers</div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-1 bg-[#00B8FF] rounded"></span>
          <span className="text-text font-semibold">AI + EKF Fused</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-1 bg-[#8B5CF6] rounded"></span>
          <span className="text-muted">Map Matched HMM</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-1 bg-[#EAB308] rounded"></span>
          <span className="text-muted">AI Dead Reckoning</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-1 bg-[#F59E0B] rounded"></span>
          <span className="text-muted">Raw IMU DR</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-1 bg-[#EF4444] rounded"></span>
          <span className="text-muted">Raw GNSS Fix</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-1 border-b border-dashed border-[#94A3B8]"></span>
          <span className="text-muted">Ground Truth</span>
        </div>
      </div>
    </div>
  );
};
