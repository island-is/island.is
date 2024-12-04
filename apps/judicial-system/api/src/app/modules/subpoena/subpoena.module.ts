import { Module } from '@nestjs/common'

import { SubpoenaResolver } from './subpoena.resolver'

@Module({
  providers: [SubpoenaResolver],
})
export class SubpoenaModule {}
