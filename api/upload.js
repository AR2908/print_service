import { IncomingForm } from "formidable";
export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }
  const form = new IncomingForm({ multiples: false });

  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(500).send("File upload error: " + err.message);
      return;
    }
    const uploaded = files.file?.[0];
    const filename = uploaded?.originalFilename || uploaded?.name || 'undefined';
    res.status(200).send("File " + filename + " uploaded (temporary)!");
  });
}
