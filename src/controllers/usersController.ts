import { Response } from "express";

import supabase from "../utils/supabase";
import checkAdmin from "../utils/checkadmin";
import { DoesUsernameExistRequest } from "../utils/types";

export class UsersController {
  // api to check if the username is registered
  doesUsernameExist = async (
    req: DoesUsernameExistRequest,
    res: Response
  ): Promise<any> => {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: "missing required params" });
    }

    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("username", username);

    if (error) {
      console.error(
        `Failed to check username existence: ${JSON.stringify(error)}`
      );
      return res
        .status(500)
        .json({ error: "internal server error", message: error.message });
    }

    return res.status(200).json({ exists: data?.length > 0 });
  };

  loginWithUsername = async (req: any, res: Response): Promise<any> => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "missing required params" });
    }

    try {
      const { data: user, error: userError } = await supabase.rpc(
        "get_user_with_username",
        { username_input: username }
      );
      if (userError) {
        throw userError;
      }

      if (!user || !user.length) {
        return res.status(404).json({ error: "User not found" });
      }
      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: user[0].email,
          password,
        });

      if (loginError) {
        throw loginError;
      }

      return res.json({
        user: user[0],
      });
    } catch (error) {
      console.error(`Error in login: ${JSON.stringify(error)}`);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: error });
    }
  };

  getEmailWithUsername = async (req: any, res: Response): Promise<any> => {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: "missing required params" });
    }

    try {
      const { data: user, error: userError } = await supabase.rpc(
        "get_user_with_username",
        { username_input: username }
      );
      if (userError) {
        throw userError;
      }

      if (!user || !user.length) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json({
        email: user[0].email,
      });
    } catch (error) {
      console.error(`Error in getEmailWithUsername: ${JSON.stringify(error)}`);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: error });
    }
  };

  // api to deactivate user with id by Admin only
  deactivateUserAdmin = async (req: any, res: Response): Promise<any> => {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "missing required params" });
    }

    const user_id = req.user.id;
    const isAdmin = await checkAdmin(user_id);
    if (!isAdmin) {
      return res.status(403).json({ error: "forbidden" });
    }

    if (user_id === id) {
      return res.status(403).json({ error: "forbidden" });
    }

    try {
      const { data: activeData, error: activeError } = await supabase
        .from("users")
        .select("is_active")
        .eq("id", id)
        .maybeSingle();

      if (activeError || !activeData) {
        throw new Error(activeError.message || "Not found");
      }

      if (!activeData?.is_active) {
        return res
          .status(200)
          .json({ message: "User is already deactivated." });
      }

      const { data, error } = await supabase
        .from("users")
        .update({ is_active: false })
        .eq("id", id)
        .select();

      if (error) {
        throw error;
      }

      const { error: authTableError } =
        await supabase.auth.admin.updateUserById(
          id,
          { ban_duration: "876000h" } // 100 years
        );

      if (authTableError) {
        throw authTableError;
      }
      return res.status(200).json({ data });
    } catch (err) {
      console.error(`Error in deactivateUser: ${JSON.stringify(err)}`);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err });
    }
  };

  // api to activate user with id by Admin only
  activateUserAdmin = async (req: any, res: Response): Promise<any> => {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "missing required params" });
    }

    const user_id = req.user.id;
    const isAdmin = await checkAdmin(user_id);
    if (!isAdmin) {
      return res.status(403).json({ error: "forbidden" });
    }

    try {
      const { data: activeData, error: activeError } = await supabase
        .from("users")
        .select("is_active")
        .eq("id", id)
        .maybeSingle();

      if (activeError) {
        throw new Error(activeError.message || "Not found");
      }

      if (activeData?.is_active) {
        return res.status(200).json({ message: "User is already activated." });
      }

      const { data, error } = await supabase
        .from("users")
        .update({ is_active: true })
        .eq("id", id)
        .select();

      if (error) {
        throw error;
      }

      const { error: authTableError } =
        await supabase.auth.admin.updateUserById(id, { ban_duration: "0h" });

      if (authTableError) {
        throw authTableError;
      }
      return res.status(200).json({ data });
    } catch (err) {
      console.error(`Error in activateUser: ${JSON.stringify(err)}`);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err });
    }
  };

  // api to add new user by Admin only
  registerUserAdmin = async (req: any, res: Response): Promise<any> => {
    const {
      email,
      password,
      office_phone,
      mobile_phone,
      first_name,
      last_name,
      avatar_url,
      role,
    } = req.body;

    if (!email) {
      return res.status(400).json({ error: "missing required params" }); // Stop execution immediately
    }

    const username = `ckatc.${email.split("@")[0]}`;
    // Start the chain of promises
    return supabase.auth
      .signUp({
        email: email,
        password: password || "123456", // You can dynamically generate this
        options: {
          data: {
            username: username,
            office_phone: office_phone,
            mobile_phone: mobile_phone,
          },
        },
      })
      .then(({ data: authData, error: authError }) => {
        if (authError) {
          return res
            .status(400)
            .json({ message: "Error creating user", error: authError });
        }

        // Insert user details into the database
        return supabase
          .from("users")
          .upsert({
            id: authData.user.id,
            username,
            office_phone,
            mobile_phone,
            first_name,
            last_name,
            avatar_url,
            role,
          })
          .select()
          .maybeSingle()
          .then(({ data, error: userError }) => {
            // Handle database error
            if (userError) {
              return res
                .status(500)
                .json({ message: "Error saving user", error: userError });
            }

            // Respond with success
            return res.status(200).json({ user: data });
          });
      })
      .catch((err) => {
        // Handle unexpected errors
        console.error(`Error in registerUser: ${JSON.stringify(err)}`);
        return res
          .status(500)
          .json({ message: "Internal Server Error", error: err });
      });
  };

  // api to delete user with id by Admin only
  deleteUserAdmin = async (req: any, res: Response): Promise<any> => {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "missing required params" });
    }

    try {
      const { error: deleteError } = await supabase
        .from("users")
        .delete()
        .eq("id", id);

      if (deleteError) {
        throw deleteError;
      }
      const { data, error: deleteFromAuthError } =
        await supabase.auth.admin.deleteUser(id);

      if (deleteFromAuthError) {
        throw deleteFromAuthError;
      }

      return res.status(200).json({ status: "success" });
    } catch (err) {
      console.error(`Error in deleteUser: ${JSON.stringify(err)}`);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err });
    }
  };

  // api to edit user with id by Admin only
  editUserAdmin = async (req: any, res: Response): Promise<any> => {
    const { id, update_content } = req.body;
    if (!id || !update_content) {
      return res.status(400).json({ error: "missing required params" });
    }

    try {
      const { data, error: userError } = await supabase
        .from("users")
        .update(update_content)
        .eq("id", id)
        .select()
        .maybeSingle();

      if (userError) {
        throw userError;
      }
      return res.status(200).json({ user: data });
    } catch (err) {
      console.error(`Error in editUser : ${JSON.stringify(err)}`);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err });
    }
  };

  getUserDetail = async (req: any, res: Response): Promise<any> => {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "missing required params" });
    }
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        throw error;
      }

      return res.status(200).json({ user: data });
    } catch (err) {
      console.error(`Error in get user : ${JSON.stringify(err)}`);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err });
    }
  };

  getAllUsers = async (req: any, res: Response): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_status", true)
        .order("created_at", { ascending: false });
      if (error) {
        throw error;
      }

      return res.status(200).json({ users: data });
    } catch (err) {
      console.error(`Error in get test user : ${JSON.stringify(err)}`);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err });
    }
  };

  updatePasswordAsAdmin = async (req: any, res: Response): Promise<any> => {
    const { id, password } = req.body;
    if (!id || !password) {
      return res.status(400).json({ error: "missing required params" });
    }
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (userError) {
      throw userError;
    }
    if (!userData) {
      return res.status(404).json({ error: "user not found" });
    }
    try {
      const { data, error } = await supabase.auth.admin.updateUserById(id, {
        password: password,
      });

      if (error) {
        throw error;
      }

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(`Error in get user : ${JSON.stringify(err)}`);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err });
    }
  };
}

export const usersController = new UsersController();
