import { Module } from '@nestjs/common'
import { OrganizationEmployeeApiProvider } from './apiConfig';
import { ElfurClientService } from './elfur.service';

@Module({
  providers: [OrganizationEmployeeApiProvider, ElfurClientService],
  exports: [ElfurClientService],
})
export class ElfurClientModule {}
