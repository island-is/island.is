import { CurrentUser, Scopes } from '@island.is/auth-nest-tools'
import { Body, Controller, Get, NotFoundException, Post } from '@nestjs/common'
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOAuth2,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'
import { GenericScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { CreateDto } from './dto/create.dto'
import { PartyLetterRegistry } from './partyLetterRegistry.model'
import { PartyLetterRegistryService } from './partyLetterRegistry.service'
import { environment } from '../../../environments'
import type { User } from '@island.is/auth-nest-tools'

@Audit<PartyLetterRegistry>({
  namespace: `${environment.audit.defaultNamespace}/party-letter-registry`,
})
@Controller('party-letter-registry')
@ApiOAuth2([])
@ApiTags('partyLetterRegistry')
export class PartyLetterRegistryController {
  constructor(
    private readonly partyLetterRegistryService: PartyLetterRegistryService,
  ) {}

  @ApiOkResponse({
    description: 'Finds party letter by manager given users authentication',
    type: PartyLetterRegistry,
  })
  @Audit<PartyLetterRegistry>({
    resources: (voterRegistry) => voterRegistry.partyLetter,
  })
  @Scopes(GenericScope.internal)
  @Get('manager')
  async findAsManagerByAuth(
    @CurrentUser() user: User,
  ): Promise<PartyLetterRegistry> {
    const resource = await this.partyLetterRegistryService.findByManager(
      user.nationalId,
    )

    if (!resource) {
      throw new NotFoundException("This resource doesn't exist")
    }

    return resource
  }

  @ApiCreatedResponse({
    description: 'Creates a new party letter entry',
    type: PartyLetterRegistry,
  })
  @ApiBody({
    type: CreateDto,
  })
  @Audit<PartyLetterRegistry>({
    resources: (voterRegistry) => voterRegistry.partyLetter,
    meta: (voterRegistry) => ({ owner: voterRegistry.owner }),
  })
  @Scopes(GenericScope.internal)
  @Post()
  async create(@Body() input: CreateDto): Promise<PartyLetterRegistry> {
    return await this.partyLetterRegistryService.create(input)
  }
}
