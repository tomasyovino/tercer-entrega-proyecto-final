import { Router } from "express";
import User from "../models/User.js";
import CartsDAOMongo from "../daos/CartsDAOMongo.js";
import twilio from "twilio";
import { auth } from "../middlewares/auth.js";
import { createTransport } from "nodemailer";
import log4js  from "log4js";

log4js.configure({
    appenders: {
      miLoggerConsole: { type: "console" },
      miLoggerFile: { type: "file", filename: "error.log" },
    },
    categories: {
      default: { appenders: ["miLoggerConsole"], level: "info" },
      error: { appenders: ["miLoggerFile"], level: "error" },
    },
});

const errorLogger = log4js.getLogger("error");

const cartRouter = Router();
const cartsDAO = new CartsDAOMongo();

const USER_MAIL = "examplecoder24@gmail.com";
const PASS_MAIL = "zvybfprvfdbskakv";

const accountSid = "AC534ba76432f965c5909ac01251df04d9";
const authToken = "0175e38ffd54d994f88e458f07be5b69";

const client = twilio(accountSid, authToken);

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: USER_MAIL,
    pass: PASS_MAIL,
  },
});

cartRouter.get("/", auth, async (req, res) => {
    const userData = await User.findById(req.user._id).lean();
    const userCart = await cartsDAO.findCart(req.user._id);
    const productsOnCart = userCart.products;
    res.render("cart", {
      userData: userData,
      data: productsOnCart,
    });
});

cartRouter.post("/", async (req, res) => {
  const data = await req.body;
  const cart = await cartsDAO.addProduct(data.userId, data.productId);
});

cartRouter.post("/buy", async (req, res) => {
  const userData = await User.findById(req.user._id).lean();
  const userCart = await cartsDAO.findCart(req.user._id);
  const productsOnCart = userCart.products;

  let productList = "";
  let p;
  const email = userData.email,
        username = userData.username,
        number = userData.phoneNumber

  for (p in productsOnCart) {
    productList += `• ${productsOnCart[p].quantity} - ${productsOnCart[p].title}`
  }
    
  try {
    const emailContent = {
      from: "Sitio Web",
      to: email,
      subject: `Nuevo pedido de ${username} / ${email}`,
      text: productList,
    };
    const info = transporter.sendMail(emailContent);

    const message = await client.messages.create({
      body: "Su pedido ha sido recibido y se encuentra en proceso de envío",
      from: "+14699604183",
      to: `+${number}`,
    });

  } catch (err) {
    errorLogger.error(err);
  }
});

cartRouter.delete("/product", async (req, res) => {
  const data = await req.body;
  const deleteProductFromCart = await cartsDAO.deleteProduct(data.userId, data.productId);
  res.send(deleteProductFromCart);
});

export default cartRouter;