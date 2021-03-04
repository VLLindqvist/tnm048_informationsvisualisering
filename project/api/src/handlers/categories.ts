import { Request, Response } from "express";
import fs from "fs";
import path from "path";

import { Countries, Categories } from "../../../src/types";

export const getCategories = async (req: Request, res: Response) => {
  const categories: Categories = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../../categories.json")) as any,
  );

  return res.status(200).json(categories);
};

export const getCategoriesPerCountry = async (req: Request, res: Response) => {
  const countryName = req.params.countryName;

  if (!countryName)
    return res.status(404).json({ error: "Could not find country" });

  const countries: Countries = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../../countries.json")) as any,
  );
  const country = countries[countryName];

  if (!country)
    return res.status(404).json({ error: "Could not find country" });

  return res.status(200).json(country.categories);
};
