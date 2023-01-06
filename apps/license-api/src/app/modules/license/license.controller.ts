import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { LicenseService } from './license.service'
import { Audit } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'
import {
  UpdateLicenseResponse,
  UpdateLicenseRequest,
  RevokeLicenseResponse,
  RevokeLicenseRequest,
  VerifyLicenseRequest,
  VerifyLicenseResponse,
} from './dto'
import { ApiTags } from '@nestjs/swagger'

@Controller()
@ApiTags('license-api')
@Audit()
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  @Documentation({
    description: `The endpoint updates a single license. The method of update is according to the LicenseUpdateType parameter
    If Push: The license is updated with the data provided in the payload. If Pull: The license data is pulled and used to update
    the digital license`,
    response: {
      status: 200,
      type: UpdateLicenseResponse,
    },
  })
  @Post('/update')
  async update(
    @Body() data: UpdateLicenseRequest,
  ): Promise<UpdateLicenseResponse> {
    const response = await this.licenseService.updateLicense(data)

    if (!response.ok) {
      throw new BadRequestException(response.error, 'Invalid payload')
    }
    return { ...response.data }
  }

  @Documentation({
    description: `This endpoint revokes a license `,
    response: {
      status: 200,
      type: RevokeLicenseResponse,
    },
  })
  @Post('/revoke')
  async revoke(@Body() data: RevokeLicenseRequest) {
    this.licenseService.revokeLicense(data)
    return
  }

  @Documentation({
    description: `This endpoint verifies a license. Which means that the digital license and the actual license held by the
    relevant institution are compared. If everything adds up, the license is verified.`,
    response: {
      status: 200,
      type: VerifyLicenseResponse,
    },
  })
  @Post('/verify')
  async verify(@Body() data: VerifyLicenseRequest) {
    const response = await this.licenseService.verifyLicense(data)
    return response
  }
}
