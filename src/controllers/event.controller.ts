import { NextFunction, Request, Response } from "express";
import getEventsService from "../services/event/get-events.service";

export async function getEventsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const result = await getEventsService();
    response.status(200).send(result);
  } catch (error) {
    next(error);
  }
}
