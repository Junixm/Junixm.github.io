// Single source of truth for all site copy.
// Edit ../content.yaml at the project root to update the portfolio —
// the dev server hot-reloads and the build bundles it automatically.
import content from "../content.yaml";

export default content;
export const { hero, about, projects, contact } = content;
