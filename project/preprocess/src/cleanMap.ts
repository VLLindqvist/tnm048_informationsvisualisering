import fs from "fs";
import path from "path";

const translate = require("translate");

const cleanMap = async () => {
  let mapRaw: any = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../../public/map_translated.geo.json"),
    ) as any,
  );

  for (const featureIdx in mapRaw.features) {
    const country = await translate(
      mapRaw.features[featureIdx].properties.name,
      {
        from: "en",
        to: "sv",
        key: "",
      },
    );

    mapRaw.features[featureIdx].properties.name_translation = country;
    console.log(mapRaw.features[featureIdx].properties.name_translation);
  }

  fs.writeFileSync(
    path.join(__dirname, "../../public/map_translated.geo.json"),
    JSON.stringify(mapRaw),
  );
};

export default cleanMap;
