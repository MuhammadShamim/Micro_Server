import logger from "./logger";
import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env")) {
    logger.debug("Using .env file to supply config environment variables");
    dotenv.config({ path: ".env" });
} else {
    logger.debug("Using .env.example file to supply config environment variables");
    dotenv.config({ path: ".env.example" });  // you can delete this after you create your own .env file!
}
export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

export const SESSION_SECRET = process.env["SESSION_SECRET"];
if (!SESSION_SECRET) {
    logger.error("No client secret. Set SESSION_SECRET environment variable.");
    process.exit(1);
}

export const MAILGUN_DOMAIN = process.env["MAILGUN_DOMAIN"];
if (!MAILGUN_DOMAIN) {
    logger.error("No Mailgun Domain. Set MAILGUN_DOMAIN environment variable.");
    process.exit(1);
}

export const MAILGUN_APIKEY = process.env["MAILGUN_APIKEY"];
if (!MAILGUN_APIKEY) {
    logger.error("No Mailgun API Key. Set MAILGUN_APIKEY environment variable.");
    process.exit(1);
}

export const MAILGUN_FROM_ADDRESS = process.env["MAILGUN_FROM_ADDRESS"];
if (!MAILGUN_FROM_ADDRESS) {
    logger.error("No Mailgun Email From Address. Set MAILGUN_FROM_ADDRESS environment variable.");
    process.exit(1);
}

export const S3_BUCKET_NAME = process.env["S3_BUCKET_NAME"];
if (!S3_BUCKET_NAME) {
    logger.error("No S3 Bucket Name. Set S3_BUCKET_NAME environment variable.");
    process.exit(1);
}