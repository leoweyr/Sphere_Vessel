import { ErrorResponseType } from "./enums/ErrorResponseType";


export interface ErrorResponseCapable {
    getType(): ErrorResponseType;
    getMessage(): string;
    getDetails(): Array<any> | null;
}
