import { Request, Response, NextFunction } from 'express';

interface HttpError extends Error {
  status?: number;
}

export const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Identifing error and sending error respose
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';

  res.status(status).json({
    success: false,
    status,
    message,
  });
};
