import { Module } from '@nestjs/common'

import { LyfjastofnunPharmaciesClientModule } from '@island.is/clients/lyfjastofnun-pharmacies'

import { IcelandicMedicinesAgencyResolver } from './icelandic-medicines-agency.resolver'
import { IcelandicMedicinesAgencyService } from './icelandic-medicines-agency.service'

@Module({
  imports: [LyfjastofnunPharmaciesClientModule],
  providers: [IcelandicMedicinesAgencyResolver, IcelandicMedicinesAgencyService],
  exports: [IcelandicMedicinesAgencyService],
})
export class IcelandicMedicinesAgencyModule {}
