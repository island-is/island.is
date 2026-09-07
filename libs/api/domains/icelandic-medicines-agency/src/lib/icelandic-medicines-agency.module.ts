import { Module } from '@nestjs/common'

import { LyfjastofnunHealthProvidersClientModule } from '@island.is/clients/lyfjastofnun-health-providers'

import { IcelandicMedicinesAgencyResolver } from './icelandic-medicines-agency.resolver'
import { IcelandicMedicinesAgencyService } from './icelandic-medicines-agency.service'

@Module({
  imports: [LyfjastofnunHealthProvidersClientModule],
  providers: [
    IcelandicMedicinesAgencyResolver,
    IcelandicMedicinesAgencyService,
  ],
  exports: [IcelandicMedicinesAgencyService],
})
export class IcelandicMedicinesAgencyModule {}
