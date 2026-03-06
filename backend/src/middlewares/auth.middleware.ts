import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { tokenBlacklistModel } from "../models/blacklist.model";

export const authUser = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({
      message: "token not provided",
    });
  }

  const isTokenBlacklisted = await tokenBlacklistModel.findOne({
    token
  })

  if (isTokenBlacklisted) {
    return res.status(401).json({
      message: "token is Invalid"
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
