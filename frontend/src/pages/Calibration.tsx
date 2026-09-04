import React, { useState, useEffect } from 'react';
import { Sliders, RotateCcw, CheckCircle2, AlertTriangle, ShieldCheck, Compass } from 'lucide-react';
import axios from 'axios';

export const Calibration: React.FC = () => {
  const [calibState, setCalibState] = useState<{
    state: string;
    pitch_deg: number;
    roll_deg: number;
    yaw_deg: number;
    calibration_confidence: number;
    is_calibrated: boolean;
  }>({
    state: 'CALIBRATED',
    pitch_deg: 12.4,
    roll_deg: -3.2,
    yaw_deg: 0.0,
    calibration_confidence: 0.96,
    is_calibrated: true
  });

  const [calibrating, setCalibrating] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await axios.get('/api/calibration/status');
      setCalibState(res.data);
    } catch (e) {
      console.warn("Calibration poll error:", e);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleStartCalibration = async () => {
    setCalibrating(true);
    try {
      const res = await axios.post('/api/calibration/start');
      setCalibState(res.data);
    } catch (e) {
      alert("Error starting calibration: " + e);
    } finally {
      setCalibrating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border">
        <div>
          <h2 className="text-lg font-black text-text tracking-tight">In-Vehicle Mount Alignment & Calibration Engine</h2>
          <p className="text-xs text-muted">Estimates smartphone mount tilt (Pitch, Roll, Yaw) to rotate raw sensor vectors into vehicle body frame.</p>
        </div>

        <button
          onClick={handleStartCalibration}
          disabled={calibrating}
          className="bg-primary text-surface font-bold text-xs px-4 py-2 rounded-lg hover:bg-primary/90 transition-all flex items-center space-x-2 shadow-lg shadow-primary/20"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{calibrating ? 'CALIBRATING MOUNT...' : 'START CALIBRATION'}</span>
        </button>
      </div>

      {/* State Banner */}
      <div className={`p-4 rounded-xl border flex items-center justify-between shadow-lg ${
        calibState.is_calibrated
          ? 'bg-success/10 border-success/40 text-success'
          : 'bg-warning/10 border-warning/40 text-warning animate-pulse'
      }`}>
        <div className="flex items-center space-x-3">
          <ShieldCheck className="w-7 h-7" />
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest block text-muted">Calibration State Machine</span>
            <div className="text-xl font-black">{calibState.state}</div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-muted block">Alignment Confidence</span>
          <span className="text-lg font-black text-primary">{(calibState.calibration_confidence * 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* Angles Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-5 space-y-2 text-center">
          <span className="text-xs font-bold uppercase text-muted block">Pitch Angle (Tilt)</span>
          <div className="text-3xl font-black text-primary">{calibState.pitch_deg}°</div>
          <span className="text-[11px] text-muted block">Forward / Backward Mount Pitch</span>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 space-y-2 text-center">
          <span className="text-xs font-bold uppercase text-muted block">Roll Angle (Bank)</span>
          <div className="text-3xl font-black text-secondary">{calibState.roll_deg}°</div>
          <span className="text-[11px] text-muted block">Side-to-Side Mount Tilt</span>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 space-y-2 text-center">
          <span className="text-xs font-bold uppercase text-muted block">Yaw Angle (Azimuth)</span>
          <div className="text-3xl font-black text-success">{calibState.yaw_deg}°</div>
          <span className="text-[11px] text-muted block">Motion-based Chassis Alignment</span>
        </div>
      </div>

      {/* Rotation Transformation Explanation */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="text-xs uppercase font-bold tracking-wider text-muted flex items-center space-x-2">
          <Compass className="w-4 h-4 text-primary" />
          <span>Smartphone Frame $\rightarrow$ Vehicle Body Frame Rotation Matrix</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-surface p-4 rounded-xl border border-border space-y-2">
            <span className="text-muted block text-[10px]">RAW SMARTPHONE ACCEL [a_x, a_y, a_z]</span>
            <div className="text-text font-bold">[ 0.15 m/s², 0.08 m/s², 9.78 m/s² ]</div>
            <p className="text-[11px] font-sans text-muted">Unaligned phone coordinate frame dependent on vehicle phone holder tilt.</p>
          </div>

          <div className="bg-surface p-4 rounded-xl border border-primary/40 space-y-2">
            <span className="text-primary block text-[10px]">TRANSFORMED VEHICLE BODY FRAME [Forward, Lateral, Vertical]</span>
            <div className="text-primary font-bold">[ 0.12 m/s², 0.00 m/s², 9.81 m/s² ]</div>
            <p className="text-[11px] font-sans text-muted">Rotated into true vehicle chassis frame for accurate kinematic DR integration.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
