import React from "react";
import { NavLink, Outlet } from "react-router-dom";

function PillLink(props: { to: string; children: React.ReactNode; end?: boolean }) {
  return (
    <NavLink
      to={props.to}
      end={props.end}
      className={({ isActive }) => (isActive ? "pill active" : "pill")}
    >
      {props.children}
    </NavLink>
  );
}

export function Layout() {
  return (
    <div className="appShell">
      <header className="topbar">
        <div className="topbarInner">
          <div className="brand">
            <div className="brandMark">CT</div>
            <div className="brandText">
              <div className="brandName">Code Tuner Viz</div>
              <div className="brandSub">Complexity &amp; maintainability dashboard</div>
            </div>
          </div>

          <nav className="navPills" aria-label="Primary">
            <PillLink to="/" end>Overview</PillLink>
            <PillLink to="/histogram">Histogram</PillLink>
            <PillLink to="/class-sizes">Class Sizes</PillLink>
            <PillLink to="/trend">Trend</PillLink>
            <PillLink to="/benchmarks">Benchmarks</PillLink>
          </nav>
        </div>
      </header>

      <main className="container">
        <Outlet />
      </main>

      <footer className="footer">
        Data source: Poseidon PostgreSQL  Charts: Recharts  Highlighting: Prism
      </footer>
    </div>
  );
}
