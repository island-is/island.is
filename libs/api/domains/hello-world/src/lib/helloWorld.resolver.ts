import { Args, Query, Resolver } from '@nestjs/graphql'
import { HelloWorldService } from './helloWorld.service'
import { HelloWorld } from './helloWorld.model'
import { HelloWorldInput } from './dto/helloWorld.input'

@Resolver()
export class HelloWorldResolver {
  constructor(private helloWorldService: HelloWorldService) {}

  @Query((returns) => HelloWorld)
  helloWorld(
    @Args('input') input: HelloWorldInput,
  ): HelloWorld {
    const message = this.helloWorldService.getMessage(input?.name ?? 'World')
    return { message }
  }
}
