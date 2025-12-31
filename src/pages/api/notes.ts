import type { Types } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { NoteController } from "@/controllers/NoteController";

const controller = new NoteController();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  if (method === "GET") {
    const { id, type } = req.query;
    if (type === "id" && id) {
      const result = await controller.getNoteById(
        id as unknown as Types.ObjectId,
      );
      return res.status(200).json(result);
    }

    if (type === "workspace-id") {
      console.log("Here");
      const result = await controller.getNotesByWorkspaceId(
        id as unknown as Types.ObjectId,
      );
      return res.status(200).json(result);
    }

    const result = await controller.getAllNotes();
    return res.status(200).json(result);
  }

  if (method === "POST") {
    const result = await controller.createNote(req.body);
    return res.status(201).json(result);
  }

  if (method === "PATCH") {
    const result = await controller.updateNote(req.body.identifier.value, {
      content: req.body.updates.content,
    });

    return res.status(200).json(result);
  }

  if (method === "DELETE") {
    const result = await controller.deleteNote(
      req.query.id as unknown as Types.ObjectId,
    );
    return res.status(200).json(result);
  }

  return res.status(405).json({
    success: false,
    message: "Method Not Allowed",
  });
}
