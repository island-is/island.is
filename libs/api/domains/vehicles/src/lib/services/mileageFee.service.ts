import { Inject, Injectable } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import { RskKilometerFeeClientService } from '@island.is/clients/rsk/kilometer-fee'
import { DownloadServiceConfig } from '@island.is/nest/config'
import type { ConfigType } from '@island.is/nest/config'
import { getMockKilometerFee } from '../mocks/mileageFee.mock'
import { GetVehicleMileageFeeInput } from '../dto/getVehicleMileageFeeInput'
import { MileageFee } from '../models/v3/mileageFee.model'
import { mapMileageFee } from '../utils/mileageFeeMapper'

@Injectable()
export class MileageFeeService {
  constructor(
    private readonly kilometerFeeClient: RskKilometerFeeClientService,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadServiceConfig: ConfigType<
      typeof DownloadServiceConfig
    >,
  ) {}

  async getMileageFee(
    user: User,
    input: GetVehicleMileageFeeInput,
  ): Promise<MileageFee | null> {
    const permno = input.permno
    const year = input.year ?? new Date().getFullYear()
    // const fee = await this.kilometerFeeClient.getFee(user, permno, year)
    const fee = getMockKilometerFee(permno, year)
    return fee
      ? mapMileageFee(fee, year, this.downloadServiceConfig.baseUrl)
      : null
  }
}
