import { Module } from '@nestjs/common';
import { ItemResolver } from './item.resolver';

@Module({
  providers: [ItemResolver],
  exports: [ItemResolver],
})
export class ItemModule {}
