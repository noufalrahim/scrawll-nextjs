import type { Types } from "mongoose";

export class Note {
  constructor(
    public title: string,
    public content: string,
    public workspaceId: Types.ObjectId,
    public projectId: Types.ObjectId,
    public createdBy: Types.ObjectId,
    public users: Types.ObjectId[],
    public path: Types.ObjectId[],
    public icon: string,
    public parent?: Types.ObjectId,
    public _id?: Types.ObjectId,
  ) {}
}
