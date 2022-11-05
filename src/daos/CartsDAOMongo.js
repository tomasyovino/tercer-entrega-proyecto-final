import MongoDbContainer from "../containers/MongoDbContainer.js";
import { CartModel } from "../models/Cart.js";
import { ProductModel } from "../models/Product.js";

class CartsDAOMongo extends MongoDbContainer {
    constructor(){
        super(CartModel);
    }

    async save() {
        try {
            const newCart = await CartModel();
            const savedProduct = await newCart.save();
            return savedProduct;
        } catch (err) {
            console.log(`There has been an error: ${err}`);
        }
    }

    async addProduct(userId, productId) {
        try {
            let cart = await CartModel.findOne({ userId });
            let product = await ProductModel.findOne({ productId });

            if (cart) {
                //cart exists for user
                let itemIndex = cart.products.findIndex(p => p._id == productId);

                if (itemIndex > -1) {
                    //product exists in the cart, update the quantity
                    let productItem = cart.products[itemIndex];
                    productItem.quantity = productItem.quantity + 1;
                    cart.products[itemIndex] = productItem;
                } else {
                    //product does not exists in cart, add new item
                    cart.products.push(product);
                };
                cart = await cart.save();
            } else {
                //no cart for user, create new cart
                const newCart = await CartModel.create({
                    userId,
                    products: [product]
                });
            };
        } catch (err) {
            console.log(`There has been an error: ${err}`);
        };
    };

    async listProducts(id) {
        try {
            let cartProducts = await CartModel.findById(id, { "products": 1, "_id": 0 }).exec();
            return cartProducts;
        } catch (err) {
            console.log(`There has been an error: ${err}`);
        };
    };

    async findCart(userId) {
        try {
            let cart = await CartModel.findOne({ userId });

            if (cart) {
                return cart;
              } else {
                const newCart = await CartModel.create({
                  userId,
                });
          
                return newCart;
              }
        } catch (err) {
            console.log(`There has been an error: ${err}`);
        };
    };

    async deleteProduct(id, id_prod) {
        try {
            let cart = await CartModel.updateOne({ "_id": id }, { $pull: {"products": { "_id": ObjectId(id_prod) }} } );
            return cart;
        } catch (err) {
            console.log(`There has been an error: ${err}`);
        };
    };
};

export default CartsDAOMongo;