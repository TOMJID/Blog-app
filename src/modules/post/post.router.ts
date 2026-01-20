import express, { NextFunction, Request, Response } from "express";
import { PostController } from "./post.controller";
import { auth as betterAuth } from "../../lib/auth";

const router = express.Router();

//? setting types for role
const enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

//? setting global types for user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //* getting user session
    const session = await betterAuth.api.getSession({
      headers: req.headers as any,
    });
    //? if there aren't any session
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized because of session",
      });
    }
    //? email verification check
    if (!session.user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized because you email isn't Verified",
      });
    }

    //? separating user data
    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role as string,
      emailVerified: session.user.emailVerified,
    };

    if (roles.length && !roles.includes(req.user.role as UserRole)) {
      return res.status(404).json({
        success: false,
        message: "only Admin has the permission to access this resources.",
      });
    }

    next();
  };
};

router.post("/", auth(UserRole.USER), PostController.CreatePost);

export const postRouter = router;
