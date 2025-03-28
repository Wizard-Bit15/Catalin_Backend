import { Response } from "express";

import supabase from "../utils/supabase";

export class PlansController {
  getAllPlans = async (req: any, res: Response): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from("plans")
        .select(
          `
          id,
          feedback,
          status,
          date,
          startTime,
          endTime,
          products_count,
          products (name),
          doctors (name, specialization),
          profiles (name, address)
        `
        )
        .order("date", { ascending: false });
      if (error) {
        throw error;
      }

      return res.status(200).json({ plans: data });
    } catch (err) {
      console.error(`Error in get plans : ${JSON.stringify(err)}`);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err });
    }
  };

  // addPlanDoctor = async (req: any,res: Response): Promise<any> => {
  //   const {id, addData} = req.body;
  //   try {
  //     const { data, error } = await supabase
  //       .from("plans")
  //       .select()
  //       .order("date", { ascending: false });
  //     if (error) {
  //       throw error;
  //     }
  //     console.log(data);

  //     return res.status(200).json({ plans: data });
  //   } catch (err) {
  //     console.error(
  //       `Error in add plan by selected doctor : ${JSON.stringify(err)}`
  //     );
  //     return res
  //       .status(500)
  //       .json({ message: "Internal Server Error", error: err });
  //   }
  // });
}

export const plansController = new PlansController();
