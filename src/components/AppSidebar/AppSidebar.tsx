"use client";

import { faker } from "@faker-js/faker";
import { Home, Inbox, Plus, Search, Settings, Trash2 } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import z from "zod";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useCreateData } from "@/hooks/useCreateData";
import { useDeleteData } from "@/hooks/useDeleteData";
import { useReadData } from "@/hooks/useReadData";
import { setNote } from "@/redux/noteSlice";
import type { RootState } from "@/redux/store";
import { EUrl, type TNote } from "@/types";
import { DialogModal } from "../DialogModal";
import { DynamicForm } from "../DynamicForm";
import { SidebarFooter, SidebarHeader } from "./_components";
import ExtSidebarNoteItem from "./_components/ExtSidebarNoteItem";

const appItems = [
  { title: "Home", url: "#", icon: Home },
  { title: "Inbox", url: "#", icon: Inbox },
  { title: "Search", url: "#", icon: Search },
  { title: "Settings", url: "#", icon: Settings },
  { title: "Trash", url: "#", icon: Trash2 },
];

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  emoji: z.string().min(1, "Emoji is required"),
});

export default function AppSidebar() {
  const skeletons = Array.from({ length: 5 });

  const [open, setOpen] = useState<boolean>(false);

  const user = useSelector((state: RootState) => state.user.entity);
  const workspace = useSelector((state: RootState) => state.workspace.entity);
  const note = useSelector((state: RootState) => state.note.entity);

  const dispatch = useDispatch();

  const router = useRouter();

  const {
    data: notes,
    isPending: isFetchingNotes,
    refetch: refetchNotes,
  } = useReadData<{
    success: boolean;
    data: TNote[];
    message: string;
  }>(
    "notes-by-workspace-id",
    `/notes?workspaceId=${workspace?.id}&type=workspace-id`,
  );

  const { mutate: createNote, isPending: isCreating } = useCreateData<
    TNote,
    {
      success?: boolean;
      data?: TNote;
      message?: string;
    }
  >("/notes");

  const { mutate: deleteNoteMutate, isPending: deleteNoteIsPending } =
    useDeleteData<{
      success: boolean;
      data: null;
      message: string;
    }>("/notes");

  const handleDeleteNote = (noteId: string) => {
    deleteNoteMutate(
      {
        id: noteId,
      },
      {
        onSuccess: (res) => {
          if (res?.success) {
            toast.success("Note deleted successfully", {
              position: "top-right",
            });
            refetchNotes();
          } else {
            toast.error("An error occured while deleting note", {
              position: "top-right",
            });
          }
        },
        onError: () => {
          toast.error("An error occured while deleting note", {
            position: "top-right",
          });
        },
      },
    );
  };

  const handleAddNote = (parent: TNote) => {
    dispatch(setNote(parent));
    setOpen(true);
  };

  const handleOnSubmit = (data: z.infer<typeof formSchema>) => {
    if (!workspace || !workspace?.id) {
      toast.error("No workspace found. Choose a workspace first", {
        position: "top-right",
      });
      return;
    }
    if (!user || !user?.id) {
      router.push(EUrl.SIGNIN);
      return;
    }
    createNote(
      {
        title: data.name,
        icon: data.emoji,
        content:
          '[{"id":"68f749dc-29d0-448a-9cb8-63f943b3f097","type":"paragraph","props":{"backgroundColor":"default","textColor":"default","textAlignment":"left"},"content":[],"children":[]},{"id":"c7545fc9-3e81-4815-9034-bcbb176b581d","type":"paragraph","props":{"backgroundColor":"default","textColor":"default","textAlignment":"left"},"content":[],"children":[]}]',
        workspace: workspace.id,
        createdBy: user.id!,
        parent: note?.id,
      },
      {
        onSuccess: (res) => {
          if (res?.success && res?.data) {
            refetchNotes();
            toast.success("Note created successfully!", {
              position: "top-right",
            });
            setOpen(false);
          } else {
            toast.error("An unknown error occured!", { position: "top-right" });
          }
        },
        onError: (err) => {
          console.log("Error creating note ", err);
          toast.error("An unknown error occured!", { position: "top-right" });
        },
      },
    );
  };

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {appItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Notes</SidebarGroupLabel>
          <SidebarGroupAction title="Add Note">
            <Plus
              onClick={() => {
                dispatch(setNote(null));
                setOpen(true);
              }}
            />
            <span className="sr-only">Add Note</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            {isFetchingNotes && (
              <SidebarMenu>
                {skeletons.map((_, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuSkeleton />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            )}
            {notes &&
              notes?.data?.length > 0 &&
              notes?.data?.map((p, i) => (
                <ExtSidebarNoteItem
                  key={i}
                  note={p}
                  onAddNote={handleAddNote}
                  onDeleteNote={handleDeleteNote}
                />
              ))}
            {notes && notes?.data?.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center text-xs p-6 gap-2">
                <p className="italic text-gray-500">No Notes yet!</p>
                <p
                  className="underline italic cursor-pointer hover:text-gray-700 transition"
                  onClick={() => setOpen(true)}
                >
                  Click here to add your first note
                </p>
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
      <DialogModal
        title="Create Note"
        description="Enter your note details here"
        open={open}
        setOpen={setOpen}
      >
        <DynamicForm
          formClass="space-y-6"
          gridClass="grid grid-cols-12 gap-6"
          schema={[
            {
              name: "emoji",
              label: "Note Emoji",
              type: "text",
              placeholder: "Emoji..",
              constraint: "emoji",
              layout: { colSpan: 3 },
              wrapperClass: "space-y-2",
              labelClass: "text-sm font-medium text-gray-700",
              inputClass:
                "h-12 text-2xl text-center border rounded-xl bg-gray-50",
            },
            {
              name: "name",
              label: "Note Title",
              type: "text",
              placeholder: "Title..",
              layout: { colSpan: 9 },
              wrapperClass: "space-y-2",
              labelClass: "text-sm font-medium text-gray-700",
              inputClass: "h-12 px-4 border rounded-xl bg-gray-50",
            },
          ]}
          defaultValues={{
            name: faker.book.title(),
            emoji: faker.internet.emoji(),
          }}
          onSubmit={(data) => handleOnSubmit(data)}
          loading={isCreating}
        />
      </DialogModal>
    </Sidebar>
  );
}
