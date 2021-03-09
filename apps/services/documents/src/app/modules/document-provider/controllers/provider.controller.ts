import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'
import { DocumentProviderService } from '../document-provider.service'
import { CreateProviderDto } from '../dto/createProvider.dto'
import { UpdateProviderDto } from '../dto/updateProvider.dto'
import { Provider } from '../models/provider.model'
import { NationalId } from '../utils/nationalId.decorator'

@ApiTags('providers')
@ApiHeader({
  name: 'authorization',
  description: 'Bearer token authorization',
})
@Controller('providers')
export class ProviderController {
  constructor(
    private readonly documentProviderService: DocumentProviderService,
  ) {}

  @Get()
  @ApiOkResponse({ type: [Provider] })
  async getAllProviders(): Promise<Provider[] | null> {
    return await this.documentProviderService.getProviders()
  }

  @Get(':id')
  @ApiOkResponse({ type: Provider })
  async findById(@Param('id') id: string): Promise<Provider> {
    const provider = await this.documentProviderService.findProviderById(id)

    if (!provider) {
      throw new NotFoundException(`A provider with id ${id} does not exist`)
    }

    return provider
  }

  @Get('/external/:id')
  @ApiOkResponse({ type: Provider })
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

  @Post()
  @ApiCreatedResponse({ type: Provider })
  async createProvider(
    @Body() provider: CreateProviderDto,
    @NationalId() nationalId: string,
  ): Promise<Provider> {
    return await this.documentProviderService.createProvider(
      provider,
      nationalId,
    )
  }

  @Put(':id')
  @ApiOkResponse({ type: Provider })
  async updateProvider(
    @Param('id') id: string,
    @Body() provider: UpdateProviderDto,
    @NationalId() nationalId: string,
  ): Promise<Provider> {
    const {
      numberOfAffectedRows,
      updatedProvider,
    } = await this.documentProviderService.updateProvider(
      id,
      provider,
      nationalId,
    )

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`Provider ${id} does not exist.`)
    }

    return updatedProvider
  }
}
