import express from "express";
import { IndexRouter } from "./routes/index.js";
import expressLayouts from "express-ejs-layouts";
import bodyParser from "body-parser";

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use("/", IndexRouter);

export { app };
