import type { TUser } from "./TUser";
import type { TWorkspace } from "./TWorkspace";

export type TNote = {
  id?: string;
  title: string;
  content: string;
  workspace?: TWorkspace | string;
  createdBy?: TUser | string;
  users?: TUser[] | string[];
  parent?: TNote | string | null;
  children?: TNote[] | string[];
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
};
