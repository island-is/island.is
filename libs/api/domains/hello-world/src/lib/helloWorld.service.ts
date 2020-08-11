import { HelloWorldRepository } from './helloWorld.repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class HelloWorldService {
  constructor(private repository: HelloWorldRepository) {}

  getMessage(name: string) {
    const helloWord = this.repository.getHelloWord()
    return `${helloWord} ${name}!`
  }
}
