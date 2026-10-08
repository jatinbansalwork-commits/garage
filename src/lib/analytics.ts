import { track } from "@vercel/analytics";

export type ProjectOpenSource = "projects";

export type ContactMethod = "linkedin" | "email" | "jb_manual" | "github";

export type CaseStudyScrollDepth = 25 | 50 | 75 | 100;

export type IndexNavigateMethod = "scroll" | "nav" | "keyboard" | "minimap";

export function trackContactClick(method: ContactMethod): void {
  track("contact_click", { method });
}

/** Once per session — landing context; pair with Countries filter in Vercel Analytics. */
export function trackSiteEntry(properties: {
  landing_path: string;
  referrer_host: string;
  timezone: string;
  locale: string;
}): void {
  track("site_entry", properties);
}

export function trackResumeDownload(): void {
  track("resume_download");
}

/** Projects index row click — before case study navigation. */
export function trackProjectListClick(properties: {
  slug: string;
  title: string;
  year: string;
}): void {
  track("project_list_click", properties);
}

/** Projects index CTA — external Framer portfolio 1.0. */
export function trackPortfolio1Click(url: string): void {
  track("portfolio_1_click", { url: url.slice(0, 200) });
}

export function trackProjectOpen(
  slug: string,
  source: ProjectOpenSource,
  title?: string,
): void {
  track("project_open", {
    slug,
    source,
    ...(title ? { title } : {}),
  });
}

/** Design review essay page load (`/craft/design-review-checklist`). */
export function trackDesignReviewView(slug: string): void {
  track("design_review_view", { slug });
}

/** AI Experiment gallery page load (`/ideas`). */
export function trackAiExperimentView(): void {
  track("ai_experiment_view");
}

/** Craft gallery page load (`/craft`). */
export function trackCraftView(): void {
  track("craft_view");
}

/** Craft article in-page section jump (header section nav). */
export function trackCraftSectionJump(properties: { slug: string; section: string }): void {
  track("craft_section_jump", {
    slug: properties.slug.slice(0, 80),
    section: properties.section.slice(0, 80),
  });
}

/** Garage page load (`/garage` → `purpose`, `/garage/[slug]` → slug). */
export function trackGarageView(slug: string): void {
  track("garage_view", { slug: slug.slice(0, 80) });
}

export type GarageAction =
  | "box_flip"
  | "signup"
  | "first_tweak"
  | "replay"
  | "reset"
  | "copy_values";

export function trackGarageAction(properties: {
  slug: string;
  action: GarageAction;
  detail?: string;
}): void {
  track("garage_action", {
    slug: properties.slug.slice(0, 80),
    action: properties.action,
    ...(properties.detail ? { detail: properties.detail.slice(0, 40) } : {}),
  });
}

/** Projects index page load (`/projects`). */
export function trackProjectsView(): void {
  track("projects_view");
}

/** Me / archive page load (`/archive`). */
export function trackArchiveView(): void {
  track("archive_view");
}

/** JB's Case Notes article page load (`/notes/1`). */
export function trackFieldNotesView(properties: {
  note_id: string;
  title: string;
}): void {
  track("field_notes_view", {
    note_id: properties.note_id,
    title: properties.title,
  });
}

/** AI Experiment detail modal opened from the gallery grid. */
export function trackAiExperimentDetailView(slug: string): void {
  track("ai_experiment_detail_view", { slug });
}

/** AI Experiment gallery interaction — detail modal or live demo CTA. */
export function trackAiExperimentItemClick(properties: {
  slug: string;
  cta: "card" | "live-demo" | string;
  url: string;
}): void {
  track("ai_experiment_item_click", properties);
}

export function trackCraftItemClick(properties: {
  slug: string;
  category: string;
  external: boolean;
}): void {
  track("craft_item_click", properties);
}

/** Craft gallery filter tab change — legacy bento gallery only. */
export function trackCraftFilter(filter: string): void {
  track("craft_filter", { filter });
}

/** Index slide link click — visitor leaves the slider for a section (or opens an external tab). */
export function trackIndexSlideClick(properties: {
  frame_id: string;
  frame_label: string;
  href: string;
  external?: boolean;
}): void {
  track("index_slide_click", {
    frame_id: properties.frame_id,
    frame_label: properties.frame_label,
    href: properties.href,
    ...(properties.external != null ? { external: properties.external } : {}),
  });
}

export function trackCaseStudyScrollDepth(
  slug: string,
  depth: CaseStudyScrollDepth,
): void {
  track("case_study_scroll_depth", { slug, depth: String(depth) });
}

export function trackIndexFrameView(properties: {
  frame_id: string;
  frame_label: string;
  index: number;
}): void {
  track("index_frame_view", {
    frame_id: properties.frame_id,
    frame_label: properties.frame_label,
    index: String(properties.index),
  });
}

export function trackIndexFrameNavigate(properties: {
  from: string;
  to: string;
  method: IndexNavigateMethod;
}): void {
  track("index_frame_navigate", properties);
}

export function trackExternalDemoOpen(properties: {
  slug: string;
  url: string;
  surface?: "ai-experiment" | "craft";
}): void {
  track("external_demo_open", {
    slug: properties.slug,
    url: properties.url,
    ...(properties.surface ? { surface: properties.surface } : {}),
  });
}

export type MediaPlaySurface = "case-study" | "craft" | "ai-experiment";

export function mediaIdFromSrc(src: string): string {
  const normalized = src.split("?")[0]?.split("#")[0] ?? src;
  const segment = normalized.split("/").pop();
  if (!segment) return src;
  return segment.replace(/\.[^.]+$/, "");
}

export function trackMediaPlay(properties: {
  surface: MediaPlaySurface;
  media_id: string;
  slug?: string;
}): void {
  track("media_play", {
    surface: properties.surface,
    media_id: properties.media_id,
    ...(properties.slug ? { slug: properties.slug } : {}),
  });
}

export function trackGoogleEasterEgg(kind: "barrel_roll" | "askew" | "feeling_lucky"): void {
  track("google_easter_egg", { kind });
}

export function trackManifestVisit(count: number): void {
  track("manifest_visit", { count: String(count) });
}

/** Policy Copilot interactive demo — Cisco case study hero workspace. */
export type PolicyCopilotDemoAction =
  | "prompt_select"
  | "understand_intent"
  | "clarification_answer"
  | "clarification_field_edit"
  | "clarification_field_why"
  | "draft_revealed"
  | "validation_complete"
  | "simulation_visible"
  | "recommendation_apply"
  | "recommendation_dismiss"
  | "approve"
  | "reset"
  | "dashboard_stat"
  | "save_draft"
  | "share_review";

export function trackPolicyCopilotDemo(properties: {
  action: PolicyCopilotDemoAction;
  scenario_id?: string;
  prompt?: string;
  clarification_id?: string;
  recommendation_id?: string;
  confidence?: number;
}): void {
  track("policy_copilot_demo", {
    action: properties.action,
    slug: "cisco-policy-copilot",
    ...(properties.scenario_id ? { scenario_id: properties.scenario_id } : {}),
    ...(properties.prompt ? { prompt: properties.prompt.slice(0, 80) } : {}),
    ...(properties.clarification_id
      ? { clarification_id: properties.clarification_id }
      : {}),
    ...(properties.recommendation_id
      ? { recommendation_id: properties.recommendation_id }
      : {}),
    ...(properties.confidence != null
      ? { confidence: String(properties.confidence) }
      : {}),
  });
}
