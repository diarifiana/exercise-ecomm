import { Request, Response, NextFunction } from "express";
import { fromBuffer } from "file-type";
import core from "file-type/core";
import { ApiError } from "../utils/api-error";

export const fileFilter = (allowedTypes: core.MimeType[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    for (const fieldname in files) {
      const fileArray = files[fieldname];

      for (const file of fileArray) {
        const type = await fromBuffer(file?.buffer);

        if (!type || !allowedTypes.includes(type.mime)) {
          throw new ApiError(`File type ${type?.mime} is not allowed`, 400);
        }
      }
    }

    next();
  };
};
