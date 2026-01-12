import { component$, Slot } from "@builder.io/qwik";

// PUBLIC_INTERFACE
export const Card = component$((props: { class?: string }) => {
  /** Simple surface card wrapper. */
  return (
    <div class={["card", props.class ?? ""].filter(Boolean).join(" ")}>
      <Slot />
    </div>
  );
});
