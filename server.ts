import express, { Application } from "express";
import Server from "./src/index";
import 'dotenv/config'
import dotenv from "dotenv";
import path from "path";

dotenv.config();
if (process.env.NODE_ENV == "development") {
  dotenv.config({ path: path.resolve(__dirname, "../.env.development") });
}

if (process.env.NODE_ENV == "test") {
  dotenv.config({ path: path.resolve(__dirname, "../.env.test") });
}

const app: Application = express();
const server: Server = new Server(app);
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

app.listen(PORT, "localhost", function () {
    console.log(`Server is running on port ${PORT}.`);
  })
  .on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.log("Error: address already in use");
    } else {
      console.log(err);
    }
  });
export default app;
