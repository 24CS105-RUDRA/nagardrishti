# NagarDrishti (नगर दृष्टि)
### City-Wide ANPR Trajectory Tracking & Traffic Analytics Platform
**Developed for Bharat Electronics Limited (BEL) – Smart City Traffic Automation**

NagarDrishti is an enterprise-grade, frontend-only surveillance and traffic analytics platform built for smart cities (seeded for the Ahmedabad–Gandhinagar–Anand highway triangle in Gujarat). It emulates a mission-critical government command console with live simulated optical telemetry, automated license plate recognition (ANPR), continuous vehicle trajectory mapping, real-time alert broadcasts, and deep traffic analytics.

---

## 🚀 Quick Start (Run Locally)

```bash
# Navigate to the project directory
cd nagardrishti

# Install dependencies (if not already installed)
npm install

# Start the Vite development server
npm run dev
```

Open your browser at: **[http://localhost:5173](http://localhost:5173)**

---

## 🏛️ Visual & Architectural Highlights
- **Government Light Portal Aesthetic:** Indian tri-color strip, emblem icon, navy blue headers (`#1F3A6E`), saffron highlight chips (`#E8891A`), soft status chips, formal zebra-striped tables.
- **Accessibility & Assistive Tech:** Built-in **A- / A / A+** text size zoom controls in header, ARIA labels on all modals, high-contrast readable color schemes.
- **Interactive OpenStreetMap Leaflet Grid:**
  - 50 real Gujarat junction nodes across Ahmedabad, Gandhinagar, and Anand.
  - Heatmap density blobs layer.
  - Congestion zone overlays.
  - Numbered path markers with confidence-colored polylines and moving vehicle playback.
- **Diurnal Analytics & Matrix Visualizations:** Recharts peak diurnal traffic flow, origin-destination (O-D) matrix heatmap grid, vehicle classification donut, and segment speed bars.
- **Simulated Real-Time Engine:**
  - Dynamic alert dispatches every 20–30s with audio-visual toasts and unread count badges.
  - Live plate OCR feeds auto-updating every 3.5s in the Live Map drawer.
  - Real-time density index fluctuations.

---

## 🧭 Step-by-Step Demo Script

Follow this 2-minute walkthrough to test all features:

1. **Login (`/login`):**
   - The portal features a pre-filled government login screen.
   - Enter Officer ID (e.g. `BEL-IND-8841`), Password (`GovPortal@2026`), select role **Traffic Analyst**, and verify math captcha (`7 + 3 = 10`).
   - Click **Sign In to Command Console** to enter the Dashboard.

2. **Dashboard (`/`):**
   - Inspect the **5 KPI Cards** (Vehicles Detected Today, Active Cameras 46/50, Active Alerts, Avg Speed, OCR Accuracy).
   - Test the **Time Range** buttons (`1h`, `6h`, `24h`, `7d`) to watch charts update.
   - Toggle map layers using the chips: **Heatmap Blobs**, **Camera Nodes**, **Congestion Zones**.
   - In the **Critical Congestion Bottlenecks** table, click on any row (e.g. `CG Road – Swastik Crossroads`) to automatically pan the Leaflet map and open the node floating details panel.
   - Click **Export Report** (top right) and choose **Export as PDF** or **Export Raw CSV Data** to trigger an automated export generation.

3. **Plate Search & Trajectory Tracking (`/search`):**
   - Click **Plate Search** in the sidebar.
   - In the plate input, type `GJ01` to view the fuzzy autocomplete suggestions.
   - Select or search **`GJ01AB1234`** and click **Track Vehicle**.
   - Notice the **Summary Metrics Strip** showing distance, travel time, and cameras crossed.
   - In the playback controller, click **Replay Trajectory** to watch the animated vehicle marker travel along the route across Ahmedabad! Toggle between **1x, 2x, 4x** speed.
   - On any timeline card, click **View Snapshot** to inspect the simulated optical camera capture with the license plate bounding box overlay.
   - Click **Flag Match** on an ambiguous read to forward it to the verification queue.
   - Click **Add to Blacklist** to open the intercept modal and enact an automatic alarm.

4. **Live Camera Network Map (`/live-map`):**
   - Navigate to **Live Map** in the sidebar.
   - View all 50 camera nodes across Gujarat.
   - Click any camera marker to open the right-hand **Optical RTSP Stream panel**.
   - Watch the **Live Plate Detections** stream update automatically every 3.5 seconds with fresh vehicle reads and confidence scores.

5. **Alerts Center & Live Simulation (`/alerts`):**
   - Navigate to **Alerts Center**.
   - Notice the unread badge in the header and sidebar.
   - Within 20–30 seconds, a new live incident will automatically trigger with an animated highlight and toast notification!
   - Select one or more alerts using the checkboxes and click **Acknowledge Selected**.
   - On any row, click **Resolve** to add an operator closing note, or click **Escalate** to assign it to senior command.

6. **Blacklist Manager (`/blacklist`):**
   - Review 25 pre-seeded blacklisted vehicles.
   - Click **Add Plate** and test the Indian plate format regex validation (`GJ01AB1234`).
   - Click **Bulk Import CSV** to preview and ingest external state police lookout datasets.

7. **Manual Review Queue (`/review`):**
   - Review low-confidence optical reads (<85%).
   - Edit the plate text directly in the card and click **Correct & Save** or **Confirm** to verify.

8. **Statutory Reports (`/reports`) & System Settings (`/settings`):**
   - Generate a custom statutory report and watch the simulated compilation progress bar.
   - Visit Settings to adjust neural OCR cutoffs, congestion sensitivity sliders, and review personnel roles.

---

## 🛠️ Tech Stack
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4 (Official Government Light Palette)
- **Routing:** React Router v7
- **Mapping:** Leaflet & React-Leaflet (OpenStreetMap Light Tiles, Custom DivIcon Markers, Polylines, Circles)
- **Charts:** Recharts (Diurnal Area Chart, Density Line Chart, Segment Speed Bar Chart, Vehicle Donut)
- **Icons:** Lucide React
- **State Management:** Zustand (Auth, Live Alerts, Toasts, UI Zoom)

---

© 2026 Bharat Electronics Limited. Designed for Smart City Traffic Automation.
