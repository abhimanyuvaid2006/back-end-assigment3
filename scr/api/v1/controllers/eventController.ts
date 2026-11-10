import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as eventService from "../services/eventService";
import type { Event } from "../models/eventModel";
import { successResponse } from "../models/responseModel";

/**
 * Retrieves all events
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getAllEvents = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const events: Event[] = await eventService.getAllEvents();
        res.status(HTTP_STATUS.OK).json(
            successResponse(events, "Events retrieved successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Retrieves a single event by ID
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getEventById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;

        const event: Event = await eventService.getEventById(id);
        res.status(HTTP_STATUS.OK).json(
            successResponse(event, "Event retrieved successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Creates a new event
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const createEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Extract validated data from request body
        const { name, date, capacity, registrationCount, status, category } =
            req.body;
        const eventData = {
            name,
            date,
            capacity,
            registrationCount,
            status,
            category,
        };

        const newEvent: Event = await eventService.createEvent(eventData);
        res.status(HTTP_STATUS.CREATED).json(
            successResponse(newEvent, "Event created successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Updates an existing event
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const updateEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;
        const { name, date, capacity, registrationCount, status, category } =
            req.body;

        // Create update data object with only the fields that can be updated
        const updateData = {
            name,
            date,
            capacity,
            registrationCount,
            status,
            category,
        };

        const updatedEvent: Event = await eventService.updateEvent(
            id,
            updateData
        );
        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedEvent, "Event updated successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Deletes an event
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const deleteEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;

        await eventService.deleteEvent(id);
        res.status(HTTP_STATUS.OK).json(
            successResponse("Event successfully deleted")
        );
    } catch (error: unknown) {
        next(error);
    }
};