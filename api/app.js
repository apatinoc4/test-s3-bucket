import cors from "cors";
import express from "express";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

const app = express();
app.use(cors());
const port = 5000;

const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {},
});

app.get("/presigned", async (req, res) => {
  const { "file-name": fileName } = req.query;
  const bucketName = "andy-patino-test-bucket";
  const key = `uploads/${fileName}`;

  try {
    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: bucketName,
      Key: key,
      Expires: 60,
    });

    res.json({ url, fields });
  } catch (err) {
    console.error("Error creating presigned URL", err);
    res.status(500).send("Error creating presigned URL");
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
