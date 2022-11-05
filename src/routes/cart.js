import { Router } from "express";
import User from "../models/User.js";
import CartsDAOMongo from "../daos/CartsDAOMongo.js";
import { auth } from "../middlewares/auth.js";

const cartRouter = Router();
const cartsDAO = new CartsDAOMongo();

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

cartRouter.delete("/:id/products/:id_prod", async (req, res) => {
  const { id, id_prod } = req.params;
  const deleteProductFromCart = await cartsDAO.deleteProduct(id, id_prod);
  res.send(deleteProductFromCart);
});

export default cartRouter;