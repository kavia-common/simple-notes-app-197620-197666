import {
  $,
  component$,
  type PropFunction,
  useSignal,
  useTask$,
} from "@builder.io/qwik";
import { Button } from "./button";

// PUBLIC_INTERFACE
export const ConfirmModal = component$(
  (props: {
    open: boolean;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm$: PropFunction<() => void>;
    onCancel$: PropFunction<() => void>;
  }) => {
    /** Accessible confirm modal dialog. */
    const confirmRef = useSignal<HTMLButtonElement>();
    const titleId = useSignal(`modal-title-${Math.random().toString(36).slice(2)}`);

    // Only track the serializable `open` boolean inside the task.
    // Avoid referencing function props inside useTask$ to satisfy qwik/valid-lexical-scope.
    useTask$(({ track }) => {
      track(() => props.open);
      if (props.open) {
        queueMicrotask(() => confirmRef.value?.focus());
      }
    });

    const onKeyDown$ = $((ev: KeyboardEvent) => {
      if (ev.key === "Escape") {
        ev.preventDefault();
        props.onCancel$();
      }
    });

    if (!props.open) return null;

    return (
      <div class="modal-overlay" onKeyDown$={onKeyDown$} role="presentation">
        <div
          class="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId.value}
        >
          <div class="modal__header">
            <div class="modal__title" id={titleId.value}>
              {props.title}
            </div>
          </div>

          {props.description && <div class="modal__body">{props.description}</div>}

          <div class="modal__footer">
            <Button variant="ghost" onClick$={props.onCancel$} type="button">
              {props.cancelText ?? "Cancel"}
            </Button>
            <Button
              ref={confirmRef}
              variant="danger"
              onClick$={props.onConfirm$}
              type="button"
            >
              {props.confirmText ?? "Delete"}
            </Button>
          </div>
        </div>
      </div>
    );
  },
);
