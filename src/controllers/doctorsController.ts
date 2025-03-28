import { Response } from "express";

import supabase from "../utils/supabase";

export class DoctorsController {
  getAllDoctors = async (req: any, res: Response): Promise<any> => {
    try {
      const { data, error } = await supabase.from("doctors").select("*");
      if (error) {
        throw error;
      }
      console.log(data);

      return res.status(200).json({ doctors: data });
    } catch (err) {
      console.error(`Error in get all doctors : ${JSON.stringify(err)}`);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err });
    }
  };

  editDoctor = async (req: any, res: Response): Promise<any> => {
    const { id, update_content } = req.body;

    console.log(id, update_content);
    try {
      const { data, error } = await supabase
        .from("doctors")
        .update(update_content)
        .eq("id", id)
        .select()
        .maybeSingle();
      if (error) {
        throw error;
      }
      console.log(data);

      return res.status(200).json({ doctors: data });
    } catch (err) {
      console.error(`Error in edit doctor : ${JSON.stringify(err)}`);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err });
    }
  };

  addDoctor = async (req: any, res: Response): Promise<any> => {
    const { add_content } = req.body;

    console.log(add_content);
    try {
      const { data, error } = await supabase
        .from("doctors")
        .upsert(add_content)
        .select()
        .single();
      if (error) {
        throw error;
      }

      return res.status(200).json({ doctors: data });
    } catch (err) {
      console.error(`Error in add doctor : ${JSON.stringify(err)}`);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err });
    }
  };
}

export const doctorsController = new DoctorsController();
