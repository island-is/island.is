import { CurrentUser, Scopes, User } from '@island.is/auth-nest-tools'
import { Controller, Get, Query } from '@nestjs/common'
import { ApiOAuth2, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { TemporaryVoterRegistry } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { VoterRegistry } from './voterRegistry.model'
import { VoterRegistryService } from './voterRegistry.service'
import { environment } from '../../../environments'
import { FindOneDto } from './dto/findOne.dto'

const auditNamespace = `${environment.audit.defaultNamespace}/voter-registry`
@Controller('voter-registry')
@ApiOAuth2([])
@ApiTags('temporaryVoterRegistry')
export class VoterRegistryController {
  constructor(private readonly voterRegistryService: VoterRegistryService) {}

  // we return a not registered entry when no entry is found in registry
  getEmptyRegistryResponse = (nationalId: string) =>
    ({
      id: '0',
      regionNumber: 0,
      regionName: 'Ekki á skrá',
      nationalId: nationalId,
    } as VoterRegistry)

  @ApiOkResponse({
    description: 'Finds voter registry entry given user authentication',
    type: VoterRegistry,
  })
  @Audit<VoterRegistry>({
    namespace: auditNamespace,
    action: 'findByAuth',
    resources: (voterRegistry) => voterRegistry.id,
  })
  @Scopes(TemporaryVoterRegistry.read)
  @Get()
  async findByAuth(
    @CurrentUser() { nationalId }: User,
  ): Promise<VoterRegistry> {
    const resource = await this.voterRegistryService.findByNationalId(
      nationalId,
    )

    return resource ?? this.getEmptyRegistryResponse(nationalId)
  }

  // TODO: This should get a system scope, or we should allow systems to get the read scope
  // TODO: Add tests for this once its design is finalized
  @ApiOkResponse({
    description: 'Finds voter registry entry given user authentication',
    type: VoterRegistry,
  })
  @Get('/system')
  async findByNationalId(
    @Query() { nationalId }: FindOneDto,
  ): Promise<VoterRegistry> {
    const resource = await this.voterRegistryService.findByNationalId(
      nationalId,
    )

    return resource ?? this.getEmptyRegistryResponse(nationalId)
  }
}
