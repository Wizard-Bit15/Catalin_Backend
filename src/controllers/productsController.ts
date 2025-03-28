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

  editProduct = async (req: any, res: Response): Promise<any> => {
    const { id, update_product } = req.body;

    console.log(id, update_product);
    try {
      const { data, error } = await supabase
        .from("products")
        .update(update_product)
        .eq("id", id)
        .select()
        .maybeSingle();
      if (error) {
        throw error;
      }
      console.log(data);

      return res.status(200).json({ products: data });
    } catch (err) {
      console.error(`Error in edit product : ${JSON.stringify(err)}`);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err });
    }
  };

  addProduct = async (req: any, res: Response): Promise<any> => {
    const { add_product } = req.body;

    console.log(add_product);
    try {
      const { data, error } = await supabase
        .from("products")
        .upsert(add_product)
        .select()
        .single();
      if (error) {
        throw error;
      }

      return res.status(200).json({ products: data });
    } catch (err) {
      console.error(`Error in add product : ${JSON.stringify(err)}`);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err });
    }
  };
}

export const productsController = new ProductsController();
