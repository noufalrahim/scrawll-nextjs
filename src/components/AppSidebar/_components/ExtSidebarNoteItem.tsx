import {
  ChevronRight,
  File,
  FileText,
  Folder,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { useRouter } from "next/router";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { exportNote, setNote } from "@/redux/noteSlice";
import type { RootState } from "@/redux/store";
import { EUrl, type TNote } from "@/types";

interface IExtSidebarNoteItem {
  note: TNote;
  onAddNote: (parent: TNote) => void;
  depth?: number;
  onDeleteNote: (note: string) => void;
}

export default function ExtSidebarNoteItem({
  note,
  onAddNote,
  onDeleteNote,
  depth = 0,
}: IExtSidebarNoteItem) {
  const noteState = useSelector((state: RootState) => state.note.entity);

  const dispatch = useDispatch();

  const hasChildren = !!note.children?.length;
  const isSelected = noteState?.id === note.id;

  const router = useRouter();

  const maxTitleLength = Math.max(8, 24 - depth * 3);

  const title = `${note.title.slice(0, maxTitleLength)}${
    note.title.length > maxTitleLength ? "…" : ""
  }`;

  return (
    <Collapsible className="group">
      <div
        className={cn(
          "flex items-center rounded-md px-2 py-1 my-[1px] hover:bg-gray-200 cursor-pointer",
          isSelected && "bg-gray-300",
        )}
      >
        <CollapsibleTrigger
          className="flex items-center gap-1 flex-1 min-w-0 text-left py-1"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(setNote(note));
            localStorage.setItem("note", note.id!);
            router.push(EUrl.NOTE.replace(":id", note.id!));
          }}
        >
          {hasChildren ? (
            <ChevronRight className="h-3.5 w-3.5 shrink-0 transition-transform group-data-[state=open]:rotate-90" />
          ) : (
            <span className="w-3.5 shrink-0" />
          )}
          {
            note.icon ? (
              <span>{note.icon}</span>
            ) : hasChildren ? (
              <FileText className="h-3.5 w-3.5 shrink-0" />
            ) : (
              <File className="h-3.5 w-3.5 shrink-0" />
            )
          }
          <span className="truncate text-xs leading-tight">{title}</span>
        </CollapsibleTrigger>

        <div
          className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <Plus
            size={15}
            className="cursor-pointer hover:bg-gray-200 rounded-md"
            onClick={() => onAddNote(note)}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MoreHorizontal
                size={15}
                className="cursor-pointer hover:bg-gray-200 rounded-md"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start">
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <DropdownMenuItem onClick={() => dispatch(exportNote(note.id as string))}>Export as PDF</DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDeleteNote(note.id as string)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {hasChildren && (
        <CollapsibleContent
          className="ml-2 space-y-0.5"
          onClick={() => console.log("Clicc")}
        >
          {note.children!.map((child) => (
            <ExtSidebarNoteItem
              key={(child as TNote).id}
              note={child as TNote}
              onAddNote={onAddNote}
              depth={depth + 1}
              onDeleteNote={onDeleteNote}
            />
          ))}
        </CollapsibleContent>
      )}
    </Collapsible>
  );
}
