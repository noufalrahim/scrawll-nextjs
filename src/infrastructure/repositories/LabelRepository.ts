/* eslint-disable @typescript-eslint/no-explicit-any */

import { model, models, Schema } from "mongoose";
import type { Label } from "@/domain/entities/LabelEntity";
import type { ILabelRepository } from "@/domain/repositories/ILabelRepository";

const labelSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const LabelModel = models.Label || model("Label", labelSchema);

export class LabelRepository implements ILabelRepository {
  async create(label: Label | Label[]): Promise<Label | Label[]> {
    const newLabel = await LabelModel.create(label);
    return newLabel;
  }

  async find(query?: any): Promise<Label[]> {
    return await LabelModel.find(query);
  }

  async findById(id: string): Promise<Label | null> {
    return await LabelModel.findById(id);
  }

  async update(id: string, data: Partial<Label>): Promise<Label | null> {
    return await LabelModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await LabelModel.findByIdAndDelete(id);
    return result ? true : false;
  }
}
