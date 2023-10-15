const express = require("express");
const nodemailer =require("nodemailer")
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "hospital1",
});

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const userrouter = require("./Routes/Login");
app.use("/Login", userrouter);

const useradmin = require("./Routes/Dbadmin");
app.use("/Dbadmin", useradmin);

const userdoctor = require("./Routes/Doctor");
app.use("/Doctor",userdoctor);

const frontdesk = require("./Routes/Frontdesk");
app.use("/Frontdesk",frontdesk);

const fdesk = require("./Routes/Fdesk");
app.use("/Fdesk",fdesk);

const general = require("./Routes/General");
app.use("/General",general);

const dentry = require("./Routes/Dentry");
app.use("/Dentry",dentry);

app.listen(3001, () => {
  console.log("Running on port 3001");
});
