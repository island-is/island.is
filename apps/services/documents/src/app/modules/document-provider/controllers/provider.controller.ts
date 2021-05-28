import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { DocumentProviderScope } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'
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
import { environment } from '../../../../environments'
import { DocumentProviderService } from '../document-provider.service'
import { CreateProviderDto } from '../dto/createProvider.dto'
import { UpdateProviderDto } from '../dto/updateProvider.dto'
import { Provider } from '../models/provider.model'

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

  @Scopes(DocumentProviderScope.read)
  @Get()
  @ApiOkResponse({ type: [Provider] })
  @Audit<Provider[]>({
    resources: (providers) => providers.map((provider) => provider.id),
  })
  async getAllProviders(): Promise<Provider[]> {
    return this.documentProviderService.getProviders()
  }

  @Scopes(DocumentProviderScope.read)
  @Get(':id')
  @ApiOkResponse({ type: Provider })
  @Audit<Provider>({
    resources: (provider) => provider?.id,
  })
  async findById(@Param('id') id: string): Promise<Provider> {
    const provider = await this.documentProviderService.findProviderById(id)

    if (!provider) {
      throw new NotFoundException(`A provider with id ${id} does not exist`)
    }

    return provider
  }

  @Scopes(DocumentProviderScope.read)
  @Get('/external/:id')
  @ApiOkResponse({ type: Provider })
  @Audit<Provider>({
    resources: (provider) => provider?.id,
  })
  async findByExternalId(@Param('id') id: string): Promise<Provider> {
    const provider = await this.documentProviderService.findProviderByExternalProviderId(
      id,
    )

    if (!provider) {
      throw new NotFoundException(
        `A provider with externalProviderId ${id} does not exist`,
      )
    }

    return provider
  }

  @Scopes(DocumentProviderScope.write)
  @Post()
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

  @Scopes(DocumentProviderScope.write)
  @Put(':id')
  @ApiOkResponse({ type: Provider })
  async updateProvider(
    @Param('id') id: string,
    @Body() provider: UpdateProviderDto,
    @CurrentUser() user: User,
  ): Promise<Provider> {
    const {
      numberOfAffectedRows,
      updatedProvider,
    } = await this.documentProviderService.updateProvider(
      id,
      provider,
      user.nationalId,
    )

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`Provider ${id} does not exist.`)
    }

    this.auditService.audit({
      user,
      namespace,
      action: 'updateProvider',
      resources: id,
      meta: { fields: Object.keys(provider) },
    })
    return updatedProvider
  }
}
