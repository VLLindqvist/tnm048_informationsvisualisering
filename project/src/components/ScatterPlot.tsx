import { FC, useEffect, useState, ChangeEvent } from "react";
import { Scatter } from "react-chartjs-2";
import useSWR from "swr";
import { Categories, CategoryName, Taste, Wine } from "../types";
import { getFetcher } from "../utils/fetchers";
import { RootStateOrAny, useSelector } from "react-redux";
import { countryRedux } from "../redux/country";
import { ChartDataSets, Point } from "chart.js";
import { colors, hoverColors } from "../utils/constants";
import linearLeastSquares from "../dataMining/linearLeastSquares";
import Loader from "./Loader";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Input,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#fff",
    },
  },
});

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    width: "50vw",
    height: "50vh",
  },
  selects: {
    display: "flex",
    flexDirection: "column",
  },
  formControl: {
    margin: "10px",
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
});

interface PointWithCategory extends Point {
  category: CategoryName;
  grapes: string[];
}

interface Label {
  taste: boolean;
  key: keyof Taste | keyof Wine;
  name: string;
}

const OPTIONS: Label[] = [
  { taste: false, key: "alcoholPercentage", name: "Alkoholprocent" },
  { taste: false, key: "price", name: "Pris" },
  { taste: false, key: "year", name: "Årgång" },
  { taste: true, key: "sweetness", name: "Sötma" },
  { taste: true, key: "fruitAcid", name: "Fruktsyra" },
  { taste: true, key: "body", name: "Fyllighet" },
  { taste: true, key: "roughness", name: "Strävhet" },
];

