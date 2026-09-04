# Role-Based Access Control (RBAC) Specification — IDR NAV

## 1. User Roles Matrix

| Feature / Action | Admin | Engineer | Researcher | Viewer |
| :--- | :---: | :---: | :---: | :---: |
| **View Dashboard & Telemetry** | ✅ | ✅ | ✅ | ✅ |
| **View Live Map & Trajectories** | ✅ | ✅ | ✅ | ✅ |
| **Trigger GNSS Outage Simulation** | ✅ | ✅ | ✅ | ❌ |
| **Upload Dataset Files** | ✅ | ✅ | ✅ | ❌ |
| **Deploy / Upload AI Models** | ✅ | ✅ | ❌ | ❌ |
| **Modify EKF Tuning Settings** | ✅ | ✅ | ❌ | ❌ |
| **Clear System Event Logs** | ✅ | ❌ | ❌ | ❌ |

---

## 2. RBAC Implementation
- Authenticated users receive JWT bearer tokens containing role claims.
- FastAPI dependency injection enforces permission guards on sensitive endpoints (`POST /api/models/upload`, `POST /api/gnss/simulate-outage`).
