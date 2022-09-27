import { Request } from 'express'

export interface HttpRequest extends Request {
  childService: string
}
