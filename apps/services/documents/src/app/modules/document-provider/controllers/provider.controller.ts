import { ApiScope } from '@island.is/auth/scopes'
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Audit, AuditService } from '@island.is/nest/audit'

import { environment } from '../../../../environments'
import { DocumentProviderService } from '../document-provider.service'
import { CreateProviderDto } from '../dto/createProvider.dto'
import { UpdateProviderDto } from '../dto/updateProvider.dto'
import { Provider } from '../models/provider.model'
import { AdminPortalScope } from '@island.is/auth/scopes'

const namespace = `${environment.audit.defaultNamespace}/providers`

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('providers')
@ApiHeader({
  name: 'authorization',
  description: 'Bearer token authorization',
})
@Controller('providers')
@Audit({ namespace })
export class ProviderController {
  constructor(
    private readonly documentProviderService: DocumentProviderService,
    private readonly auditService: AuditService,
  ) {}

  @Get()
  @Scopes(AdminPortalScope.documentProvider)
  @ApiOkResponse({ type: [Provider] })
  @Audit<Provider[]>({
    resources: (providers) => providers.map((provider) => provider.id),
  })
  async getAllProviders(): Promise<Provider[]> {
    return this.documentProviderService.getProviders()
  }

  @Get(':id')
  @Scopes(AdminPortalScope.documentProvider)
  @ApiOkResponse({ type: Provider })
  @Audit<Provider>({
    resources: (provider) => provider.id,
  })
  async findById(@Param('id') id: string): Promise<Provider> {
    const provider = await this.documentProviderService.findProviderById(id)

    if (!provider) {
      throw new NotFoundException(`A provider with id ${id} does not exist`)
    }

    return provider
  }

  @Get('/external/:id')
  @Scopes(ApiScope.internal, AdminPortalScope.documentProvider)
  @ApiOkResponse({ type: Provider })
  @Audit<Provider>({
    resources: (provider) => provider.id,
  })
  async findByExternalId(@Param('id') id: string): Promise<Provider> {
    const provider =
      await this.documentProviderService.findProviderByExternalProviderId(id)

    if (!provider) {
      throw new NotFoundException(
        `A provider with externalProviderId ${id} does not exist`,
      )
    }

    return provider
  }

  @Post()
  @Scopes(ApiScope.internal, AdminPortalScope.documentProvider)
  @ApiCreatedResponse({ type: Provider })
  @Audit<Provider>({
    resources: (provider) => provider?.id,
  })
  async createProvider(
    @Body() provider: CreateProviderDto,
    @CurrentUser() user: User,
  ): Promise<Provider> {
    return this.documentProviderService.createProvider(
      provider,
      user.nationalId,
    )
  }

  @Put(':id')
  @Scopes(ApiScope.internal, AdminPortalScope.documentProvider)
  @ApiOkResponse({ type: Provider })
  async updateProvider(
    @Param('id') id: string,
    @Body() provider: UpdateProviderDto,
    @CurrentUser() user: User,
  ): Promise<Provider> {
    const { numberOfAffectedRows, updatedProvider } =
      await this.documentProviderService.updateProvider(
        id,
        provider,
        user.nationalId,
      )

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`Provider ${id} does not exist.`)
    }

    this.auditService.audit({
      auth: user,
      namespace,
      action: 'updateProvider',
      resources: id,
      meta: { fields: Object.keys(provider) },
    })
    return updatedProvider
  }
}
