import { HttpException, HttpStatus } from "@nestjs/common";

export class NoContentException extends HttpException {
  constructor() {
    super('No Content', HttpStatus.NO_CONTENT);
  }
}