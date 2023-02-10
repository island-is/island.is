import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
} from '@nestjs/common'
import { LicenseService } from './license.service'
import { Audit } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'
import {
  UpdateLicenseResponse,
  UpdateLicenseRequest,
  RevokeLicenseResponse,
  VerifyLicenseRequest,
  VerifyLicenseResponse,
} from './dto'
import { ApiTags } from '@nestjs/swagger'
import { LicenseId } from './license.types'

@Controller({ version: ['1'] })
@ApiTags('license-api')
@Audit()
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  @Documentation({
    description: `The endpoint updates a single user's license. The method of update is according to the LicenseUpdateType parameter
    If Push: The license is updated with the data provided in the payload. If Pull: The license data is pulled and used to update
    the digital license`,
    response: {
      status: 200,
      type: UpdateLicenseResponse,
    },
  })
  @Put('users/.nationalId/licenses/:licenseId')
  async update(
    @Headers('X-Param-NationalId') nationalId: string,
    @Param('licenseId') licenseId: LicenseId,
    @Body() data: UpdateLicenseRequest,
  ): Promise<UpdateLicenseResponse> {
    const response = await this.licenseService.updateLicense(
      licenseId,
      nationalId,
      data,
    )
    return response
  }

  @Delete('users/.nationalId/licenses/:licenseId')
  @Documentation({
    description: `This endpoint revokes a user's license`,
    response: {
      status: 200,
      type: RevokeLicenseResponse,
    },
  })
  async revoke(
    @Headers('X-Param-NationalId') nationalId: string,
    @Param('licenseId') licenseId: LicenseId,
  ) {
    const response = await this.licenseService.revokeLicense(
      licenseId,
      nationalId,
    )
    return response
  }

  @Documentation({
    description: `This endpoint verifies a user's license. Which means that the digital license and the actual license held by the
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
