import { Request, Response } from "express";
import { fetchResults } from "../services/results";

export const resultsHandler = async (req: Request, res: Response) => {
    const { status } = req.query;
    const results = await fetchResults(status as string);

    res.send(results);
};
