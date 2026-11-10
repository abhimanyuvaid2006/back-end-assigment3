import { Request, Response, NextFunction } from "express";
import { validateRequest } from "../src/api/v1/middleware/validate";
import { eventSchemas } from "../src/api/v1/validation/eventValidation";
import { HTTP_STATUS } from "../src/constants/httpConstants";

describe("Event Validation Middleware", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockReq = {
            body: {},
            params: {},
            query: {},
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });

    it("should pass validation for valid event data", () => {
        // Arrange
        mockReq.body = {
            name: "Tech Conference",
            date: "2030-01-01T10:00:00.000Z",
            capacity: 50,
            registrationCount: 10,
            status: "active",
            category: "conference",
        };
        const middleware = validateRequest(eventSchemas.create);

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail when a required field is missing", () => {
        // Arrange
        mockReq.body = {
            date: "2030-01-01T10:00:00.000Z",
            capacity: 50,
        };
        const middleware = validateRequest(eventSchemas.create);

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: expect.stringContaining('"name" is required'),
        });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when capacity is below the minimum", () => {
        // Arrange
        mockReq.body = {
            name: "Small Event",
            date: "2030-01-01T10:00:00.000Z",
            capacity: 4,
        };
        const middleware = validateRequest(eventSchemas.create);

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: expect.stringContaining(
                '"capacity" must be greater than or equal to 5'
            ),
        });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when status is not an allowed value", () => {
        // Arrange
        mockReq.body = {
            name: "Test Event",
            date: "2030-01-01T10:00:00.000Z",
            capacity: 100,
            status: "pending",
        };
        const middleware = validateRequest(eventSchemas.create);

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: expect.stringContaining(
                '"status" must be one of [active, cancelled, completed]'
            ),
        });
        expect(mockNext).not.toHaveBeenCalled();
    });
});