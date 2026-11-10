import Joi from "joi";


export const eventSchemas = {
    create: {
        body: Joi.object({
            name: Joi.string().min(3).required().messages({
                "any.required": "Name is required",
                "string.empty": "Name cannot be empty",
            }),
            date: Joi.string().required().messages({
                "any.required": "Date is required",
                "string.empty": "Date cannot be empty",
            }),
            capacity: Joi.number().integer().min(5).required().messages({
                "any.required": "Capacity is required",
                "number.min": "Capacity must be at least 5",
            }),
            registrationCount: Joi.number().integer().min(0).required().messages({
                    "any.required": "Registration count is required",
                    "number.min": "Registration count cannot be negative",
                }),
            status: Joi.string()
                .valid("active", "cancelled", "completed")
                .required()
                .messages({
                    "any.required": "Status is required",
                }),
            category: Joi.string()
                .valid("conference", "workshop", "meetup", "seminar", "general")
                .required()
                .messages({
                    "any.required": "Category is required",
                }),
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
            name: Joi.string().min(3).required().messages({
                "any.required": "Name is required",
                "string.empty": "Name cannot be empty",
            }),
            date: Joi.string().required().messages({
                "any.required": "Date is required",
                "string.empty": "Date cannot be empty",
            }),
            capacity: Joi.number().integer().min(5).required().messages({
                "any.required": "Capacity is required",
                "number.min": "Capacity must be at least 5",
            }),
            registrationCount: Joi.number()
                .integer()
                .min(0)
                .required()
                .messages({
                    "any.required": "Registration count is required",
                    "number.min": "Registration count cannot be negative",
                }),
            status: Joi.string()
                .valid("active", "cancelled", "completed")
                .required()
                .messages({
                    "any.required": "Status is required",
                }),
            category: Joi.string()
                .valid("conference", "workshop", "meetup", "seminar", "general")
                .required()
                .messages({
                    "any.required": "Category is required",
                }),
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
