/* eslint-disable @typescript-eslint/no-explicit-any */

import { model, models, Schema, Types } from "mongoose";
import type { Note } from "@/domain/entities/NoteEntity";
import type { INoteRepository } from "@/domain/repositories/INoteRepository";
import { buildTree } from "@/lib/utils";

const noteSchema = new Schema(
  {
    title: String,
    content: String,
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Note",
      default: null,
    },
    path: [
      {
        type: Schema.Types.ObjectId,
        ref: "Note",
        index: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        const { _id, __v, ...rest } = ret;
        return {
          ...rest,
          id: _id.toString(),
        };
      },
    },
    toObject: {
      virtuals: true,
      transform(_doc, ret: any) {
        const { _id, __v, ...rest } = ret;
        return {
          ...rest,
          id: _id.toString(),
        };
      },
    },
  },
);

const NoteModel = models.Note || model("Note", noteSchema);

export class NoteRepository implements INoteRepository {
  async create(note: Note): Promise<Note> {
    const _id = new Types.ObjectId();
    note._id = _id;

    let path: Types.ObjectId[];

    if (note.parent) {
      const parentNote = await NoteModel.findById(note.parent).select("path");
      if (!parentNote) throw new Error("Parent note not found");
      path = [...parentNote.path, _id];
    } else {
      path = [_id];
    }

    note.path = path;

    const newNote = await NoteModel.create(note);
    return newNote;
  }

  async find(query?: any): Promise<Note[]> {
    return await NoteModel.find(query);
  }

  async findById(id: Types.ObjectId): Promise<Note | null> {
    return await NoteModel.findById(id);
  }

  async findByWorkspaceId(workspaceId: Types.ObjectId): Promise<any[]> {
    const notes = await NoteModel.find({ workspaceId })
      .sort({ createdAt: 1 })
      .lean();

    const normalized = notes.map((n: any) => {
      const { _id, __v, ...rest } = n;
      return {
        ...rest,
        id: _id.toString(),
      };
    });

    return buildTree(normalized);
  }

  async update(id: Types.ObjectId, data: Partial<Note>): Promise<Note | null> {
    console.log("Datadeq: ", data, id);
    const resp = await NoteModel.findByIdAndUpdate(id, data, { new: true });
    console.log("Res: ", resp);
    return resp;
  }

  async delete(id: Types.ObjectId): Promise<boolean> {
    const result = await NoteModel.deleteMany({ path: id });
    return result.deletedCount !== undefined && result.deletedCount > 0;
  }
}
