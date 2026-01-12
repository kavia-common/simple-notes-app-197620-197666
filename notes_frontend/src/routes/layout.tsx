import { component$, Slot, useStyles$ } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import styles from "./styles.css?inline";
import appStyles from "../styles/app.css?inline";
import { Link, useLocation } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  cacheControl({
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    maxAge: 5,
  });
};

// PUBLIC_INTERFACE
export default component$(() => {
  useStyles$(styles);
  useStyles$(appStyles);

  const loc = useLocation();

  return (
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand" aria-label="Ocean Notes">
          <div class="brand__mark" aria-hidden="true" />
          <div class="brand__text">
            <div class="brand__title">Ocean Notes</div>
            <div class="brand__subtitle">Local-first notes</div>
          </div>
        </div>

        <nav class="nav" aria-label="Primary navigation">
          <Link
            class="nav-link"
            href="/"
            aria-current={loc.url.pathname === "/" ? "page" : undefined}
          >
            <span>All Notes</span>
            <span class="nav-link__hint">Search, sort</span>
          </Link>
        </nav>

        <div style="margin-top:16px" class="kbd-hint">
          Tip: Use <strong>Ctrl/⌘ + S</strong> to save when editing.
        </div>
      </aside>

      <main class="main">
        <div class="container fade-in">
          <Slot />
        </div>
      </main>
    </div>
  );
});
