import { IncomingForm } from "formidable";


// Disable next.js body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }
const form = new IncomingForm({ multiples: false });

  
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(500).send("File upload error!");
      return;
    }
    // Instead of saving to local, just check filename:
    res.status(200).send("File " + files.file.originalFilename + " uploaded (temporary)!");
  });
}
