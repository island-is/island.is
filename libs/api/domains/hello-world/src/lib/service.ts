import HelloWorldRepository from './repository'

export class HelloWorldService {
  constructor(private repository: HelloWorldRepository) {}

  getMessage(name: string) {
    const helloWord = this.repository.getHelloWord()
    return `${helloWord} ${name}!`
  }
}

export default HelloWorldService
