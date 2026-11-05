import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Put,
  Query,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import {
  DeviceRegistrationDto,
  DeviceRegistrationsService,
  SaveDeviceRegistrationDto,
  UpdateDeviceRegistrationDto,
} from '@island.is/auth-api-lib'
import { IdsAuthGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'

const namespace = '@island.is/auth/ids-api/device-registrations'

/** Native app logins, managed by IdentityServer. */
@ApiTags('device-registrations')
@Controller({
  path: 'device-registrations',
  version: ['1', VERSION_NEUTRAL],
})
@UseGuards(IdsAuthGuard, ScopesGuard)
@Audit({ namespace })
@Scopes('@identityserver.api/authentication')
export class DeviceRegistrationsController {
  constructor(
    private readonly deviceRegistrationsService: DeviceRegistrationsService,
  ) {}

  @Get('install-keys/:thumbprint')
  @Documentation({
    description: 'Gets the registration of an install by its install key.',
    request: {
      params: { thumbprint: { type: 'string', required: true } },
      query: { clientId: { type: 'string', required: true } },
    },
    response: { status: 200, type: DeviceRegistrationDto },
  })
  async findByInstallKey(
    @Param('thumbprint') thumbprint: string,
    @Query('clientId') clientId: string,
  ): Promise<DeviceRegistrationDto> {
    if (!clientId) {
      throw new BadRequestException('clientId is required')
    }

    const registration = await this.deviceRegistrationsService.findByInstallKey(
      clientId,
      thumbprint,
    )
    if (!registration) {
      throw new NotFoundException()
    }

    return registration
  }

  @Put()
  @Documentation({
    description:
      "Creates or replaces a person's registration for a client: one app login per person.",
    response: { status: 200, type: DeviceRegistrationDto },
  })
  @Audit<DeviceRegistrationDto>({
    resources: (registration) => registration.id,
  })
  save(
    @Body() input: SaveDeviceRegistrationDto,
  ): Promise<DeviceRegistrationDto> {
    return this.deviceRegistrationsService.save(input)
  }

  @Patch(':id')
  @HttpCode(204)
  @Documentation({
    description:
      'Updates the biometric key and last use of an app login, while it still has the given install key.',
    request: { params: { id: { type: 'string', required: true } } },
    response: { status: 204 },
  })
  @Audit()
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() input: UpdateDeviceRegistrationDto,
  ): Promise<void> {
    if (!(await this.deviceRegistrationsService.update(id, input))) {
      throw new NotFoundException()
    }
  }

  @Delete(':id')
  @HttpCode(204)
  @Documentation({
    description: 'Removes an app login.',
    request: { params: { id: { type: 'string', required: true } } },
    response: { status: 204 },
  })
  @Audit()
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.deviceRegistrationsService.delete(id)
  }
}
