import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import "./App.css";
import Map from "./components/Map";
import Pie from "./components/Pie";
import ScatterPlot from "./components/ScatterPlot";
import { Categories } from "./types";
import { getFetcher } from "./utils/fetchers";
import useSWR from "swr";
import { countryRedux } from "./redux/country";
import { RootStateOrAny, useSelector } from "react-redux";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
  },
  mapNpie: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
  },
  map: {
    width: "60%",
    height: "50vh",
  },
  pie: {
    height: "50vh",
    padding: "1em",
    backgroundColor: "#1b2637",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

const App = () => {
  const classes = useStyles();

  const country: countryRedux = useSelector(
    (state: RootStateOrAny) => state.country,
  );

  const { data: categories } = useSWR<Categories>(
    `/categories/${country.current.name}`,
    (url: string) => getFetcher<Categories>(url),
  );

  return (
    <div className={classes.root}>
      <div className={classes.mapNpie}>
        <div className={classes.map}>
          <Map />
        </div>
        <div className={classes.pie}>
          <Pie categories={categories} />
        </div>
      </div>
      <ScatterPlot categories={categories} />
    </div>
  );
};

export default App;
