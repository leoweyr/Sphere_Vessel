import { Response } from "express";

import { SuccessResponseType } from "./enums/SuccessResponseType";


export class SuccessResponse {
    constructor(response: Response, type: SuccessResponseType, details?: any) {
        const responseJson: { status: boolean, details?: any } = {
            status: true
        }

        if (details) {
            responseJson.details = details;
        }

        response.status(type).json(responseJson);
    }
}
