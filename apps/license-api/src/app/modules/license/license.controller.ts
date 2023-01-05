import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { LicenseService } from './license.service'
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { Audit } from '@island.is/nest/audit'
import {
  UpdateLicenseResponse,
  LicenseError,
  UpdateLicenseRequest,
  RevokeLicenseResponse,
  RevokeLicenseRequest,
  VerifyLicenseRequest,
  VerifyLicenseResponse,
} from './dto'

@Controller()
@ApiTags('license-api')
@Audit()
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  @ApiOkResponse({
    description: 'Update successful for license',
    type: UpdateLicenseResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request body, details in body',
    type: LicenseError,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'License not found' })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: LicenseError,
  })
  @Post('/update')
  async update(
    @Body() data: UpdateLicenseRequest,
  ): Promise<UpdateLicenseResponse> {
    const response = await this.licenseService.updateLicense(data)

    if (!response.ok) {
      throw new BadRequestException(response.error)
    }
    return { ...response.data }
  }
  @ApiOkResponse({
    description: 'License successfully revoked',
    type: RevokeLicenseResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request body, details in body',
    type: LicenseError,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'License not found' })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: LicenseError,
  })
  @Post('/revoke')
  async revoke(@Body() data: RevokeLicenseRequest) {
    this.licenseService.revokeLicense(data)
    return
  }
  @ApiOkResponse({
    description: 'License successfully verified',
    type: VerifyLicenseResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request body, details in body',
    type: LicenseError,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'License not found' })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: LicenseError,
  })
  @Post('/verify')
  async verify(@Body() data: VerifyLicenseRequest) {
    this.licenseService.verifyLicense(data)
    return
  }
}
