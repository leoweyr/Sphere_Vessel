import { Router, ErrorRequestHandler } from "express";


export interface RouteModule {
    handle(): Promise<Router | ErrorRequestHandler>;
    getName(): string;
}
