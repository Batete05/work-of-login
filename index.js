const path = require("path");
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql");

const multer = require("multer");
const { diskStorage } = require("multer");

const storage = diskStorage({
  destination: function (req, file, cb) {
    // console.log("file : ");
    // console.log(file)
    cb(null, "/uploads/images/");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`); 
  },
});


const upload = multer({diskStorage})

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "login_work",
});
connection.connect((err) => {
  if (err) console.log("error found," + err);
  console.log("Database connected");
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("signup.ejs");
});

app.post("/register", upload.single("profile_pic"), (req, res,next) => {
  // console.log(req.body);

  let Name = req.body.Name;
  let email = req.body.email;
  let pwd = req.body.pwd;
  let user_name = req.body.user_name;
  console.log(req.file);
  
  let image = req.file.filename;

  console.log(req);

  connection.query(
    `INSERT INTO user (Name,user_name,email,password,image) VALUES (?,?,?,?,?)`,
   [Name, user_name, email, pwd, image],
 (err, result) => {
     if (err) console.log("error found:", err);
     console.log(result);
      res.render("dashboard.ejs",{email,pwd,user_name,image})
    }
);
  connection.query(
    `SELECT image FROM user WHERE email = ?`,
    [email],

     async (err, result) => {
     if (err) console.log("err found:", err);
      console.log(result);
      // console.log(result[0].image.toString());

      image = path.join("images", "uploads", result[0].image.toString());

      console.log(image);
      res.render("dashboard.ejs", { pwd, user_name, email, image });
    }
  );
  res.json(
    {
      profile:
    }
  )
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
