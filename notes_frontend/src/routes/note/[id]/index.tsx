import {
  component$,
  useComputed$,
  useSignal,
  useVisibleTask$,
  $,
  useTask$,
} from "@builder.io/qwik";
import { useLocation, useNavigate, type DocumentHead } from "@builder.io/qwik-city";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input, Textarea } from "../../../components/ui/input";
import { ConfirmModal } from "../../../components/ui/confirm-modal";
import {
  deleteNote,
  ensureSeededNotes,
  getNoteById,
  updateNote,
  type Note,
} from "../../../lib/notes";
import { renderMarkdownToHtml } from "../../../lib/markdown";

// PUBLIC_INTERFACE
export default component$(() => {
  const loc = useLocation();
  const nav = useNavigate();

  const noteSig = useSignal<Note | undefined>(undefined);
  const titleSig = useSignal("");
  const contentSig = useSignal("");
  const errorSig = useSignal<string | undefined>(undefined);

  const isDirtySig = useSignal(false);
  const isSavingSig = useSignal(false);
  const lastSavedAtSig = useSignal<string | undefined>(undefined);

  const showDeleteSig = useSignal(false);
  const previewSig = useSignal(true);

  const id = loc.params.id;

  useVisibleTask$(() => {
    ensureSeededNotes();
    const note = getNoteById(id);
    noteSig.value = note;
    if (note) {
      titleSig.value = note.title;
      contentSig.value = note.content;
      lastSavedAtSig.value = note.updatedAt;
    }
  });

  // Track changes (dirty state)
  useTask$(({ track }) => {
    track(() => titleSig.value);
    track(() => contentSig.value);

    if (!noteSig.value) return;
    isDirtySig.value =
      titleSig.value !== noteSig.value.title || contentSig.value !== noteSig.value.content;
  });

  const htmlPreview = useComputed$(() => renderMarkdownToHtml(contentSig.value));

  const doSave$ = $(async () => {
    errorSig.value = undefined;
    if (!noteSig.value) {
      errorSig.value = "Note not found. It may have been deleted.";
      return;
    }

    isSavingSig.value = true;
    try {
      const updated = updateNote(noteSig.value.id, {
        title: titleSig.value,
        content: contentSig.value,
      });
      if (!updated) {
        errorSig.value = "Unable to save. Note not found.";
        return;
      }
      noteSig.value = updated;
      lastSavedAtSig.value = updated.updatedAt;
      isDirtySig.value = false;
    } catch (err) {
      errorSig.value = err instanceof Error ? err.message : "Unknown save error.";
    } finally {
      isSavingSig.value = false;
    }
  });

  // Autosave: debounce-ish by saving after user stops typing for ~700ms
  useVisibleTask$(({ track, cleanup }) => {
    track(() => titleSig.value);
    track(() => contentSig.value);

    if (!noteSig.value) return;
    if (!isDirtySig.value) return;

    const t = window.setTimeout(() => {
      doSave$();
    }, 700);

    cleanup(() => window.clearTimeout(t));
  });

  // Keyboard shortcut: Ctrl/⌘ + S to save
  useVisibleTask$(({ cleanup }) => {
    const onKeyDown = (ev: KeyboardEvent) => {
      const isCmdOrCtrl = ev.metaKey || ev.ctrlKey;
      if (isCmdOrCtrl && ev.key.toLowerCase() === "s") {
        ev.preventDefault();
        doSave$();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    cleanup(() => window.removeEventListener("keydown", onKeyDown));
  });

  const onDeleteConfirm$ = $(async () => {
    showDeleteSig.value = false;
    if (!noteSig.value) return;
    deleteNote(noteSig.value.id);
    await nav("/");
  });

  const onBack$ = $(async () => {
    await nav("/");
  });

  if (!noteSig.value) {
    return (
      <div class="grid">
        <header class="header">
          <div>
            <h1>Note not found</h1>
            <p>It may have been deleted or the URL is incorrect.</p>
          </div>
          <div class="actions">
            <Button variant="ghost" onClick$={onBack$} type="button">
              Back to list
            </Button>
          </div>
        </header>

        <div class="empty">
          <strong>Nothing to show.</strong>
          <div style="margin-top:6px">Return to the list to create a new note.</div>
        </div>
      </div>
    );
  }

  return (
    <div class="grid">
      <header class="header">
        <div>
          <h1>Edit note</h1>
          <p>
            {isDirtySig.value ? "Unsaved changes…" : "All changes saved."}{" "}
            {lastSavedAtSig.value ? (
              <span class="kbd-hint">
                Last saved: {new Date(lastSavedAtSig.value).toLocaleTimeString()}
              </span>
            ) : null}
          </p>
        </div>

        <div class="actions">
          <Button variant="ghost" onClick$={onBack$} type="button">
            Back
          </Button>
          <Button
            variant="secondary"
            onClick$={() => (previewSig.value = !previewSig.value)}
            type="button"
          >
            {previewSig.value ? "Hide Preview" : "Show Preview"}
          </Button>
          <Button
            variant="primary"
            onClick$={doSave$}
            disabled={isSavingSig.value || !isDirtySig.value}
            type="button"
          >
            {isSavingSig.value ? "Saving…" : "Save"}
          </Button>
          <Button variant="danger" onClick$={() => (showDeleteSig.value = true)} type="button">
            Delete
          </Button>
        </div>
      </header>

      {errorSig.value && (
        <div class="empty" role="alert" style="border-color: rgba(239,68,68,0.4)">
          <strong style="color: var(--color-error)">Error</strong>
          <div style="margin-top:6px">{errorSig.value}</div>
        </div>
      )}

      <Card>
        <div class="card__pad">
          <div class="split-header">
            <Badge variant="primary">Updated {new Date(noteSig.value.updatedAt).toLocaleString()}</Badge>
            <Badge variant="muted">Created {new Date(noteSig.value.createdAt).toLocaleDateString()}</Badge>
          </div>

          <div style="margin-top:12px" class="grid">
            <Input
              label="Title"
              name="title"
              value={titleSig.value}
              onInput$={(e) => (titleSig.value = (e.target as HTMLInputElement).value)}
            />

            <div class={previewSig.value ? "two-col" : "grid"}>
              <Textarea
                label="Content"
                name="content"
                value={contentSig.value}
                hint="Supports minimal markdown (headings, bold/italic, lists, links, inline code)."
                onInput$={(e) =>
                  (contentSig.value = (e.target as HTMLTextAreaElement).value)
                }
              />

              {previewSig.value && (
                <div class="field">
                  <div class="field__label">Preview</div>
                  <div class="md" dangerouslySetInnerHTML={htmlPreview.value} />
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <ConfirmModal
        open={showDeleteSig.value}
        title="Delete this note?"
        description="This action cannot be undone."
        confirmText="Delete note"
        cancelText="Cancel"
        onCancel$={() => (showDeleteSig.value = false)}
        onConfirm$={onDeleteConfirm$}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Edit Note • Ocean Notes",
};
