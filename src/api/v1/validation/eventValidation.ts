import Joi from "joi";

export const eventSchemas = {
    create: {
        body: Joi.object({
            name: Joi.string().min(3).required(),
            date: Joi.date().iso().greater("now").required(),
            capacity: Joi.number().integer().min(5).required(),
            registrationCount: Joi.number()
                .integer()
                .min(0)
                .max(Joi.ref("capacity"))
                .default(0),
            status: Joi.string()
                .valid("active", "cancelled", "completed")
                .default("active"),
            category: Joi.string()
                .valid("conference", "workshop", "meetup", "seminar", "general")
                .default("general"),
        }),
    },

    getById: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Event ID is required",
                "string.empty": "Event ID cannot be empty",
            }),
        }),
    },

    update: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Event ID is required",
                "string.empty": "Event ID cannot be empty",
            }),
        }),
        body: Joi.object({
            name: Joi.string().min(3).required(),
            date: Joi.date().iso().greater("now").required(),
            capacity: Joi.number().integer().min(5).required(),
            registrationCount: Joi.number()
                .integer()
                .min(0)
                .max(Joi.ref("capacity"))
                .default(0),
            status: Joi.string()
                .valid("active", "cancelled", "completed")
                .default("active"),
            category: Joi.string()
                .valid("conference", "workshop", "meetup", "seminar", "general")
                .default("general"),
        }),
    },

    delete: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Event ID is required",
                "string.empty": "Event ID cannot be empty",
            }),
        }),
    },
};