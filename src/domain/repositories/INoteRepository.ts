import type { Types } from "mongoose";
import type { Note } from "../entities/NoteEntity";

export interface INoteRepository {
  create(note: Note): Promise<Note>;
  find(): Promise<Note[]>;
  findById(id: Types.ObjectId): Promise<Note | null>;
  update(id: Types.ObjectId, data: Partial<Note>): Promise<Note | null>;
  delete(id: Types.ObjectId): Promise<boolean>;
  findByWorkspaceId(workspaceId: Types.ObjectId): Promise<Note[]>;
}
