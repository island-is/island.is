import { Module } from '@nestjs/common'
import { ElasticService } from './elastic.service'
import { ElasticConfigService } from './elasticconfig.service'

@Module({
  providers: [ElasticService, ElasticConfigService],
  exports: [ElasticService],
})
export class ElasticModule {}
