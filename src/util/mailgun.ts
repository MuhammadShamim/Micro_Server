import nodemailer from "nodemailer";
import mailGunTransport from "nodemailer-mailgun-transport";
import { MAILGUN_DOMAIN, MAILGUN_APIKEY } from "./secrets";

// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
const AuthOptions = {
    auth: {
        domain: MAILGUN_DOMAIN,
        apiKey: MAILGUN_APIKEY
    }
};
  
export const mailGun = nodemailer.createTransport(
    mailGunTransport(
        AuthOptions));

// export default mailGun;