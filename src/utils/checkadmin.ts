import supabase from "./supabase";

const checkAdmin = async (id: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }
    if (data.role !== 1) {
      throw new Error("the user is not admin");
    }
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export default checkAdmin;
