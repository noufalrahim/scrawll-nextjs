import dynamic from "next/dynamic";

const NoteEditor = dynamic(() => import("./NoteEditorClient"), {
  ssr: false,
});

export default NoteEditor;
