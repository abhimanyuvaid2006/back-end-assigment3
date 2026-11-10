import * as eventService from "../src/api/v1/services/eventService";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";
import { Event } from "../src/api/v1/models/eventModel";

// Mock the repository module
// jest.mock replaces the entire module with an auto-mocked version
jest.mock("../src/api/v1/repositories/firestoreRepository");

describe("Event Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should get all events successfully", async () => {
        // Arrange
        const mockSnapshot = {
            docs: [
                {
                    id: "test-event-id",
                    data: () => ({
                        name: "Tech Conference",
                        date: "2030-01-01T10:00:00.000Z",
                        capacity: 50,
                        registrationCount: 10,
                        status: "active",
                        category: "conference",
                        createdAt: { toDate: () => new Date() },
                        updatedAt: { toDate: () => new Date() },
                    }),
                },
            ],
        };

        (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue(
            mockSnapshot
        );

        // Act
        const result: Event[] = await eventService.getAllEvents();

        // Assert
        expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("events");
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe("test-event-id");
        expect(result[0].name).toBe("Tech Conference");
    });

    it("should create an event successfully", async () => {
        // Arrange
        const mockEventData: {
            name: string;
            date: string;
            capacity: number;
            registrationCount: number;
            status: string;
            category: string;
        } = {
            name: "Tech Conference",
            date: "2030-01-01T10:00:00.000Z",
            capacity: 50,
            registrationCount: 10,
            status: "active",
            category: "conference",
        };
        const mockDocumentId: string = "test-event-id";

        (firestoreRepository.createDocument as jest.Mock).mockResolvedValue(
            mockDocumentId
        );

        // Act
        const result: Event = await eventService.createEvent(mockEventData);

        // Assert
        expect(firestoreRepository.createDocument).toHaveBeenCalledWith(
            "events",
            expect.objectContaining({
                name: mockEventData.name,
                capacity: mockEventData.capacity,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            })
        );
        expect(result.id).toBe(mockDocumentId);
        expect(result.name).toBe(mockEventData.name);
    });

    it("should get an event by ID successfully", async () => {
        // Arrange
        const mockDocumentId: string = "test-event-id";
        const mockDoc = {
            id: mockDocumentId,
            data: () => ({
                name: "Tech Conference",
                date: "2030-01-01T10:00:00.000Z",
                capacity: 50,
                registrationCount: 10,
                status: "active",
                category: "conference",
                createdAt: { toDate: () => new Date() },
                updatedAt: { toDate: () => new Date() },
            }),
        };

        (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(
            mockDoc
        );

        // Act
        const result: Event = await eventService.getEventById(mockDocumentId);

        // Assert
        expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith(
            "events",
            mockDocumentId
        );
        expect(result.id).toBe(mockDocumentId);
        expect(result.name).toBe("Tech Conference");
    });

    it("should update an event successfully", async () => {
        // Arrange
        const mockDocumentId: string = "test-event-id";
        const mockUpdateData: {
            name: string;
            date: string;
            capacity: number;
            registrationCount: number;
            status: string;
            category: string;
        } = {
            name: "Updated Conference",
            date: "2030-02-01T10:00:00.000Z",
            capacity: 100,
            registrationCount: 20,
            status: "active",
            category: "workshop",
        };
        const mockEvent: Event = {
            id: mockDocumentId,
            ...mockUpdateData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // jest.spyOn creates a mock for a specific method/function on an object, in our example the eventService
        jest.spyOn(eventService, "getEventById").mockResolvedValue(mockEvent);

        // jest.Mock replaces the auto-mocked version with our specific mocked implementation
        (firestoreRepository.updateDocument as jest.Mock).mockResolvedValue(
            undefined
        );

        // Act
        const result: Event = await eventService.updateEvent(
            mockDocumentId,
            mockUpdateData
        );

        // Assert
        expect(firestoreRepository.updateDocument).toHaveBeenCalledWith(
            "events",
            mockDocumentId,
            expect.objectContaining({
                name: mockUpdateData.name,
                updatedAt: expect.any(Date),
            })
        );
        expect(eventService.getEventById).toHaveBeenCalledWith(mockDocumentId);
        expect(result.name).toBe(mockUpdateData.name);
    });

    it("should delete an event successfully", async () => {
        // Arrange
        const mockDocumentId: string = "test-event-id";
        const mockDoc = { id: mockDocumentId };

        // deleteEvent checks the document with getDocumentById (not getEventById), so we mock the repository call
        (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(
            mockDoc
        );
        (firestoreRepository.deleteDocument as jest.Mock).mockResolvedValue(
            undefined
        );

        // Act
        await eventService.deleteEvent(mockDocumentId);

        // Assert
        expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith(
            "events",
            mockDocumentId
        );
        expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith(
            "events",
            mockDocumentId
        );
    });
});