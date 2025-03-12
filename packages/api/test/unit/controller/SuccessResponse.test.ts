import { Response } from "express";

import { SuccessResponseType } from "@/controller/enums/SuccessResponseType";
import { SuccessResponse } from "@/controller/SuccessResponse";


describe("SuccessResponse", (): void => {
    let mockResponse: Response;

    beforeEach((): void => {
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;
    });

    afterEach((): void => {
        jest.clearAllMocks();
    });

    describe("constructor()", (): void => {
        it("should set status to true and send JSON response with status code OK when no details are provided", (): void => {
            new SuccessResponse(mockResponse, SuccessResponseType.OK);

            expect(mockResponse.status).toHaveBeenCalledWith(SuccessResponseType.OK);
            expect(mockResponse.json).toHaveBeenCalledWith({ status: true });
        });

        it("should set status to true and send JSON response with status code CREATED when no details are provided", (): void => {
            new SuccessResponse(mockResponse, SuccessResponseType.CREATED);

            expect(mockResponse.status).toHaveBeenCalledWith(SuccessResponseType.CREATED);
            expect(mockResponse.json).toHaveBeenCalledWith({ status: true });
        });

        it("should set status to true and send JSON response with details when details are provided", (): void => {
            const details = { message: "Resource created successfully" };
            new SuccessResponse(mockResponse, SuccessResponseType.CREATED, details);

            expect(mockResponse.status).toHaveBeenCalledWith(SuccessResponseType.CREATED);
            expect(mockResponse.json).toHaveBeenCalledWith({ status: true, details });
        });
    });
});
