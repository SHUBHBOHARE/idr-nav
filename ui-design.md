# UI/UX Design System Specification — IDR NAV

## 1. Dark Theme Color Palette
The IDR NAV application follows a strict **Premium Dark Theme** design aesthetic inspired by modern aerospace defense and autonomous vehicle telemetry dashboards.

| Element | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Primary Background** | `#070B14` | Deep Charcoal background |
| **Surface Container** | `#0D1320` | Secondary surface background |
| **Card Container** | `#111827` | Rounded card background |
| **Border Accent** | `#1F2937` | Subtle contrast border |
| **Primary Accent** | `#00B8FF` | Cyan active state & primary telemetry |
| **Secondary Accent** | `#7C3AED` | Purple AI model & heading metrics |
| **Success Status** | `#22C55E` | Green healthy state & GNSS lock |
| **Warning Status** | `#F59E0B` | Amber degradation & Dead Reckoning |
| **Danger / Alert** | `#EF4444` | Red GNSS outage alerts & high drift |
| **Primary Text** | `#F8FAFC` | High contrast body text |
| **Muted Text** | `#94A3B8` | Subtitle & metadata labels |

---

## 2. Component Design Principles
- **No Overused Gradients**: Clean dark surfaces with subtle borders (`#1F2937`) and soft drop shadows.
- **Glassmorphism TopBar**: Sticky header (`#0D1320` with `backdrop-blur-md`).
- **Prominent Mode Badges**: Navigation mode banner (`GNSS + INS` vs `AI DEAD RECKONING`) visually stands out with pulsating state indicators.
- **High-Contrast Telemetry Cards**: Metric values formatted with `font-black` and bold typography.
- **Dark Mode Map Styling**: MapLibre / Leaflet tiles inverted and color-shifted to blend naturally into dark theme `#070B14`.
