import express, { Router } from "express";
import { validateRequest } from "../middleware/validate";
import { eventSchemas } from "../validation/eventValidation";
import * as eventController from "../controllers/eventController";

const router: Router = express.Router();

router.get("/", eventController.getAllEvents);
router.post(
    "/",
    validateRequest(eventSchemas.create),
    eventController.createEvent
);
router.get(
    "/:id",
    validateRequest(eventSchemas.getById),
    eventController.getEventById
);
router.put(
    "/:id",
    validateRequest(eventSchemas.update),
    eventController.updateEvent
);
router.delete(
    "/:id",
    validateRequest(eventSchemas.delete),
    eventController.deleteEvent
);

export default router;