type ScatterPlotProps = {
  categories?: Categories;
};
const ScatterPlot: FC<ScatterPlotProps> = ({ categories }) => {
  const classes = useStyles();

  const [xyValues, setXYValues] = useState<PointWithCategory[]>([]);
  const [xLabel, setXLabel] = useState<Label>(OPTIONS[0]);
  const [yLabel, setYLabel] = useState<Label>(OPTIONS[1]);
  const [availableGrapes, setAvailableGrapes] = useState<string[]>([]);
  const [selectedGrapes, setSelectedGrapes] = useState<string[]>([]);

  const country: countryRedux = useSelector(
    (state: RootStateOrAny) => state.country,
  );
  const { data: wines } = useSWR<Wine[]>(
    `/wines/${country.current.name || ""}`,
    (url: string) => getFetcher<Wine[]>(url),
  );

  useEffect(() => {
    if (wines) {
      let xyVals: PointWithCategory[] = [];
      let grapes: string[] = [];

      for (const wine of wines) {
        for (const grape of wine.grapes)
          if (!grapes.includes(grape)) grapes = [...grapes, grape];

        xyVals = [
          ...xyVals,
          {
            x: (xLabel.taste
              ? wine.taste[xLabel.key as keyof Taste]
              : wine[xLabel.key as keyof Wine]) as number,
            y: (yLabel.taste
              ? wine.taste[yLabel.key as keyof Taste]
              : wine[yLabel.key as keyof Wine]) as number,
            category: wine.type,
            grapes: wine.grapes,
          },
        ];
      }

      setAvailableGrapes(grapes);
      setXYValues(xyVals);
    }
  }, [wines, xLabel, yLabel]);

  useEffect(() => {
    setSelectedGrapes([]);
  }, [country]);

  if (wines && categories && xyValues.length) {
    return (
      <ThemeProvider theme={theme}>
        <div className={classes.root}>
          <div className={classes.selects}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="xLabel">x-axel</InputLabel>
              <Select
                labelId="xLabel"
                value={xLabel.key}
                onChange={(event) => {
                  const newLabel = OPTIONS.find(
                    (o) => o.key === event.target.value,
                  );

                  setXLabel(newLabel || xLabel);
                }}
                label="x-axel"
              >
                {OPTIONS.map((option) => {
                  return (
                    option.key !== yLabel.key && (
                      <MenuItem value={option.key}>{option.name}</MenuItem>
                    )
                  );
                })}
              </Select>
            </FormControl>

            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="yLabel">y-axel</InputLabel>
              <Select
                labelId="yLabel"
                value={yLabel.key}
                onChange={(event) => {
                  const newLabel = OPTIONS.find(
                    (o) => o.key === event.target.value,
                  );

                  setYLabel(newLabel || yLabel);
                }}
                label="y-axel"
              >
                {OPTIONS.map((option) => {
                  return (
                    option.key !== xLabel.key && (
                      <MenuItem value={option.key}>{option.name}</MenuItem>
                    )
                  );
                })}
              </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
              <InputLabel id="grapeLabel">Druvor</InputLabel>
              <Select
                labelId="grapeLabel"
                multiple
                value={selectedGrapes}
                onChange={(event) => {
                  console.log(event.target.value);
                  setSelectedGrapes((event.target.value as any) as string[]);
                }}
                input={<Input />}
                renderValue={(selected) => (
                  <div className={classes.chips}>
                    {(selected as string[]).map((value) => (
                      <Chip
                        key={value}
                        label={value}
                        className={classes.chip}
                      />
                    ))}
                  </div>
                )}
                // MenuProps={MenuProps}
              >
                {availableGrapes.map((grapeName) => (
                  <MenuItem key={`menuitem-for-${grapeName}`} value={grapeName}>
                    {grapeName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <Scatter
            width={window.innerWidth * 0.3}
            height={window.innerHeight * 0.3}
            data={{
              datasets: Object.keys(categories)
                .map((categoryName, index) => {
                  let vals = xyValues
                    .filter(
                      (pointWithCategory) =>
                        pointWithCategory.category === categoryName,
                    )
                    .map((p) => ({ x: p.x, y: p.y, grapes: p.grapes }));

                  if (selectedGrapes.length) {
                    vals = vals.filter((p) => {
                      let matchesAny: boolean = false;

                      for (const grape of selectedGrapes) {
                        if (p.grapes.includes(grape)) {
                          matchesAny = true;
                          break;
                        }
                      }

                      return matchesAny;
                    });
                  }

                  return [
                    {
                      label: categoryName,
                      data: vals,
                      backgroundColor: colors[index],
                      hoverBackgroundColor: hoverColors[index],
                    },
                    {
                      type: "line",
                      label: categoryName + " regression",
                      data: linearLeastSquares(vals),
                      backgroundColor: "rgba(0,0,0,0)",
                      pointBackgroundColor: "rgba(0,0,0,0)",
                      pointBorderColor: "rgba(0,0,0,0)",
                      borderColor: colors[index],
                    },
                  ] as ChartDataSets[];
                })
                .flat(1),
            }}
            options={{
              responsive: true,
              aspectRatio: 1,
              legend: {
                position: "right",
                labels: {
                  fontColor: "rgba(255,255,255, 0.9)",
                  fontSize: 18,
                  boxWidth: 15,
                },
              },
              tooltips: {
                enabled: true,
                callbacks: {
                  label: (tooltipItem: any, data: any) => {
                    // console.log(tooltipItem, data);
                    const grapes =
                      data.datasets[tooltipItem.datasetIndex]?.data[
                        tooltipItem.index
                      ]?.grapes;
                    // console.log(grapes);
                    return `${yLabel.name}: ${tooltipItem.yLabel}, ${
                      xLabel.name
                    }: ${tooltipItem.xLabel}, Druvor: ${grapes?.join(", ")}`;
                  },
                },
              },
              scales: {
                xAxes: [
                  {
                    position: "bottom",
                    scaleLabel: {
                      display: true,
                      labelString: xLabel.name,
                    },
                    gridLines: {
                      color: "rgba(255,255,255, 0.2)",
                    },
                    ticks: {
                      fontColor: "rgba(255,255,255, 1)",
                    },
                  },
                ],
                yAxes: [
                  {
                    scaleLabel: {
                      display: true,
                      labelString: yLabel.name,
                    },
                    gridLines: {
                      color: "rgba(255,255,255, 0.2)",
                    },
                    ticks: {
                      fontColor: "rgba(255,255,255, 1)",
                      beginAtZero: true,
                    },
                  },
                ],
              },
            }}
          />
        </div>
      </ThemeProvider>
    );
  }

  return <Loader />;
};

export default ScatterPlot;
