"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setNote } from "@/redux/noteSlice";
import { setWorkspace } from "@/redux/workspaceSlice";
import { useReadData } from "../hooks/useReadData";
import { setUser } from "../redux/userSlice";
import {
  EUrl,
  type TNote,
  type TUser,
  type TWorkspace,
} from "../types";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const [workspaceId, setWorkspaceId] = useState<string | null | undefined>(
    undefined,
  );
  const [noteId, setNoteId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const t = localStorage.getItem("token");
      const w = localStorage.getItem("workspace");
      const n = localStorage.getItem("note");
      setToken(t);
      setWorkspaceId(w);
      setNoteId(n);
      if (!t) {
        router.replace(EUrl.SIGNIN);
      }
    }
  }, [router]);

  const { data, isLoading, isError } = useReadData<{
    success: boolean;
    data: TUser | null;
    message: string;
  }>("users", "/get-token");

  const { data: workspaceData, isLoading: workspaceLoading } = useReadData<{
    success: boolean;
    data: TWorkspace | null;
    message: string;
  }>("workspaces", `/workspaces?id=${workspaceId}&type=id`);

  const { data: noteData, isLoading: noteLoading } = useReadData<{
    success: boolean;
    data: TNote | null;
    message: string;
  }>("notes", `/notes?id=${noteId}&type=id`);

  useEffect(() => {
    console.log("Data: ", data);
    if (data?.success && data.data) {
      dispatch(setUser(data.data));
    }
    if (workspaceData?.success && workspaceData.data) {
      dispatch(setWorkspace(workspaceData.data));
    }
    if (noteData?.success && noteData.data) {
      dispatch(setNote(noteData.data));
    }
  }, [data, dispatch, workspaceData, noteData]);

  if (token === undefined || workspaceId === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  if (!token) {
    return null;
  }

  if (isLoading || workspaceLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    router.replace(EUrl.SIGNIN);
  }

  return <>{children}</>;
}
