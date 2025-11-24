import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://myctcathdbroxzbvjtdg.supabase.co";
const supabaseKey = "sb_secret_BbnW15bg8W8mLUb11SNU4w_dKclOYf_";
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { data, error } = await supabase.storage.from("uploads").list();
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json({ files: data });
}

