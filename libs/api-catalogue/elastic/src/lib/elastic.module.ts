import { Module } from '@nestjs/common'
import { ElasticService } from './elastic.service'
import { ElasticConfigService } from './elastic-config.service'

@Module({
  providers: [ElasticService, ElasticConfigService],
  exports: [ElasticService],
})
export class ElasticModule {}
