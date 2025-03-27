import { Request, Response, NextFunction } from "express";
import {
  AuthUnknownError,
  AuthRetryableFetchError,
} from "@supabase/supabase-js";
import logger from "../utils/logger";
import delay from "../utils/delay";
import supabase from "../utils/supabase";
import { BaseRequest } from "../utils/types";

const MAX_TRIES = 3;
const DELAY_BETWEEN_TRIES = 100;

const isUnknownOrRetryableSupabaseAuthError = (supabaseError) => {
  return (
    supabaseError instanceof AuthUnknownError ||
    supabaseError instanceof AuthRetryableFetchError
  );
};

const tryGetSupabaseUser = async (supabaseClient, access_token, retryCount) => {
  const result = await supabaseClient.auth.getUser(access_token);
  const { data, error: supabaseError } = result;

  if (supabaseError) {
    if (isUnknownOrRetryableSupabaseAuthError(supabaseError)) {
      logger.error(
        `Failed to call db function 'get_user_id_by_email': ${JSON.stringify(
          supabaseError
        )}`
      );
      if (retryCount < MAX_TRIES) {
        await delay(DELAY_BETWEEN_TRIES);
        return await tryGetSupabaseUser(
          supabaseClient,
          access_token,
          retryCount + 1
        );
      }
      return { error: supabaseError };
    } else {
      return { error: supabaseError };
    }
  } else {
    return { data };
  }
};

const authMiddleware = async (
  req: BaseRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"];
    const access_token = authHeader && authHeader.split(" ")[1];

    if (
      !access_token ||
      access_token === "undefined" ||
      access_token === "null"
    ) {
      res.status(401).json({ error: "Access token is missing" });
    }

    const { data: userData, error: supabaseError } = await tryGetSupabaseUser(
      supabase,
      access_token,
      0
    );

    if (supabaseError) {
      res.status(401).json({ error: "Unauthorized - Invalid access token" });
    }

    req.user = userData.user;

    next();
  } catch (error) {
    logger.error(`error authing : ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default authMiddleware;
