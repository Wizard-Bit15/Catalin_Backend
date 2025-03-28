import { Response } from "express";

import supabase from "../utils/supabase";

export class ProductsController {
  getAllProducts = async (req: any, res: Response): Promise<any> => {
    try {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        throw error;
      }

      return res.status(200).json({ products: data });
    } catch (err) {
      console.error(`Error in get test products : ${JSON.stringify(err)}`);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err });
    }
  };
}

export const productsController = new ProductsController();
