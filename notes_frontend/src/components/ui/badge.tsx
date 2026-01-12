import { component$, Slot } from "@builder.io/qwik";

export type BadgeVariant = "muted" | "primary" | "warning";

// PUBLIC_INTERFACE
export const Badge = component$((props: { variant?: BadgeVariant; class?: string }) => {
  /** Small pill badge. */
  const v = props.variant ?? "muted";
  return (
    <span class={["badge", `badge--${v}`, props.class ?? ""].filter(Boolean).join(" ")}>
      <Slot />
    </span>
  );
});
