import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { MainLayout } from "@/layout";
import type { RootState } from "@/redux/store";
import { ProtectedRoute } from "@/routes";
import { EUrl } from "@/types";

export default function Home() {
  const router = useRouter();
  const note = useSelector((state: RootState) => state.note.entity);

  useEffect(() => {
    if (note && note.id) {
      router.push(EUrl.NOTE.replace(":id", note.id.toString()));
    }
  }, [note]);

  return (
    <ProtectedRoute>
      <MainLayout>
        <div></div>
      </MainLayout>
    </ProtectedRoute>
  );
}
