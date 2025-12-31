import type { Types } from "mongoose";
import type { Note } from "@/domain/entities/NoteEntity";
import { connectDB } from "@/infrastructure/db/connect";
import { NoteRepository } from "@/infrastructure/repositories/NoteRepository";

export class NoteController {
  async createNote(data: Note) {
    try {
      await connectDB();
      const repo = new NoteRepository();
      const result = await repo.create(data);
      return {
        success: true,
        data: result,
        message: "Note created successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.message || "Failed to create Note",
      };
    }
  }

  async getAllNotes() {
    try {
      await connectDB();
      const repo = new NoteRepository();
      const result = await repo.find();
      return {
        success: true,
        data: result,
        message: "Notes fetched successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.message || "Failed to fetch Notes",
      };
    }
  }

  async getNotesByWorkspaceId(id: Types.ObjectId) {
    try {
      await connectDB();
      const repo = new NoteRepository();
      const result = await repo.findByWorkspaceId(id);
      return {
        success: true,
        data: result,
        message: "Notes fetched successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.message || "Failed to fetch Notes",
      };
    }
  }

  async getNoteById(id: Types.ObjectId) {
    try {
      await connectDB();
      const repo = new NoteRepository();
      const result = await repo.findById(id);
      return {
        success: true,
        data: result,
        message: "Note fetched successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.message || "Failed to fetch Note",
      };
    }
  }

  async updateNote(id: Types.ObjectId, data: Partial<Note>) {
    try {
      await connectDB();
      const repo = new NoteRepository();
      console.log("Data: ", data);
      const result = await repo.update(id, data);
      console.log("Res: ", result);
      return {
        success: true,
        data: result,
        message: "Note updated successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.message || "Failed to update Note",
      };
    }
  }

  async deleteNote(id: Types.ObjectId) {
    try {
      await connectDB();
      const repo = new NoteRepository();
      const result = await repo.delete(id);
      return {
        success: true,
        data: result,
        message: "Note deleted successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.message || "Failed to delete Note",
      };
    }
  }
}
