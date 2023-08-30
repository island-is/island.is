import { Module } from '@nestjs/common'
import { UniversityResolver } from './university.resolver'
import { ConfigModule } from '@nestjs/config'

@Module({
  providers: [UniversityResolver],
})

export class UniversityModule {}
