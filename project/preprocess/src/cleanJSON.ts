import fs from "fs";
import path from "path";

import {
  Categories,
  Grapes,
  Wines,
  Countries,
  CategoryName,
} from "../../src/types";

const cleanJSON = async () => {
  let wines: Wines = [];
  let countries: Countries = {};
  let grapes: Grapes = {};
  let categories: Categories = {
    "Rött vin": 0,
    "Vitt vin": 0,
    "Mousserande vin": 0,
    Rosévin: 0,
  };

  const winesRaw: any[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../systembolaget.json")) as any,
  );

  const WINE_categories = [
    "Rött vin",
    "Vitt vin",
    "Mousserande vin",
    "Rosévin",
  ];
  const NON_DESIRED_COUNTRIES = [
    "Internationellt märke",
    "EU",
    "Varierande ursprung",
    "Övriga ursprung",
  ];

  for (const wine of winesRaw) {
    if (
      WINE_categories.includes(wine["type"]) &&
      wine["volume"] === 750 &&
      !NON_DESIRED_COUNTRIES.includes(wine["country"])
    ) {
      const bitter = Number.parseFloat(wine["tasteBitter"].split("%")[0]) / 100;
      delete wine["tasteBitter"];

      const sweetness =
        Number.parseFloat(wine["tasteSweetness"].split("%")[0]) / 100;
      delete wine["tasteSweetness"];

      const fruitAcid =
        Number.parseFloat(wine["tasteFruitAcid"].split("%")[0]) / 100;
      delete wine["tasteFruitAcid"];

      const body = Number.parseFloat(wine["tasteBody"].split("%")[0]) / 100;
      delete wine["tasteBody"];

      const roughness =
        Number.parseFloat(wine["tasteRoughness"].split("%")[0]) / 100;
      delete wine["tasteRoughness"];

      const current_grapes = wine["grapes"] ? wine["grapes"].split("---") : [];

      if (
        bitter + body + fruitAcid + roughness + sweetness + sweetness !== 0 &&
        wine["taste"] &&
        current_grapes.length &&
        wine["year"]
      ) {
        const current_wine = {
          ...wine,
          taste: {
            text: wine["taste"],
            bitter,
            sweetness,
            fruitAcid,
            body,
            roughness,
          },
          grapes: current_grapes,
        };

        const current_category = wine["type"] as CategoryName;

        if (wine["country"]) {
          if (wine["country"] in countries) {
            countries[wine["country"]].wines = [
              ...(countries[wine["country"]].wines || []),
              current_wine,
            ];
            ++countries[wine["country"]].amountOfWines;
          } else {
            countries[wine["country"]] = {
              id: Math.floor(Math.random() * 100),
              name: wine["country"],
              amountOfWines: 1,
              wines: [current_wine],
              categories: {
                "Rött vin": 0,
                "Vitt vin": 0,
                "Mousserande vin": 0,
                Rosévin: 0,
              },
            };
          }

          ++(countries[wine["country"]].categories as Categories)[
            current_category
          ];
        }
        if (wine["type"]) {
          ++categories[current_category];
        }
        for (const grape of current_grapes) {
          if (grape) {
            if (grape in grapes) {
              ++grapes[grape];
            } else {
              grapes[grape] = 1;
            }
          }
        }

        wines = [...wines, current_wine];
      }
    }
  }

  fs.writeFileSync(
    path.join(__dirname, "../../api/wines.json"),
    JSON.stringify(wines),
  );
  fs.writeFileSync(
    path.join(__dirname, "../../api/countries.json"),
    JSON.stringify(countries),
  );
  fs.writeFileSync(
    path.join(__dirname, "../../api/categories.json"),
    JSON.stringify(categories),
  );
  fs.writeFileSync(
    path.join(__dirname, "../../api/grapes.json"),
    JSON.stringify(grapes),
  );
};

export default cleanJSON;
