import { useEffect, useState, FC } from "react";
import { Doughnut } from "react-chartjs-2";
import { RootStateOrAny, useSelector } from "react-redux";
import Chart from "chart.js";
import * as ChartDataLabels from "chartjs-plugin-datalabels";

import { Categories } from "../types";
import { makeStyles, Typography } from "@material-ui/core";
import { countryRedux } from "../redux/country";
import { colors, hoverColors } from "../utils/constants";
import Loader from "./Loader";

Chart.plugins.unregister([ChartDataLabels] as any);

const useStyles = makeStyles({
  countryText: {
    color: "#fff",
  },
  dountCanvas: {
    textAlign: "center",
  },
});

type PieProps = {
  categories?: Categories;
};
const Pie: FC<PieProps> = ({ categories }) => {
  const classes = useStyles();

  const country: countryRedux = useSelector(
    (state: RootStateOrAny) => state.country,
  );
  const [total, setTotal] = useState<number>(0);

  
  const [labels, setLabels] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);
  const [actualColors, setActualColors] = useState<string[]>([]);
  const [actualHoverColors, setActualHoverColors] = useState<string[]>([]);

  useEffect(() => {
    if (categories) {
      setTotal( categories["Mousserande vin"] + categories["Rosévin"]  + categories["Rött vin"] + categories["Vitt vin"]);
      const cats = Object.entries(categories)
        .map(([key, value], index) => ({ key, value, index }))
        .filter(({ value }) => value > 0);

      const indices = cats.map(({ index }) => index);

      setActualColors(colors.filter((c, i) => indices.includes(i)));
      setActualHoverColors(hoverColors.filter((c, i) => indices.includes(i)));
      setLabels(cats.map((c) => c.key));
      setValues(cats.map((c) => c.value));
    }
  }, [categories]);

  if (categories) {
    return (
      <div className={classes.dountCanvas}>
        <Typography variant="h3" className={classes.countryText}>
          {country.current.name || "Alla Länder"}
        </Typography>
        <Typography variant="h6" className={classes.countryText}>
          {`Totalt: ${total} st`} 
        </Typography>
        <Doughnut
          width={window.innerWidth * 0.2}
          height={window.innerHeight * 0.25}
          plugins={[ChartDataLabels]}
          data={{
            labels: labels,
            datasets: [
              {
                data: values,
                backgroundColor: actualColors,
                hoverBackgroundColor: actualHoverColors,
              },
            ],
          }}
          options={{
            aspectRatio: 1,
            cutoutPercentage: 30,
            legend: {
              labels: {
                boxWidth: 15,
                fontColor: "rgba(255, 255, 255, 1)",
              },
              display: true,
              position: "bottom",
            },
            plugins: {
              datalabels: {
                formatter: (value: any, ctx: any) => {
                  let sum = 0;
                  let dataArr = ctx.chart.data.datasets[0].data;
                  for (const data of dataArr) {
                    sum += data;
                  }
                  let percentage = (value * 100) / sum;

                  return percentage ? percentage.toFixed(2) + "%" : "";
                },
                color: "#000",
              },
            },
            tooltips: {
              enabled: true,
              callbacks: {
                label: (tooltipItem: any, data: any) => {
                  let dataset = data.datasets[tooltipItem.datasetIndex];
                  var meta = dataset._meta[Object.keys(dataset._meta)[0]];
                  var total = meta.total;
                  var currentValue = dataset.data[tooltipItem.index];
                  var percentage = parseFloat(
                    ((currentValue / total) * 100).toFixed(1),
                  );
                  return currentValue + " (" + percentage + "%)";
                },
              },
            },
          }}
        />
      </div>
    );
  }

  return <Loader />;
};

export default Pie;
