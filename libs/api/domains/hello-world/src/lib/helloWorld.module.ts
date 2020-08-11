import { Module } from '@nestjs/common'
import { HelloWorldService } from './helloWorld.service'
import { HelloWorldRepository } from './helloWorld.repository'
import { HelloWorldResolver } from './helloWorld.resolver'

@Module({
  providers: [HelloWorldResolver, HelloWorldService, HelloWorldRepository],
})
export class HelloWorldModule {}
