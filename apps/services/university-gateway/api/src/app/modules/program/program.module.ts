import { Module } from '@nestjs/common'
import { ProgramResolver } from './program.resolver'

@Module({
  providers: [ProgramResolver],
})

export class ProgramModule {}
