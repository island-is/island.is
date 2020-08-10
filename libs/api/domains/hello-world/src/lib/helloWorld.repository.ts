import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloWorldRepository {
  getHelloWord() {
    return 'Hello'
  }
}
