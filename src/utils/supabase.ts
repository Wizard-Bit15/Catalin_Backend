import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// Instantiate Supabase
const supabaseUrl =
  process.env.SUPABASE_URL || "https://qoeierfztyqvjeslugmn.supabase.co";
const supabaseKey =
  process.env.SUPABASE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvZWllcmZ6dHlxdmplc2x1Z21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4OTQ0MzgsImV4cCI6MjA1ODQ3MDQzOH0.dwR5vp6OM-gh-IgQsM5ldibeeG9HABG-vAEuhKjVK0o";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
