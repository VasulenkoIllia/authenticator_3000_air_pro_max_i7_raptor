import { Request } from "express";
import {IJwt} from "./jwt.interface";

export interface IAuthorizedRequest extends Request {
  user: IJwt;
}
