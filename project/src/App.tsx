import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import "./App.css";
import Map from "./components/Map";
import Pie from "./components/Pie";

const useStyles = makeStyles({
  canvas: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
    height: "100vh",
  },
  map: {
    width: "60%",
    height: "60%",
  },
  pie: {
    height: "60%",
    padding: "2em",
    backgroundColor: "#1b2637",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

const App = () => {
  const classes = useStyles();
  return (
    <div className={classes.canvas}>
      <div className={classes.map}>
        <Map />
      </div>
      <div className={classes.pie}>
        <Pie />
      </div>
    </div>
  );
};

export default App;
