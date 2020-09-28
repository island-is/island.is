import { Request } from 'express'

export interface HttpRequest extends Request {
  airline: string
}
