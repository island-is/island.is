import { Module } from '@nestjs/common'
import { UniversityResolver } from './university.resolver'

@Module({
  providers: [UniversityResolver],
})

export class UniversityModule {}
