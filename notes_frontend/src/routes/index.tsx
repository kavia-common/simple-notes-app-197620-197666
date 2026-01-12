import { component$, useComputed$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link, useNavigate } from "@builder.io/qwik-city";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { createNote, ensureSeededNotes, listNotes, type Note } from "../lib/notes";

type SortMode = "updated_desc" | "updated_asc" | "title_asc";

// PUBLIC_INTERFACE
export default component$(() => {
  const nav = useNavigate();

  const notesSig = useSignal<Note[]>([]);
  const querySig = useSignal("");
  const sortSig = useSignal<SortMode>("updated_desc");
  const createTitleSig = useSignal("");
  const createErrorSig = useSignal<string | undefined>(undefined);

  useVisibleTask$(() => {
    ensureSeededNotes();
    notesSig.value = listNotes();
  });

  const filteredSorted = useComputed$(() => {
    const q = querySig.value.trim().toLowerCase();
    const filtered = q
      ? notesSig.value.filter((n) => {
          const hay = `${n.title}\n${n.content}`.toLowerCase();
          return hay.includes(q);
        })
      : notesSig.value.slice();

    const sortMode = sortSig.value;
    filtered.sort((a, b) => {
      if (sortMode === "updated_desc") return b.updatedAt.localeCompare(a.updatedAt);
      if (sortMode === "updated_asc") return a.updatedAt.localeCompare(b.updatedAt);
      // title_asc
      return a.title.localeCompare(b.title);
    });

    return filtered;
  });

  const onCreate$ = $(async () => {
    createErrorSig.value = undefined;
    const title = createTitleSig.value.trim();
    if (!title) {
      createErrorSig.value = "Please provide a title (or type any character).";
      return;
    }
    const note = createNote({ title, content: "" });
    notesSig.value = listNotes();
    createTitleSig.value = "";
    await nav(`/note/${note.id}`);
  });

  return (
    <div class="grid">
      <header class="header">
        <div>
          <h1>Your notes</h1>
          <p>Create, search, edit, and keep everything stored on this device.</p>
        </div>

        <div class="toolbar" aria-label="Notes actions">
          <div style="min-width:260px">
            <Input
              label="Search"
              name="search"
              placeholder="Search title or content…"
              value={querySig.value}
              onInput$={(e) => (querySig.value = (e.target as HTMLInputElement).value)}
            />
          </div>

          <div style="min-width:220px" class="field">
            <label class="field__label" for="sort">
              Sort
            </label>
            <select
              id="sort"
              class="select"
              value={sortSig.value}
              onChange$={(e) =>
                (sortSig.value = (e.target as HTMLSelectElement).value as SortMode)
              }
            >
              <option value="updated_desc">Recently updated</option>
              <option value="updated_asc">Least recently updated</option>
              <option value="title_asc">Title (A → Z)</option>
            </select>
          </div>
        </div>
      </header>

      <Card>
        <div class="card__pad">
          <div class="split-header">
            <div>
              <div style="font-weight:750; letter-spacing:-0.02em">Create a note</div>
              <div class="field__hint">Starts with a title. You can add content later.</div>
            </div>
            <Badge variant="primary">{notesSig.value.length} total</Badge>
          </div>

          <div style="margin-top:12px" class="two-col">
            <Input
              label="Title"
              name="title"
              placeholder="e.g., Meeting notes"
              value={createTitleSig.value}
              error={createErrorSig.value}
              onInput$={(e) =>
                (createTitleSig.value = (e.target as HTMLInputElement).value)
              }
              onKeyDown$={(e) => {
                if (e.key === "Enter") onCreate$();
              }}
            />
            <div class="field" style="align-self:end">
              <Button onClick$={onCreate$} type="button">
                Create & Open
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {filteredSorted.value.length === 0 ? (
        <div class="empty" role="status" aria-live="polite">
          <strong>No notes found.</strong>
          <div style="margin-top:6px">
            {notesSig.value.length === 0
              ? "Create your first note above."
              : "Try a different search query or clear the filter."}
          </div>
        </div>
      ) : (
        <div class="grid" aria-label="Notes list">
          {filteredSorted.value.map((n) => (
            <Link key={n.id} href={`/note/${n.id}`} style="text-decoration:none">
              <div class="card card--clickable">
                <div class="card__pad note-row">
                  <div class="note-row__title">{n.title}</div>
                  <div class="note-row__preview">
                    {n.content.trim() ? n.content.trim() : "No content yet."}
                  </div>
                  <div class="note-row__meta">
                    <span>Updated: {new Date(n.updatedAt).toLocaleString()}</span>
                    <span>Created: {new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Ocean Notes",
  meta: [
    {
      name: "description",
      content: "Local-first notes app (Qwik) with search, edit, and markdown preview.",
    },
  ],
};
