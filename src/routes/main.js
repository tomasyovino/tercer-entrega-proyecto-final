import { Router } from "express";
import User from "../models/User.js";
import ProductsDAOMongo from "../daos/ProductsDAOMongo.js";
import CartsDAOMongo from "../daos/CartsDAOMongo.js";
import { auth } from "../middlewares/auth.js";

const mainRouter = Router();
const productsDAO = new ProductsDAOMongo();
const cartsDAO = new CartsDAOMongo();


mainRouter.get("/", auth, async (req, res) => {
    const userData = await User.findById(req.user._id).lean();
    const userCart = await cartsDAO.findCart(req.user._id);
    const dataProd = await productsDAO.listAll();
    console.log("Este es el id del usuario " + req.user._id)
    
    res.render("main", {
      data: userData,
      productData: dataProd,
    });
});

export default mainRouter;