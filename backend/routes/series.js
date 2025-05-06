import express from "express";
import SeriesController from "../controllers/SeriesController.js";


const routerSeries = express.Router();

routerSeries.get("/", SeriesController.visualizeSeries);
routerSeries.post("/", SeriesController.createSeries);
routerSeries.put("/:id", SeriesController.updateSeries);
routerSeries.delete("/:id", SeriesController.deleteSeries);
routerSeries.get("/:id", SeriesController.visualizeSeriesById);
routerSeries.get("/search/:nome", SeriesController.searchSeriesByName);

export default routerSeries;
