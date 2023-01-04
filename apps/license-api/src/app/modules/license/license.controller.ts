import { Body, Controller, Delete, Put } from '@nestjs/common'
import { LicenseService } from './license.service'
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'
import { Audit } from '@island.is/nest/audit'
import { DeleteLicenseDto, UpdateLicenseDto } from './dto/license.dto'

@Controller('license-api')
@ApiTags('license-api')
@Audit()
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  @ApiOkResponse({ description: 'Update successful for at least one license' })
  @ApiNoContentResponse({
    description: 'Update successful for a single license',
  })
  @ApiNotFoundResponse({ description: 'License not found' })
  @Put()
  async put(@Body() data: UpdateLicenseDto): Promise<string> {
    return this.licenseService.updateLicense(data)
  }
  @ApiNoContentResponse({ description: 'License entry deleted' })
  @ApiNotFoundResponse({ description: 'License not found' })
  @Delete()
  async delete(@Body() data: DeleteLicenseDto) {
    this.licenseService.deleteLicense(data)
    return
  }
}
