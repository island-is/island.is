import { Module } from '@nestjs/common'
import { ProgramResolver } from './program.resolver'
import { ConfigModule } from '@nestjs/config'

@Module({
  providers: [ProgramResolver],
})

export class ProgramModule {}
