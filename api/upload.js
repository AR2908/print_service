// api/upload.js
import formidable from "formidable";
import fs from "fs";

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
  const form = new formidable.IncomingForm({ multiples: false });
  
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(500).send("File upload error!");
      return;
    }
    const oldPath = files.file.filepath;
    const newPath = "./public/uploads/" + files.file.originalFilename;

    fs.copyFile(oldPath, newPath, (err) => {
      if (err) {
        res.status(500).send("Saving file failed!");
        return;
      }
      res.status(200).send("File uploaded successfully!");
    });
  });
}
