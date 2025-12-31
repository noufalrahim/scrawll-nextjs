import React from "react";
import { NoteEditor } from "@/components/Notes";
import { MainLayout } from "@/layout";
import { ProtectedRoute } from "@/routes";

export default function Notes() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <NoteEditor />
      </MainLayout>
    </ProtectedRoute>
  );
}
