"use client";

import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { useModifyData } from "@/hooks/useModifyData";
import { useReadData } from "@/hooks/useReadData";
import type { TNote } from "@/types";

export default function NoteEditorClient() {
  const editor = useCreateBlockNote();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();
  const noteId = router.query.id as string | undefined;

  const { data: notesData } = useReadData<{ data: TNote }>(
    "notes",
    noteId ? `/notes?id=${noteId}&type=id` : null,
  );

  const { mutate: updateNote } = useModifyData<
    { _id: string; content: string },
    { success: boolean }
  >("/notes");

  useEffect(() => {
    if (!editor) return;
    if (!noteId) return;
    if (!notesData?.data?.content) return;

    const parsedContent = JSON.parse(notesData.data.content);

    editor.replaceBlocks(editor.document, parsedContent);
  }, [editor, noteId, notesData]);

  useEffect(() => {
    if (!editor || !noteId) return;

    const unsubscribe = editor.onChange(() => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        const content = JSON.stringify(editor.document);

        updateNote({
          identifier: {
            key: "_id",
            value: noteId,
          },
          updates: {
            content,
          },
        });
      }, 800);
    });

    return () => {
      unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [editor, noteId]);

  return <BlockNoteView editor={editor} theme="light" />;
}
