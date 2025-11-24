import { IncomingForm } from "formidable";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";

export const config = { api: { bodyParser: false } };

const supabaseUrl = "https://myctcathdbroxzbvjtdg.supabase.co";
const supabaseKey = "sb_secret_BbnW15bg8W8mLUb11SNU4w_dKclOYf_";
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }

  const form = new IncomingForm({ multiples: false });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).send("File upload error: " + err.message);
      return;
    }
    const uploaded = files.file?.[0];
    if (!uploaded) {
      res.status(400).send("No file uploaded!");
      return;
    }

    const fileBuffer = await fs.promises.readFile(uploaded.filepath);

    const { data, error } = await supabase.storage
      .from("uploads") // bucket name
      .upload(uploaded.originalFilename, fileBuffer, {
        contentType: uploaded.mimetype || "application/octet-stream",
        upsert: false // true if you want overwrites
      });

    if (error) {
      res.status(500).send("Supabase upload error: " + error.message);
      return;
    }

    res.status(200).send(`File ${uploaded.originalFilename} uploaded to Supabase!`);
  });
}
