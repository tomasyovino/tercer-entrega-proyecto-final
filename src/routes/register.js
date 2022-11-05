import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import path from "path";
import multer from "multer";
import { createTransport } from "nodemailer";

const registerRouter = Router();

const TEST_MAIL = "delphia18@ethereal.email";
const PASS_MAIL = "CAHsnxSDhhttRRasPz@ethereal.email";

const transporter = createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: TEST_MAIL,
    pass: PASS_MAIL,
  },
});

const storage = multer.diskStorage({
  destination: "./src/public/img",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
})

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

        if (req.file) {
          const { filename } = req.file;
          newUser.setImgUrl(filename);
        }

        try {
          const emailContent = {
            from: "Sitio Web",
            to: TEST_MAIL,
            subject: "Nuevo registro",
            text: `Usuario: ${username}
                  Contraseña: ${hashedPassword}
                  Email: ${email}
                  Dirección: ${direction}
                  F. de nacimiento: ${birthDate}
                  Teléfono: ${phoneNumber}`,
          };
          const info = await transporter.sendMail(emailContent);
          
          console.log(info);
          return info;

        } catch (err) {
          console.log(err);
        }

        await newUser.save();
        res.redirect("/api/login");
      }
    });
});

export default registerRouter;