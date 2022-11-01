import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: "./src/public/img",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
})

const registerRouter = Router();

registerRouter.use(multer({
  storage: storage,
  dest: "./src/public/img",
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname));
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: El archivo debe ser una imágen soportada");
    }
  }
}).single("image"));

registerRouter.get("/", (req, res) => {
    res.render("register");
});
  
registerRouter.post("/", (req, res) => {
    const { username, password, email, direction, birthDate, phoneNumber } = req.body;
    User.findOne({ username }, async (err, user) => {
      if (err) console.log(err);
      if (user) res.render("register-error");
      if (!user) {
        const hashedPassword = await bcrypt.hash(password, 8);
        const newUser = new User({
          username,
          password: hashedPassword,
          email,
          direction,
          birthDate,
          phoneNumber,
        });
        await newUser.save();
        console.log(req.file);
        res.redirect("/api/login");
      }
    });
});

export default registerRouter;