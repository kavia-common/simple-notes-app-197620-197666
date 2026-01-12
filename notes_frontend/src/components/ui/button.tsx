import { component$, Slot, type QwikIntrinsicElements } from "@builder.io/qwik";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export type ButtonSize = "sm" | "md";

// PUBLIC_INTERFACE
export const Button = component$(
  (
    props: QwikIntrinsicElements["button"] & {
      variant?: ButtonVariant;
      size?: ButtonSize;
      fullWidth?: boolean;
    },
  ) => {
    /** Themed button component with variants/sizes. */
    const {
      variant = "primary",
      size = "md",
      fullWidth,
      class: className,
      ...rest
    } = props;

    const classes = [
      "btn",
      `btn--${variant}`,
      `btn--${size}`,
      fullWidth ? "btn--full" : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button {...rest} class={classes}>
        <Slot />
      </button>
    );
  },
);
