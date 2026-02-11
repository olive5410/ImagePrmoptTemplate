import { GetObjectCommand, PutObjectCommand, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`[R2] Missing environment variable: ${name}`);
  }
  return value;
}

const r2Endpoint = requireEnv("R2_ENDPOINT");
const r2AccessKeyId = requireEnv("R2_ACCESS_KEY_ID");
const r2SecretAccessKey = requireEnv("R2_SECRET_ACCESS_KEY");
const defaultBucket = process.env.R2_BUCKET_NAME;

export const r2Client = new S3Client({
  region: "auto",
  endpoint: r2Endpoint,
  credentials: {
    accessKeyId: r2AccessKeyId,
    secretAccessKey: r2SecretAccessKey,
  },
});

type UploadBody = PutObjectCommandInput["Body"];

type UploadOptions = {
  bucket?: string;
  contentType?: string;
};

export async function uploadToR2(key: string, body: UploadBody, options: UploadOptions = {}) {
  const bucket = options.bucket ?? defaultBucket;
  if (!bucket) {
    throw new Error("[R2] Bucket name is required. Set R2_BUCKET_NAME or pass bucket option.");
  }

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: options.contentType ?? "application/octet-stream",
  });

  const response = await r2Client.send(command);
  console.log("[R2] Uploaded file", key, "to bucket", bucket);
  return response;
}

type PresignOptions = {
  bucket?: string;
  expiresIn?: number;
  contentType?: string;
};

export async function getPresignedDownloadUrl(key: string, options: PresignOptions = {}) {
  const bucket = options.bucket ?? defaultBucket;
  if (!bucket) {
    throw new Error("[R2] Bucket name is required. Set R2_BUCKET_NAME or pass bucket option.");
  }

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(r2Client, command, { expiresIn: options.expiresIn ?? 3600 });
}

export async function getPresignedUploadUrl(key: string, options: PresignOptions = {}) {
  const bucket = options.bucket ?? defaultBucket;
  if (!bucket) {
    throw new Error("[R2] Bucket name is required. Set R2_BUCKET_NAME or pass bucket option.");
  }

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: options.contentType ?? "application/octet-stream",
  });

  return getSignedUrl(r2Client, command, { expiresIn: options.expiresIn ?? 900 });
}
