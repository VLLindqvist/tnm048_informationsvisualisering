import { Request, Response } from "express";
import fs from "fs";
import path from "path";

import { Grapes } from "../../../src/types";

export const getGrapes = async (req: Request, res: Response) => {
  const grapes: Grapes = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../../grapes.json")) as any,
  );

  if (!grapes) return res.status(204).end();

  return res.status(200).json(grapes);
};
