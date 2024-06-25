import { Global, Module } from '@nestjs/common'

import { LawyersService } from './lawyers.service'

@Global()
@Module({ providers: [LawyersService], exports: [LawyersService] })
export class LawyersModule {}
