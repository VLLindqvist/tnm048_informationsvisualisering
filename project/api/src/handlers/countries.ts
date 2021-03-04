import { Request, Response } from "express";
import fs from "fs";
import path from "path";

import { Countries } from "../../../src/types";

export const getCountries = async (req: Request, res: Response) => {
  const countries: Countries = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../../countries.json")) as any,
  );

  for (const countryName in countries) {
    delete countries[countryName].wines;
    delete countries[countryName].categories;
  }

  return res.status(200).json(countries);
};

export const getCountry = async (req: Request, res: Response) => {
  const countryName = req.params.countryName;

  if (!countryName)
    return res.status(404).json({ error: "Could not find country" });

  const page =
    req.query.page && typeof req.query.page === "string"
      ? Number.parseInt(req.query.page)
      : 1;
  const limit =
    req.query.limit && typeof req.query.limit === "string"
      ? Number.parseInt(req.query.limit)
      : 20;

  const countries: Countries = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../../countries.json")) as any,
  );
  const country = countries[countryName];

  if (!country)
    return res.status(404).json({ error: "Could not find country" });

  country.wines = country.wines?.slice(
    limit * page - 1,
    limit * page + limit - 1,
  );

  return res.status(200).json(country);
};
