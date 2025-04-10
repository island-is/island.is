import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { isUuid } from 'uuidv4'
import type { User } from '@island.is/auth-nest-tools'
import { Inject, UseGuards } from '@nestjs/common'
import { ApiScope } from '@island.is/auth/scopes'
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { Audit } from '@island.is/nest/audit'
import { DownloadServiceConfig } from '@island.is/nest/config'
import { FeatureFlagGuard } from '@island.is/nest/feature-flags'
import { ConfigType } from '@nestjs/config'
import { PaginatedCollectionResponse } from '../models/workMachinePaginatedCollection.model'
import { WorkMachinesService } from '../workMachines.service'
import { GetWorkMachineCollectionInput } from '../dto/getWorkMachineCollection.input'
import { FileType } from '../workMachines.types'
import { DownloadLink } from '../models/downloadLink.model'
import { mapFileTypeToLabel } from '../mapper'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Resolver(() => PaginatedCollectionResponse)
@Audit({ namespace: '@island.is/api/work-machines' })
export class WorkMachinesResolver {
  constructor(
    private readonly workMachinesService: WorkMachinesService,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadServiceConfig: ConfigType<
      typeof DownloadServiceConfig
    >,
  ) {}

  @Scopes(ApiScope.workMachines)
  @Query(() => PaginatedCollectionResponse, {
    name: 'workMachinesPaginatedCollection',
    nullable: true,
  })
  @Audit()
  async getWorkMachines(
    @CurrentUser() user: User,
    @Args('input', {
      type: () => GetWorkMachineCollectionInput,
      nullable: true,
    })
    input: GetWorkMachineCollectionInput,
  ) {
    return this.workMachinesService.getWorkMachines(user, input)
  }

  @ResolveField('downloadServiceLinks')
  @Scopes(ApiScope.workMachines)
  async getDownloadServiceLinks(
    @Parent() paginatedCollection: PaginatedCollectionResponse,
  ) {
    const possibleTypes = Object.keys(FileType)

    const downloadLinks: Array<DownloadLink> = Object.values(FileType).map(
      (fileType) => {
        return {
          href: `${
            this.downloadServiceConfig.baseUrl
          }/download/v1/workMachines/export/${fileType}`
          displayTitle: mapFileTypeToLabel(fileType),
        }
      },
    )

    const downloadServiceURL =

    return {
      downloadUrl: downloadServiceURL,
    }
  }
}
