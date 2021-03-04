import { Request, Response } from "express";
import fs from "fs";
import path from "path";

import { Wines } from "../../../src/types";

export const getWines = async (req: Request, res: Response) => {
  const page =
    req.query.page && typeof req.query.page === "string"
      ? Number.parseInt(req.query.page)
      : 1;
  const limit =
    req.query.limit && typeof req.query.limit === "string"
      ? Number.parseInt(req.query.limit)
      : 20;

  const wines: Wines = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../../wines.json")) as any,
  );

  return res
    .status(200)
    .json(wines.slice(limit * page - 1, limit * page + limit - 1));
};
