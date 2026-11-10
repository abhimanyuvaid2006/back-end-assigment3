import {
    QuerySnapshot,
    DocumentData,
    DocumentSnapshot,
} from "firebase-admin/firestore";
import { Event } from "../models/eventModel";
import {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
} from "../repositories/firestoreRepository";

const COLLECTION = "events";

/**
 * Retrieves all events from Firestore
 * @returns Array of all events
 */
export const getAllEvents = async (): Promise<Event[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocuments(COLLECTION);
        const events: Event[] = snapshot.docs.map((doc) => {
            const data: DocumentData = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as Event;
        });
        return events;
    } catch (error) {
        throw error;
    }
};

/**
 * Creates a new event in Firestore
 * @param eventData - The data for the new event
 * @returns The created event with generated ID
 */
export const createEvent = async (eventData: {
    name: string;
    date: string;
    capacity: number;
    registrationCount: number;
    status: string;
    category: string;
}): Promise<Event> => {
    try {
        const now = new Date();
        const newEventData = {
            ...eventData,
            createdAt: now,
            updatedAt: now,
        };

        const id = await createDocument<Event>(COLLECTION, newEventData);
        return { id, ...newEventData } as Event;
    } catch (error) {
        throw error;
    }
};

/**
 * Retrieves a single event by ID from Firestore
 * @param id - The ID of the event to retrieve
 * @returns The event if found
 * @throws Error if event not found
 */
export const getEventById = async (id: string): Promise<Event> => {
    try {
        const doc: DocumentSnapshot | null = await getDocumentById(
            COLLECTION,
            id
        );
        if (!doc) {
            throw new Error(`Event with ID ${id} not found`);
        }

        const data: DocumentData | undefined = doc.data();
        const event: Event = {
            id: doc.id,
            ...data,
            createdAt: data?.createdAt?.toDate() || new Date(),
            updatedAt: data?.updatedAt?.toDate() || new Date(),
        } as Event;

        return event;
    } catch (error) {
        throw error;
    }
};

/**
 * Updates an existing event in Firestore
 * @param id - The ID of the event to update
 * @param eventData - The fields to update
 * @returns The updated event
 * @throws Error if event not found
 */
export const updateEvent = async (
    id: string,
    eventData: Pick<
        Event,
        "name" | "date" | "capacity" | "registrationCount" | "status" | "category"
    >
): Promise<Event> => {
    try {
        const updateData = {
            ...eventData,
            updatedAt: new Date(),
        };

        await updateDocument<Event>(COLLECTION, id, updateData);

        // Return the updated event
        const updatedEvent = await getEventById(id);
        return updatedEvent;
    } catch (error) {
        throw error;
    }
};

/**
 * Deletes an event from Firestore
 * @param id - The ID of the event to delete
 * @throws Error if event not found
 */
export const deleteEvent = async (id: string): Promise<void> => {
    try {
        const doc: DocumentSnapshot | null = await getDocumentById(
            COLLECTION,
            id
        );
        if (!doc) {
            throw new Error(`Event with ID ${id} not found`);
        }

        await deleteDocument(COLLECTION, id);
    } catch (error) {
        throw error;
    }
};