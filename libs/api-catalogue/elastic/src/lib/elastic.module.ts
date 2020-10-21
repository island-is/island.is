import { Module } from '@nestjs/common'
import { ElasticService } from './elastic.service'

@Module({
  providers: [ElasticService],
  exports: [ElasticService],
})
export class ElasticModule {}
