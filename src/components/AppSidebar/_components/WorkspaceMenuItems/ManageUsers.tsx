// import { Loader2, MoreHorizontalIcon } from "lucide-react";
// import { useState } from "react";
// import { useSelector } from "react-redux";
// import { toast } from "sonner";
// import { DialogModal } from "@/components/DialogModal";
// import { DynamicForm } from "@/components/DynamicForm";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useCreateData } from "@/hooks/useCreateData";
// import { useReadData } from "@/hooks/useReadData";
// import { withNA } from "@/lib/utils";
// import type { RootState } from "@/redux/store";
// import type { TUser } from "@/types";

// interface IManageUsers {
//   workspaceId: string;
//   workspaceName: string;
// }

// export default function ManageUsers({
//   workspaceId,
//   workspaceName,
// }: IManageUsers) {
//   const [openAddPeople, setOpenAddPeople] = useState<boolean>(false);
//   const [keyword, setKeyword] = useState<string>("");

//   const user = useSelector((state: RootState) => state.user.entity);

//   const { mutate: sendEmailMutate, isPending: sendEmailPending } =
//     useCreateData<
//       {
//         inviterEmail: string;
//         inviterName: string;
//         workspaceName: string;
//         inviteeName: string;
//         inviteeEmail: string;
//         invitationId: string;
//         workspaceId: string;
//       },
//       {
//         success: boolean;
//         message: string;
//       }
//     >("/dispatch");

//   // const { data: workspaceMembers, isPending: workspaceMembersPending } =
//   //   useReadData<{
//   //     success: boolean;
//   //     message: string;
//   //     data: TWorkspaceMember[];
//   //   }>(
//   //     "get_all_workspace_users",
//   //     `/workspace-members?type=workspace-id&workspaceId=${workspaceId}`,
//   //   );

//   const { data: searchUsers, isPending: searchUsersPending } = useReadData<{
//     success: boolean;
//     message: string;
//     data: TUser[];
//   }>(
//     "get_many_by_email",
//     keyword.length >= 7
//       ? `/users?type=get_many_by_email&keyword=${keyword}`
//       : null,
//   );

//   // const {
//   //   mutate: createWorkspaceMemberMutate,
//   //   isPending: isCreatingWorkspaceMember,
//   // } = useCreateData<
//   //   Omit<TWorkspaceMember, "user">,
//   //   { success: boolean; data: TWorkspaceMember; message: string }
//   // >("/workspace-members");

//   return (
//     <div className="h-full">
//       <div className="flex flex-row items-center justify-between">
//         <div className="flex flex-col gap-y-1">
//           <h1 className="text-xl font-semibold tracking-tight">Manage Users</h1>
//           <p className="italic text-muted-foreground text-xs">
//             Manage all users, roles and permissions
//           </p>
//         </div>
//         <Button onClick={() => setOpenAddPeople(true)}>Add people</Button>
//       </div>

//       <div className="py-10">
//         <Table>
//           <TableCaption>List of users in the workspace.</TableCaption>

//           <TableHeader>
//             <TableRow>
//               <TableHead className="w-[220px]">Email</TableHead>
//               <TableHead>Name</TableHead>
//               <TableHead>Role</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {/* {workspaceMembersPending && (
//               <TableRow>
//                 <TableCell colSpan={5}>
//                   <div className="flex justify-center py-10">
//                     <Loader2 className="animate-spin" />
//                   </div>
//                 </TableCell>
//               </TableRow>
//             )} */}

//             {!workspaceMembersPending &&
//               workspaceMembers?.data?.map((dt) => (
//                 <TableRow key={(dt?.user as TUser)?.id}>
//                   <TableCell className="font-medium">{dt.userEmail}</TableCell>
//                   <TableCell>{withNA((dt?.user as TUser)?.name)}</TableCell>
//                   <TableCell>{dt?.role}</TableCell>
//                   <TableCell>Active</TableCell>
//                   <TableCell className="text-right">
//                     <DropdownMenu modal={false}>
//                       <DropdownMenuTrigger asChild>
//                         <Button
//                           variant="ghost"
//                           aria-label="Open menu"
//                           size="sm"
//                         >
//                           <MoreHorizontalIcon />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent className="w-40" align="end">
//                         <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                         <DropdownMenuGroup>
//                           <DropdownMenuItem>Edit Role</DropdownMenuItem>
//                           <DropdownMenuItem className="text-red-500">
//                             Remove
//                           </DropdownMenuItem>
//                         </DropdownMenuGroup>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </TableCell>
//                 </TableRow>
//               ))}
//           </TableBody>

//           <TableFooter>
//             <TableRow>
//               <TableCell colSpan={4}>Total users</TableCell>
//               <TableCell className="text-right">
//                 {workspaceMembers?.data?.length ?? 0}
//               </TableCell>
//             </TableRow>
//           </TableFooter>
//         </Table>
//       </div>

//       <DialogModal
//         open={openAddPeople}
//         setOpen={setOpenAddPeople}
//         title="Add People"
//         description="Search by email"
//       >
//         <DynamicForm
//           schema={[
//             {
//               name: "email",
//               label: "Email",
//               type: "text",
//               placeholder: "Enter email...",
//               layout: { colSpan: 12 },
//             },
//             {
//               name: "role",
//               label: "Role",
//               type: "dropdown",
//               placeholder: "Select role..",
//               options: [
//                 { label: "Admin", value: "admin" },
//                 { label: "Editor", value: "editor" },
//                 { label: "Viewer", value: "viewer" },
//               ],
//               layout: { colSpan: 12 },
//             },
//           ]}
//           defaultValues={{
//             email: "noufal_b220444cs@nitc.ac.in",
//             role: "member",
//           }}
//           onSubmit={(data) => {
//             const payload: Omit<TWorkspaceMember, "user"> = {
//               workspace: workspaceId,
//               userEmail: data.email,
//               role: data.role,
//               pending: true,
//               approved: false,
//             };
//             createWorkspaceMemberMutate(payload, {
//               onSuccess: (res) => {
//                 if (res && res.success && res.data) {
//                   const emailPaylaod = {
//                     inviterEmail: user?.email!,
//                     inviterName: user?.name!,
//                     workspaceName: workspaceName,
//                     inviteeName: data.email,
//                     inviteeEmail: data.email,
//                     invitationId: res.data.id!,
//                     workspaceId: workspaceId,
//                   };
//                   console.log("Email payload: ", emailPaylaod);
//                   sendEmailMutate(emailPaylaod, {
//                     onSuccess: (res) => {
//                       if (res && res.success) {
//                         toast.success("Invitation sent successfully", {
//                           position: "top-right",
//                         });
//                         setOpenAddPeople(false);
//                       } else {
//                         toast.error("Something went wrong", {
//                           position: "top-right",
//                         });
//                       }
//                     },
//                     onError: () => {
//                       toast.error("Something went wrong", {
//                         position: "top-right",
//                       });
//                     },
//                   });
//                 } else {
//                   toast.error("Something went wrong", {
//                     position: "top-right",
//                   });
//                 }
//               },
//               onError: () => {
//                 toast.error("Something went wrong", { position: "top-right" });
//               },
//             });
//           }}
//           loading={sendEmailPending}
//         />
//       </DialogModal>
//     </div>
//   );
// }
