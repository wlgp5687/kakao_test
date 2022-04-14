const express = require("express");
const bodyParser = require("body-parser");

const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const router = require("./router");

const app = express();

app.use(cors());

app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ limit: "1mb", extended: false }));

app.use("/", router);

const port = process.env.PORT;

app.listen(port, () => {
	console.log(`server is listening at localhost:${process.env.PORT}`);
});
