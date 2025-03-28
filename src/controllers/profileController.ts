import { Response } from "express";

import supabase from "../utils/supabase";

export class ProfileController {
  getProfileDetail = async (req: any, res: Response): Promise<any> => {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "missing required params" });
    }
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          `
          *,
          notifications(profile_id: id)
          `
        )
        .eq("id", id);
      if (error) {
        throw error;
      }

      return res.status(200).json({ profile: data });
    } catch (err) {
      console.error(`Error in get user : ${JSON.stringify(err)}`);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err });
    }
  };
}

export const profileController = new ProfileController();
