import { Module } from '@nestjs/common'
import { DocumentResolver } from './document.resolver';

@Module({
  providers: [DocumentResolver],
})
export class DocumentModule { }
