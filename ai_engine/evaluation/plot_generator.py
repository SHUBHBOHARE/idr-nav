import os
import json
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend for headless plot generation
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

class SIHPlotGenerator:
    """
    Publication & SIH Report Plot Generator.
    Generates high-resolution trajectory comparison plots, error curves, and comparative bar charts.
    """

    def __init__(self, output_dir: str = "results"):
        self.output_dir = output_dir
        self.traj_dir = os.path.join(output_dir, "trajectory")
        self.error_dir = os.path.join(output_dir, "error")
        self.perf_dir = os.path.join(output_dir, "performance")
        self.reports_dir = os.path.join(output_dir, "reports")

        for d in [self.traj_dir, self.error_dir, self.perf_dir, self.reports_dir]:
            os.makedirs(d, exist_ok=True)

    def generate_all_plots(self, ground_truth: list, trajectories: dict, evaluation_metrics: dict):
        """
        Generates 5 individual method comparison plots, 1 combined plot, 1 error plot, 1 bar chart, and reports.
        """
        gt_lats = [p["lat"] for p in ground_truth]
        gt_lons = [p["lon"] for p in ground_truth]

        method_colors = {
            "GNSS": "#EF4444",
            "Raw IMU Dead Reckoning": "#F59E0B",
            "AI Dead Reckoning": "#3B82F6",
            "AI + EKF": "#8B5CF6",
            "AI + EKF + Map Matching": "#10B981"
        }

        # 1. Individual 5 Trajectory Plots
        for idx, (method_name, pts) in enumerate(trajectories.items(), start=1):
            if not pts:
                continue

            fig, ax = plt.subplots(figsize=(8, 6), dpi=300)
            ax.set_facecolor('#070B14')
            fig.patch.set_facecolor('#070B14')

            lats = [p["lat"] for p in pts]
            lons = [p["lon"] for p in pts]

            ax.plot(gt_lons, gt_lats, color='#94A3B8', linestyle='--', linewidth=2, label='Ground Truth')
            ax.plot(lons, lats, color=method_colors.get(method_name, '#00B8FF'), linewidth=2.5, label=method_name)

            ax.set_title(f"SIH Benchmark: Ground Truth vs {method_name}", color='#F8FAFC', fontsize=12, fontweight='bold')
            ax.set_xlabel("Longitude (deg)", color='#94A3B8')
            ax.set_ylabel("Latitude (deg)", color='#94A3B8')
            ax.tick_params(colors='#94A3B8')
            ax.grid(True, linestyle=':', color='#1F2937')
            ax.legend(facecolor='#0D1320', edgecolor='#1F2937', labelcolor='#F8FAFC')

            filename = f"{idx}_{method_name.lower().replace(' ', '_').replace('+', '')}.png"
            fig.savefig(os.path.join(self.traj_dir, filename), bbox_inches='tight')
            plt.close(fig)

        # 2. Combined All 5 Trajectories Plot
        fig, ax = plt.subplots(figsize=(10, 7), dpi=300)
        ax.set_facecolor('#070B14')
        fig.patch.set_facecolor('#070B14')

        ax.plot(gt_lons, gt_lats, color='#F8FAFC', linestyle='--', linewidth=3, label='Ground Truth (RTK)')
        for method_name, pts in trajectories.items():
            if not pts:
                continue
            lats = [p["lat"] for p in pts]
            lons = [p["lon"] for p in pts]
            ax.plot(lons, lats, color=method_colors.get(method_name, '#00B8FF'), linewidth=2, label=method_name)

        ax.set_title("IDR NAV SIH Benchmark: 5-Method Trajectory Comparison", color='#F8FAFC', fontsize=14, fontweight='bold')
        ax.set_xlabel("Longitude (deg)", color='#94A3B8')
        ax.set_ylabel("Latitude (deg)", color='#94A3B8')
        ax.tick_params(colors='#94A3B8')
        ax.grid(True, linestyle=':', color='#1F2937')
        ax.legend(facecolor='#0D1320', edgecolor='#1F2937', labelcolor='#F8FAFC')

        fig.savefig(os.path.join(self.traj_dir, "combined_trajectories.png"), bbox_inches='tight')
        plt.close(fig)

        # 3. Position Error over Time Plot
        fig, ax = plt.subplots(figsize=(9, 5), dpi=300)
        ax.set_facecolor('#070B14')
        fig.patch.set_facecolor('#070B14')

        time_axis = np.linspace(0, len(ground_truth) * 0.1, len(ground_truth))

        for method_name, pts in trajectories.items():
            if not pts:
                continue
            errs = []
            for i in range(len(pts)):
                dlat = (pts[i]["lat"] - ground_truth[i]["lat"]) * 111000.0
                dlon = (pts[i]["lon"] - ground_truth[i]["lon"]) * 111000.0 * np.cos(np.radians(ground_truth[i]["lat"]))
                errs.append(np.hypot(dlat, dlon))
            ax.plot(time_axis, errs, color=method_colors.get(method_name, '#00B8FF'), linewidth=2, label=method_name)

        ax.axvspan(60, 120, color='#EF4444', alpha=0.15, label='GNSS Outage Window (60-120s)')
        ax.set_title("Positional Drift Error Over Time (Meters)", color='#F8FAFC', fontsize=12, fontweight='bold')
        ax.set_xlabel("Time (seconds)", color='#94A3B8')
        ax.set_ylabel("Error (m)", color='#94A3B8')
        ax.tick_params(colors='#94A3B8')
        ax.grid(True, linestyle=':', color='#1F2937')
        ax.legend(facecolor='#0D1320', edgecolor='#1F2937', labelcolor='#F8FAFC')

        fig.savefig(os.path.join(self.error_dir, "position_error_time.png"), bbox_inches='tight')
        plt.close(fig)

        # 4. RMSE Performance Bar Chart
        fig, ax = plt.subplots(figsize=(8, 5), dpi=300)
        ax.set_facecolor('#070B14')
        fig.patch.set_facecolor('#070B14')

        methods = list(evaluation_metrics.keys())
        rmses = [evaluation_metrics[m]["position_rmse_m"] for m in methods]
        colors = [method_colors.get(m, '#00B8FF') for m in methods]

        bars = ax.bar(methods, rmses, color=colors, width=0.5)
        ax.set_title("Position RMSE Comparison Across Methods (Meters)", color='#F8FAFC', fontsize=12, fontweight='bold')
        ax.set_ylabel("RMSE Error (m)", color='#94A3B8')
        ax.tick_params(colors='#94A3B8')
        plt.xticks(rotation=15, ha='right', color='#94A3B8')
        ax.grid(True, linestyle=':', color='#1F2937', axis='y')

        for bar in bars:
            yval = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2.0, yval + 0.5, f"{yval:.2f}m", ha='center', va='bottom', color='#F8FAFC', fontweight='bold', fontsize=9)

        fig.savefig(os.path.join(self.perf_dir, "rmse_comparison_barchart.png"), bbox_inches='tight')
        plt.close(fig)

        # 5. Save JSON & CSV Reports
        with open(os.path.join(self.reports_dir, "sih_evaluation_summary.json"), "w") as f:
            json.dump(evaluation_metrics, f, indent=2)

        df_metrics = pd.DataFrame.from_dict(evaluation_metrics, orient='index')
        df_metrics.to_csv(os.path.join(self.reports_dir, "sih_evaluation_summary.csv"), index=False)

        print(f"[PlotGenerator] SIH evaluation plots & reports generated successfully in {self.output_dir}/")
