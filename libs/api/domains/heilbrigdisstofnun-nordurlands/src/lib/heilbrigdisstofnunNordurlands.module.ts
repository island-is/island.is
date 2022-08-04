import { Module } from '@nestjs/common'
import { HeilbrigdisstofnunNordurlandsResolver } from './heilbrigdisstofnunNordurlands.resolver'
import { HeilbrigdisstofnunNordurlandsClientModule } from '@island.is/clients/heilbrigdisstofnun-nordurlands'

@Module({
  imports: [HeilbrigdisstofnunNordurlandsClientModule],
  providers: [HeilbrigdisstofnunNordurlandsResolver],
})
export class SyslumennModule {}
