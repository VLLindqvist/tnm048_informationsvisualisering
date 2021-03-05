import { Request, Response } from "express";
import fs from "fs";
import path from "path";

import { Countries, Wine, Wines } from "../../../src/types";

export const getWines = async (req: Request, res: Response) => {
  // const page =
  //   req.query.page && typeof req.query.page === "string"
  //     ? Number.parseInt(req.query.page)
  //     : 1;
  // const limit =
  //   req.query.limit && typeof req.query.limit === "string"
  //     ? Number.parseInt(req.query.limit)
  //     : 20;

  const wines: Wines = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../../wines.json")) as any,
  );

  if (!wines) return res.status(204).end();

  let newWines: Wine[] = [];

  for (const wine of wines) {
    newWines = [...newWines, wine];
  }

  if (!newWines) return res.status(204).end();

  return res.status(200).json(newWines);
  // .json(wines.slice(limit * page - 1, limit * page + limit - 1));
};

export const getWinesByCountry = async (req: Request, res: Response) => {
  const countryName = req.params.countryName;

  if (!countryName) return res.status(404).json("Couldn't find country");

  const countries: Countries = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../../countries.json")) as any,
  );

  if (!(countryName in countries))
    return res.status(404).json("Couldn't find country");

  const current_country = countries[countryName];

  const wines = current_country.wines;

  if (!wines) return res.status(204).end();

  let newWines: Wine[] = [];

  for (const wine of wines) {
    const taste = wine.taste;

    if (
      taste.bitter +
        taste.body +
        taste.fruitAcid +
        taste.roughness +
        taste.sweetness +
        taste.sweetness !==
        0 &&
      taste.text &&
      wine.grapes.length
    ) {
      newWines = [...newWines, wine];
    }
  }

  return res.status(200).json(newWines);
};
