import type { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { tokenBlacklistModel } from "../models/blacklist.model";

/**
 * @name RegisterControllerUser
 * @description Register a new user, expecting username, email and password in 
 * @access Public
 */
export const RegisterControllerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "please provide username, email and password",
    });
  }

  const UserExists = await UserModel.findOne({
    $or: [{ username }, { email }],
  });

  if (UserExists) {
    return res.status(400).json({
      message: "user already exists with this username or email",
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await UserModel.create({
    username,
    email,
    password: hash,
  });

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

/**
 * @name loginUserController
 * @description Login a user, expecting email and password in the request body
 * @access Public
 */
export const loginUserController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid password",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "User is logged in successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

/**
 * @name logoutUserController
 * @description Logout a user, clearing the token from the cookie and add token to blacklist
 * @access Public
 */
export const logoutUserController = async (req: Request, res: Response) => {
  const token = req.cookies.token;

  if (token) {
    await tokenBlacklistModel.create({ token });
  }

  res.clearCookie("token");

  res.status(200).json({
    message: "User logged out successfully",
  });
};

/**
 * @name getMeController
 * @description Get the logged in user details
 * @access Private
 */
export const getMeController = async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.user.id)

  res.status(201).json({
    message: "User details fetched successfully",
    user: {
      id: user?._id,
      username: user?.username,
      email: user?.email
    }
  })
}
