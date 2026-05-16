# CodeTuner Viz: Full-Stack Code Metrics Visualisation Dashboard

## Project Overview
CodeTuner Viz is a full-stack static analysis dashboard designed to monitor, aggregate, and display software quality metrics across development projects. Developed as part of Salford HackCamp, the system processes repository data, including lines of code, method counts, code smells, and cyclomatic complexity. Visualising the results through dynamic frontend graphs.

The application uses a completely decoupled architecture, combining a React frontend built with Vite and TypeScript with a Node.js Express backend API, utilising Prisma ORM to communicate with a remote PostgreSQL database hosted on a server network.

## Backend Data Architecture & Query Optimisation
To process data snapshots efficiently without causing severe application bottlenecks, the database logic relies heavily on server-side aggregation:

* **Time-Series Truncation:** Tracking historical code degradation utilises database timeline truncation operations (`date_trunc('week', commit_date)`) to aggregate and smooth shifting complexity averages over distinct calendar windows.
* **Database-Level Classification:** Rather than dragging heavy record logs into the Node.js layer to filter them manually, the repository runs structural conditional operations to categorise cyclomatic complexity boundaries directly at the database core.
* **Common Table Expressions (CTEs):** Software repositories frequently contain multi-commit histories. To extract current software baselines, the repository utilises custom CTEs to dynamically isolate and resolve calculations against only the latest available commit snapshot.

## Technical Implementation Highlights

### Robust Request Validation (`src/features/metrics/api/metrics.controller.ts`)
To protect backend routing channels from corrupted arguments or type collisions, incoming query parameters are validated defensively at the controller entry boundary using strict Zod schemas:

```typescript
const classSizesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).default(50),
  project: z.string().min(1).optional()
});
```

### Memory-Safe Component Lifecycle Handling (src/pages/HistogramPage.tsx)
The frontend dashboard requests asynchronous data feeds and maps them dynamically via Recharts. To prevent runtime warnings or memory leakages caused by background state resolutions on unmounted views, data loops are bound to active lifecycle safety markers:

```typescript
React.useEffect(() => {
  let alive = true;
  (async () => {
    try {
      const d = await api.getComplexityHistogram();
      if (alive) setData(d);
    } catch (e) {
      if (alive) setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      if (alive) setLoading(false);
    }
  })();
  return () => { alive = false; }; // Invalidate active thread on component unmount
}, [api]);
```

## Security & Infrastructure Configuration

* **Credential Isolation:** System connection attributes and sensitive data routes are extracted completely out of the application code base and isolated inside environment variable configurations (.env), keeping security keys out of version control histories.
* **Secure Database Infrastructure Routing:** Production queries are bound securely to the remote database using local port forwarding through encrypted network tunnels (ssh -N -L), ensuring database connections are never left exposed to open public networks.

## Technology Stack & Dependencies

* **Frontend Dashboard Architecture:** React 18+, Vite, TypeScript, TailwindCSS
* **Data Visualisation Engine:** Recharts (Dynamic SVG Charting)
* **Backend Application Server:** Node.js runtime, Express framework, TypeScript
* **Database Interface Layer:** Prisma ORM connecting to a PostgreSQL Database
* **Data Validation:** Zod Runtime Schema Validation
