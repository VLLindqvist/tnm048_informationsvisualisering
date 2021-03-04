import * as d3 from "d3";
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
  scatterCanvas: {
    color: "#fff",
  },
});

const ScatterPlot = () => {
  const classes = useStyles();

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

  const width = 960;
  const height = 480;

  let svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  let plotMargins = {
    top: 30,
    bottom: 30,
    left: 150,
    right: 30,
  };

  // let plotGroup = svg
  //   .append("g")
  //   .classed("plot", true)
  //   .attr("transform", `translate(${plotMargins.left},${plotMargins.top})`);

  return <div className={classes.scatterCanvas}></div>;
};

export default ScatterPlot;
