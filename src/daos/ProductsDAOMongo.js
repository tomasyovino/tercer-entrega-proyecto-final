import MongoDbContainer from "../containers/MongoDbContainer.js";
import { ProductModel } from "../models/Product.js";

class ProductsDAOMongo extends MongoDbContainer {
    constructor(){
        super(ProductModel);
    }

    async save(obj) {
        try {
            const newProduct = await ProductModel(obj);
            const savedProduct = await newProduct.save();
            return savedProduct;
        } catch (err) {
            console.log(`There has been an error: ${err}`);
        }
    }
}

export default ProductsDAOMongo;