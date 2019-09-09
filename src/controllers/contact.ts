import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import mailGun from "./../util/mailgun";
import { MAILGUN_FROM_ADDRESS } from "./../util/secrets";


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
        from: MAILGUN_FROM_ADDRESS,
        to: `${req.body.name} <${req.body.email}>`,
        subject: "Contact Form",
        text: req.body.message
    };
      
    mailGun.sendMail(mailOptions, (err) => {
        if (err) {
            req.flash("errors", { msg: err.message });
            return res.redirect("/contact");
        }
        req.flash("success", { msg: "Email has been sent successfully!" });
        res.redirect("/contact");
    });
};