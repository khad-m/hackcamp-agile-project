import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../shared/ui/Layout";

import { OverviewPage } from "../pages/OverviewPage";
import { HistogramPage } from "../pages/HistogramPage";
import { ClassSizesPage } from "../pages/ClassSizesPage";
import { TrendPage } from "../pages/TrendPage";
import { BenchmarksPage } from "../pages/BenchmarksPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <OverviewPage /> },
      { path: "histogram", element: <HistogramPage /> },
      { path: "class-sizes", element: <ClassSizesPage /> },
      { path: "trend", element: <TrendPage /> },
      { path: "benchmarks", element: <BenchmarksPage /> },
    ],
  },
]);
