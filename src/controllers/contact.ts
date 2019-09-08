import nodemailer from "nodemailer";
import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import mailGunTransport = require("nodemailer-mailgun-transport");
import { MAILGUN_DOMAIN, MAILGUN_APIKEY } from "./../util/secrets";

// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
const AuthOptions = {
    auth: {
        domain: MAILGUN_DOMAIN,
        apiKey: MAILGUN_APIKEY
    }
};
  
const mailGun = nodemailer.createTransport(mailGunTransport(AuthOptions));

/**
 * GET /contact
 * Contact form page.
 */
export const getContact = (req: Request, res: Response) => {
    res.render("contact", {
        title: "Contact"
    });
};

/**
 * POST /contact
 * Send a contact form via Nodemailer.
 */
export const postContact = (req: Request, res: Response) => {
    check("name", "Name cannot be blank").not().isEmpty();
    check("email", "Email is not valid").isEmail();
    check("message", "Message cannot be blank").not().isEmpty();

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash("errors", errors.array());
        return res.redirect("/contact");
    }

    const mailOptions = {
        from: "Micro Server Sandbox <postmaster@sandboxedc6d0bacaea455caac6e657cb2cffc1.mailgun.org>",
        to: `${req.body.name} <${req.body.email}>`,
        subject: "Contact Form",
        text: req.body.message
    };

    // mailGun.sendMail({
    //     from: 'myemail@example.com',
    //     to: 'recipient@domain.com', // An array if you have multiple recipients.
    //     cc:'second@domain.com',
    //     bcc:'secretagent@company.gov',
    //     subject: 'Hey you, awesome!',
    //     'h:Reply-To': 'reply2this@company.com',
    //     //You can use "html:" to send HTML email content. It's magic!
    //     html: '<b>Wow Big powerful letters</b>',
    //     //You can use "text:" to send plain-text content. It's oldschool!
    //     text: 'Mailgun rocks, pow pow!'
    //   }, (err, info) => {
    //     if (err) {
    //       console.log(`Error: ${err}`);
    //     }
    //     else {
    //       console.log(`Response: ${info}`);
    //     }
    //   });
      
    mailGun.sendMail(mailOptions, (err) => {
        if (err) {
            req.flash("errors", { msg: err.message });
            return res.redirect("/contact");
        }
        req.flash("success", { msg: "Email has been sent successfully!" });
        res.redirect("/contact");
    });
};