import HelloWorldRepository from './repository'
import { HelloWorldService as Service } from '@island.is/api/schema'

export class HelloWorldService implements Service {
  constructor(private repository: HelloWorldRepository) {}

  getMessage(name: string) {
    const helloWord = this.repository.getHelloWord()
    return `${helloWord} ${name}!`
  }
}

export default HelloWorldService
