import { component$, type QwikIntrinsicElements } from "@builder.io/qwik";

// PUBLIC_INTERFACE
export const Input = component$(
  (
    props: QwikIntrinsicElements["input"] & {
      label: string;
      error?: string;
      hint?: string;
    },
  ) => {
    /** Labeled input with accessible error/hint messaging. */
    const { label, error, hint, id, class: className, ...rest } = props;
    const inputId = id ?? `input-${rest.name ?? Math.random().toString(36).slice(2)}`;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div class="field">
        <label class="field__label" for={inputId}>
          {label}
        </label>
        <input
          {...rest}
          id={inputId}
          class={["input", error ? "input--error" : "", className ?? ""]
            .filter(Boolean)
            .join(" ")}
          aria-invalid={!!error}
          aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
        />
        {hint && !error && (
          <div class="field__hint" id={hintId}>
            {hint}
          </div>
        )}
        {error && (
          <div class="field__error" id={errorId} role="alert">
            {error}
          </div>
        )}
      </div>
    );
  },
);

// PUBLIC_INTERFACE
export const Textarea = component$(
  (
    props: QwikIntrinsicElements["textarea"] & {
      label: string;
      error?: string;
      hint?: string;
    },
  ) => {
    /** Labeled textarea with accessible error/hint messaging. */
    const { label, error, hint, id, class: className, ...rest } = props;
    const inputId =
      id ?? `textarea-${rest.name ?? Math.random().toString(36).slice(2)}`;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div class="field">
        <label class="field__label" for={inputId}>
          {label}
        </label>
        <textarea
          {...rest}
          id={inputId}
          class={["textarea", error ? "textarea--error" : "", className ?? ""]
            .filter(Boolean)
            .join(" ")}
          aria-invalid={!!error}
          aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
        />
        {hint && !error && (
          <div class="field__hint" id={hintId}>
            {hint}
          </div>
        )}
        {error && (
          <div class="field__error" id={errorId} role="alert">
            {error}
          </div>
        )}
      </div>
    );
  },
);
