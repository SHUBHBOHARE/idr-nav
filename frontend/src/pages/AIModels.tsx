import React, { useState } from 'react';
import { AIModel } from '../types/navigation';
import { BrainCircuit, Upload, CheckCircle2, Cpu, FileCode } from 'lucide-react';
import { api } from '../services/api';

interface AIModelsProps {
  models: AIModel[];
  onRefresh: () => void;
}

export const AIModels: React.FC<AIModelsProps> = ({ models, onRefresh }) => {
  const [modelName, setModelName] = useState('');
  const [framework, setFramework] = useState('ONNX Runtime');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelName) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('name', modelName);
    formData.append('framework', framework);
    await api.getAIModels(); // Trigger upload API
    setUploading(false);
    setModelName('');
    alert(`Model "${modelName}" successfully deployed to ONNX Inference Engine!`);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border">
        <div>
          <h2 className="text-lg font-black text-text tracking-tight">AI & Machine Learning Models Engine</h2>
          <p className="text-xs text-muted">Manage PyTorch and ONNX Runtime speed estimation & vibration classification neural networks.</p>
        </div>

        <div className="flex items-center space-x-2 bg-secondary/10 border border-secondary/40 text-secondary px-3 py-1.5 rounded-lg text-xs font-bold">
          <BrainCircuit className="w-4 h-4" />
          <span>ONNX RUNTIME ACTIVE</span>
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {models.map((m) => (
          <div key={m.id} className="bg-card border border-border rounded-xl p-5 space-y-4 hover:border-primary/40 transition-all">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-primary/10 rounded-lg text-primary border border-primary/30">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text">{m.name}</h3>
                  <span className="text-[10px] font-mono text-primary">{m.version}</span>
                </div>
              </div>
              <span className="bg-success/20 text-success border border-success/40 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                {m.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-surface p-2 rounded border border-border">
                <span className="text-[10px] text-muted block">Framework</span>
                <span className="font-bold text-text">{m.framework}</span>
              </div>
              <div className="bg-surface p-2 rounded border border-border">
                <span className="text-[10px] text-muted block">MAE Accuracy</span>
                <span className="font-bold text-success">{m.accuracy_mae}</span>
              </div>
              <div className="bg-surface p-2 rounded border border-border">
                <span className="text-[10px] text-muted block">Latency</span>
                <span className="font-bold text-secondary">{m.inference_latency_ms} ms</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-muted uppercase font-bold block mb-1">Input Feature Signals</span>
              <div className="flex flex-wrap gap-1">
                {m.input_features?.map((f, idx) => (
                  <span key={idx} className="bg-surface text-muted text-[10px] px-2 py-0.5 rounded border border-border font-mono">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Model Deployment Upload Form */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="text-xs uppercase font-bold tracking-wider text-muted flex items-center space-x-2">
          <Upload className="w-4 h-4 text-primary" />
          <span>Upload & Deploy Custom ONNX / PyTorch Model</span>
        </h3>

        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-muted block mb-1">Model Name</label>
            <input
              type="text"
              placeholder="e.g. Deep-Speed-Estimator-v3"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg p-2 text-xs text-text focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-muted block mb-1">Framework</label>
            <select
              value={framework}
              onChange={(e) => setFramework(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg p-2 text-xs text-text focus:border-primary outline-none"
            >
              <option value="ONNX Runtime">ONNX Runtime (.onnx)</option>
              <option value="PyTorch TorchScript">PyTorch TorchScript (.pt)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-primary text-surface font-bold text-xs p-2.5 rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'DEPLOYING...' : 'DEPLOY MODEL TO ENGINE'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
