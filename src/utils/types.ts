import { Request } from "express";
import { number } from "joi";

export interface BaseRequest extends Request {
  user: any;
}

export interface ImageItem {
  image_url: string;
  image_media_type: string;
}

export interface DoesUsernameExistRequest extends BaseRequest {
  body: {
    username: string;
  };
}

export interface RecordBehaviorProps {
  session_id: number;
  behavior_id: number;
  elapsed_time?: number;
  behavior_count?: number;
  num_interval?: number;
}
