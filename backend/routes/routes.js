import express from "express";
import seriesRouter from "./series.js";
import filmesRouter from "./filme.js";
import contaRouter from "./conta.js";
import usuarioRouter from "./usuario.js";

const router = express.Router();

router.use("/series", seriesRouter);
router.use("/filmes", filmesRouter);
router.use("/conta", contaRouter);
router.use("/usuario", usuarioRouter);

