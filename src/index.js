import dotenv from "dotenv";
import { Connection } from "./db/index.js";
import {app} from './app.js'
dotenv.config();

Connection()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("running at port ", process.env.PORT);
    });
  }).catch((err) => {
    console.log("error in connecting db ", err);
  });
