import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
} from "@aws-sdk/client-s3";
// @ts-ignore
import { lookup } from "mime-types";

export interface UploadParams {
    FileName: string; // local file path -> eg. "path/to/local/file.txt"
    fileBuffer: Buffer;
    objectKey: string; // object key -> eg. "image/image.jpg"
}

export interface UploadImageParams {
    fileObject: File;
    objectKey: string; // object key -> eg. "image/image.jpg"
}

export interface DownloadParams {
    objectKey: string; // object key -> eg. "image/image.jpg"
    localFilePath: string; // local file path -> eg. "path/to/local/file.txt"
}

export const S3 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
    },
});

export async function uploadFile(params: UploadParams) {
    const { FileName, fileBuffer, objectKey } = params;

    // Create PutObjectCommand to upload the local file to Cloudflare R2
    const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: objectKey,
        Body: fileBuffer,
        ContentType: lookup(FileName),
    });

    let data;

    // Upload the file to the specified bucket and key
    try {
        data = await S3.send(command);

        console.log("File uploaded successfully:", objectKey);
    } catch (error) {
        console.error("Error uploading file:", error);
    }

    return data
        ? {
              url: `https://${process.env.R2_DOMAIN_URL}/${objectKey}`,
              contentType: lookup(FileName),
          }
        : null;
}
