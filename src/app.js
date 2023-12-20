import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // allow to server to accept request from different origin
    credentials: true, // allow the server to receive cookies from the client
  })
);

// json middleware is used to access the data from the client in json format
app.use(
  express.json({
    limit: "16kb",
  })
);

// urlencoded middleware is used to access the data from the client
app.use(
  express.urlencoded({
    extended: true, // allows nested object
    limit: "16kb",
  })
);

// static files middleware is used to access the files from the public folder
app.use(express.static("public"));

// Cookie parser middleware is used to access the client cookies from the browser
app.use(cookieParser());

export { app };
