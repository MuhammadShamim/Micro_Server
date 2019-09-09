import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import mailGun from "./../util/mailgun";
import { MAILGUN_FROM_ADDRESS } from "./../util/secrets";

/**
 * GET /email
 * Email Page.
 */
export const getEmail = (req: Request, res: Response) => {
    let param = {
        id: req.query.id
    };

    return res.status(200).send({"message": "API to send Email using Mailgun", "params": param});
};

/**
 * POST /email
 * Send an Email.
 */
export const postEmail = (req: Request, res: Response) => {
    // check("name", "Name cannot be blank").not().isEmpty();
    // check("email", "Email is not valid").isEmail();
    // check("message", "Message cannot be blank").not().isEmpty();

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        req.flash("errors", errors.array());
        return res.status(500).send({"errors": JSON.stringify(errors, Object.getOwnPropertyNames(errors))});
    }

    const mailOptions = {
        from: `${req.query.from_name} <${req.query.from_email}>` || MAILGUN_FROM_ADDRESS,
        to: `${req.query.to_name} <${req.query.to_email}>`,
        subject: req.query.subject,
        text: req.query.message
    };
      
    mailGun.sendMail(mailOptions, (err) => {
        if (err) {
            req.flash("errors", { msg: err.message });
            return res.status(500).send({"message": err.message});
        }
        req.flash("success", { msg: "Email has been sent successfully!" });
        return res.status(200).send({msg: "Email has been sent successfully!"});
    });
};