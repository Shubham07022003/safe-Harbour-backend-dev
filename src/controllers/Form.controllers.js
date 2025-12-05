// ===============================================
// Controller: Form
// File: Form.controllers.js
// ===============================================
//
// • File name starts with Capital (Form.controllers.js)
//   because it represents a controller class/module.
//
// • ".controllers.js" clearly indicates this file contains
//   request-handling logic for the Form model.
//
// • Follows best practices:
//     - Zod validation for input
//     - Proper async/await usage
//     - Return statements to prevent duplicate responses
//     - Clean Fastify-compatible response format
//
// ===============================================

import { Form } from "../models/Form.models.js";
import  {FormValidation}  from "../validator/Form.validation.js";

export const FormController = async (req, res) => {
    try {
        // 1. Validate request data using Zod
        const data = FormValidation.parse(req.body);

        // (Not needed because Zod already checks, but kept for safety)
        if (!data.fullname || !data.number) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        // 2. Create new form entry
        const newform = await Form.create({
            fullname: data.fullname,
            number: data.number,
        });

        // Check if form was not created (rare case)
        if (!newform) {
            return res
                .status(500)
                .json({ msg: "Error occurred while creating the form" });
        }

        // 3. Success response
        return res.status(200).json({
            msg: "Form created successfully",
            form: newform,
        });

    } catch (error) {
        // Zod Validation Error Handling
        if (error.name === "ZodError") {
            return res.status(400).json({
                msg: "Validation error",
                errors: error.errors,
            });
        }

        console.log("Controller Error:", error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};
