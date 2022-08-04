import { Module } from '@nestjs/common'
import { HeilbrigdisstofnunNordurlandsClientService } from './heilbrigdisstofnunNordurlandsClient.service'

@Module({
  providers: [HeilbrigdisstofnunNordurlandsClientService],
  exports: [HeilbrigdisstofnunNordurlandsClientService],
})
export class HeilbrigdisstofnunNordurlandsClientModule {}
