"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import html2pdf from "html2pdf.js";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

import { useModifyData } from "@/hooks/useModifyData";
import { useReadData } from "@/hooks/useReadData";
import type { TNote } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { clearExport } from "@/redux/noteSlice";

export default function NoteEditorClient() {
  const editor = useCreateBlockNote();
  const router = useRouter();
  const noteId = router.query.id as string | undefined;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const viewRef = useRef<HTMLDivElement | null>(null);

  const { data: notesData } = useReadData<{ data: TNote }>(
    "notes",
    noteId ? `/notes?id=${noteId}&type=id` : null
  );

  const exportNoteId = useSelector(
    (state: RootState) => state.note.entity,
  );

  const { mutate: updateNote } = useModifyData<
    { _id: string; content: string },
    { success: boolean }
  >("/notes");

  useEffect(() => {
    if (!editor || !notesData?.data?.content) return;
    editor.replaceBlocks(editor.document, JSON.parse(notesData.data.content));
  }, [editor, notesData]);

  useEffect(() => {
    if (!editor || !noteId) return;

    const unsubscribe = editor.onChange(() => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        updateNote({
          identifier: { key: "_id", value: noteId },
          updates: { content: JSON.stringify(editor.document) }
        });
      }, 800);
    });

    return () => {
      unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [editor, noteId]);

  useEffect(() => {
    if (!exportNoteId) return;

    const run = async () => {
      const res = await fetch(`/api/notes?id=${exportNoteId}&type=id`);
      const json = (await res.json()) as { data: TNote };

      if (!json?.data?.content) return;

      editor.replaceBlocks(
        editor.document,
        JSON.parse(json.data.content)
      );

      requestAnimationFrame(() => {
        if (!viewRef.current) return;

        html2pdf()
          .from(viewRef.current)
          .set({
            filename: `${json.data.title}.pdf`,
            margin: 12,
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a4" },
          })
          .save()
          .finally(() => (clearExport()));
      });
    };

    run();
  }, [exportNoteId]);

  const exportPDF = () => {
    if (!viewRef.current) return;

    html2pdf()
      .from(viewRef.current)
      .set({
        filename: `note-${noteId}.pdf`,
        margin: 12,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      })
      .save();
  };

  return (
    <div ref={viewRef}>
      <BlockNoteView editor={editor} theme="light" />
    </div>
  );
}
