import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  // route("api/analyze", "routes/api.analyze.ts"),
] satisfies RouteConfig;

