import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { MiddlewareFunction } from "../types/express";
import { HTTP_STATUS } from "../../../constants/httpConstants";

export interface RequestSchemas {
    body?: ObjectSchema;
    params?: ObjectSchema;
    query?: ObjectSchema;
}

interface ValidationOptions {
    stripBody?: boolean;
    stripQuery?: boolean;
    stripParams?: boolean;
}

/**
 * Creates an Express middleware function that validates different parts of the request
 * against separate Joi schemas and strips unknown fields appropriately.
 *
 * @param schemas - Object containing separate schemas for body, params, and query
 * @param options - Validation options for stripping behavior
 * @returns Express middleware function that performs the validation
 */
export const validateRequest = (
    schemas: RequestSchemas,
    options: ValidationOptions = {}
): MiddlewareFunction => {
    const defaultOptions = {
        stripBody: true,
        stripQuery: true,
        stripParams: false,
        ...options,
    };

    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors: string[] = [];

            /**
             * Validate a specific part of the request against a Joi schema
             * @param validationSchema - Joi schema to validate against
             * @param requestData - The request data to validate
             * @param requestSectionName - Name of the request part for error prefixing
             * @param shouldStripFields - Whether to strip unknown fields from the validated data
             * @returns The original data if validation fails or stripping is disabled, otherwise the stripped/validated data
             */
            const validatePart = (
                validationSchema: ObjectSchema,
                requestData: any,
                requestSectionName: string,
                shouldStripFields: boolean
            ) => {
                const { error, value } = validationSchema.validate(
                    requestData,
                    {
                        abortEarly: false,
                        stripUnknown: shouldStripFields,
                    }
                );

                if (error) {
                    errors.push(
                        ...error.details.map(
                            (detail) =>
                                `${requestSectionName}: ${detail.message}`
                        )
                    );
                } else if (shouldStripFields) {
                    return value;
                }
                return requestData;
            };

            // Validate each request part if schema is provided
            if (schemas.body) {
                req.body = validatePart(
                    schemas.body,
                    req.body,
                    "Body",
                    defaultOptions.stripBody
                );
            }

            if (schemas.params) {
                req.params = validatePart(
                    schemas.params,
                    req.params,
                    "Params",
                    defaultOptions.stripParams
                );
            }

            if (schemas.query) {
                req.query = validatePart(
                    schemas.query,
                    req.query,
                    "Query",
                    defaultOptions.stripQuery
                );
            }

            // If there are any validation errors, return them
            if (errors.length > 0) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    error: `Validation error: ${errors.join(", ")}`,
                });
            }

            next();
        } catch (error: unknown) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: (error as Error).message,
            });
        }
    };
};