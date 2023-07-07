import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Inject, UseGuards } from '@nestjs/common'
import { ApiScope } from '@island.is/auth/scopes'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { Audit } from '@island.is/nest/audit'
import {
  PaginatedCollectionResponse,
  WorkMachine,
} from './models/getWorkMachines'
import { WorkMachinesService } from './workMachines.service'
import { GetWorkMachineInput } from './dto/getWorkMachine.input'
import { GetWorkMachineCollectionInput } from './dto/getWorkMachineCollection.input'
import { GetDocumentsInput } from './dto/getDocuments.input'
import { Document } from './models/getDocuments'
import { DownloadServiceConfig } from '@island.is/nest/config'
import type { ConfigType } from '@island.is/nest/config'
import { FileType } from './workMachines.types'
import {
  FeatureFlagGuard,
  FeatureFlag,
  Features,
} from '@island.is/nest/feature-flags'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.servicePortalWorkMachinesModule)
@Resolver()
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

  @Scopes(ApiScope.workMachines)
  @Query(() => Document, {
    name: 'workMachinesCollectionDocument',
    nullable: true,
  })
  @Audit()
  async getWorkMachinesCollectionDocument(
    @Args('input', {
      type: () => GetDocumentsInput,
      nullable: true,
    })
    input: GetDocumentsInput,
  ) {
    const downloadServiceURL = `${
      this.downloadServiceConfig.baseUrl
    }/download/v1/workMachines/export/${input.fileType ?? FileType.EXCEL}`

    return {
      downloadUrl: downloadServiceURL,
    }
  }

  @Scopes(ApiScope.workMachines)
  @Query(() => WorkMachine, { name: 'workMachine', nullable: true })
  @Audit()
  async getWorkMachineById(
    @CurrentUser() user: User,
    @Args('input', { type: () => GetWorkMachineInput })
    input: GetWorkMachineInput,
  ) {
    return this.workMachinesService.getWorkMachineById(user, input)
  }
}
