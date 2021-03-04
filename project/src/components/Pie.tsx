import { useEffect, useState } from "react";
import { ChartComponentProps, Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import useSWR from "swr";
import { Categories } from "../types";
import { getFetcher } from "../utils/fetchers";
import { RootStateOrAny, useSelector } from "react-redux";
import { makeStyles, Typography } from "@material-ui/core";
import { countryRedux } from "../redux/country";

const useStyles = makeStyles({
  countryText: {
    color: "#fff",
  },
  dountCanvas: {
    textAlign: "center",
  },
});

const colors = [
  "rgba(255, 0, 0, 0.3)",
  "rgba(249, 232, 192, 0.9)",
  "rgba(255, 255, 255, 0.9)",
  "rgba(231, 84, 128, 0.5)",
];
const hoverColors = [
  "rgba(255, 0, 0, 0.5)",
  "rgba(249, 232, 192, 1)",
  "rgba(255, 255, 255, 1)",
  "rgba(231, 84, 128, 0.7)",
];

const Pie = () => {
  const classes = useStyles();

  const getPercentData = (data: any) => {};
  const testP = [60, 30, 2, 8];
  const country: countryRedux = useSelector(
    (state: RootStateOrAny) => state.country,
  );
  const { data: categories, error: categoriesFetchError } = useSWR<Categories>(
    `/categories/${country.current.name}`,
    (url: string) => getFetcher<Categories>(url),
  );

  const [labels, setLabels] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);

  useEffect(() => {
    if (categories) {
      setLabels(Object.keys(categories as any));
      setValues(Object.values(categories as any));
    }
  }, [categories]);

  if (categories) {
    const data = {
      // maintainAspectRatio: false,
      responsive: true,
      labels: labels,
      text: country,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          hoverBackgroundColor: hoverColors,
        },
      ],
    };

    const options: ChartComponentProps["options"] = {
      // maintainAspectRatio: false,
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
            console.log(dataArr);
            for (const data of dataArr) {
              sum += data;
            }
            let percentage = ((value * 100) / sum).toFixed(2) + "%";
            return percentage;
          },
          color: "#fff",
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
    };

    return (
      <div className={classes.dountCanvas}>
        <h1 className={classes.countryText}>
          {country.current.name || "Alla Länder"}
        </h1>
        <Doughnut
          width={window.innerWidth * 0.25}
          height={window.innerHeight * 0.25}
          type={Doughnut}
          data={data}
          options={options}
        />
      </div>
    );
  }

  return <div />; // spinner
};

export default Pie;
