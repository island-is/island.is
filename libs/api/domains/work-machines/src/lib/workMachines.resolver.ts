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
import { MachineDetails } from './models/machineDetails'
import { Model } from './models/model'
import { GetMachineParentCategoryByTypeAndModelInput } from './dto/getMachineParentCategoryByTypeAndModel.input'
import { Category } from './models/category'
import { SubCategory } from './models/subCategory'
import { TechInfoItem } from './models/techInfoItem'
import { MachineType } from './models/machineType'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
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
    if (!isUuid(input.id)) {
      return null
    }
    return this.workMachinesService.getWorkMachineById(user, input)
  }

  @Scopes(ApiScope.vinnueftirlitid)
  @Query(() => MachineDetails)
  @Audit()
  async getWorkerMachineDetails(
    @CurrentUser() auth: User,
    @Args('id') id: string,
    @Args('rel') rel: string,
  ) {
    return this.workMachinesService.getMachineDetails(auth, id, rel)
  }

  @Scopes(ApiScope.vinnueftirlitid)
  @Query(() => Boolean)
  @Audit()
  async getWorkerMachinePaymentRequired(
    @CurrentUser() auth: User,
    @Args('regNumber') regNumber: string,
  ) {
    return this.workMachinesService.isPaymentRequired(auth, regNumber)
  }

  @Scopes(ApiScope.vinnueftirlitid)
  @Query(() => MachineDetails)
  @Audit()
  async getWorkerMachineByRegno(
    @CurrentUser() auth: User,
    @Args('regno') regno: string,
    @Args('rel') rel: string,
  ) {
    return this.workMachinesService.getMachineByRegno(auth, regno, rel)
  }

  @Scopes(ApiScope.vinnueftirlitid)
  @Query(() => [Model])
  @Audit()
  async getMachineModels(
    @CurrentUser() auth: User,
    @Args('type') type: string,
  ) {
    return this.workMachinesService.getMachineModels(auth, type)
  }

  @Scopes(ApiScope.vinnueftirlitid)
  @Query(() => [Category])
  @Audit()
  async getMachineParentCategoryByTypeAndModel(
    @CurrentUser() auth: User,
    @Args('input') input: GetMachineParentCategoryByTypeAndModelInput,
  ) {
    return this.workMachinesService.getMachineParentCategoriesTypeModelGet(
      auth,
      input,
    )
  }

  @Scopes(ApiScope.vinnueftirlitid)
  @Query(() => [SubCategory])
  @Audit()
  async getMachineSubCategories(
    @CurrentUser() auth: User,
    @Args('parentCategory') parentCategory: string,
  ) {
    return this.workMachinesService.getMachineSubCategories(
      auth,
      parentCategory,
    )
  }

  @Scopes(ApiScope.vinnueftirlitid)
  @Query(() => [TechInfoItem])
  @Audit()
  async getTechnicalInfoInputs(
    @CurrentUser() auth: User,
    @Args('parentCategory') parentCategory: string,
    @Args('subCategory') subCategory: string,
  ) {
    return this.workMachinesService.getTechnicalInfoInputs(
      auth,
      parentCategory,
      subCategory,
    )
  }

  @Scopes(ApiScope.vinnueftirlitid)
  @Query(() => MachineType)
  @Audit()
  async getTypeByRegistrationNumber(
    @CurrentUser() auth: User,
    @Args('registrationNumber') registrationNumber: string,
    @Args('applicationId') applicationId: string,
  ) {
    return this.workMachinesService.getTypeByRegistrationNumber(
      auth,
      registrationNumber,
      applicationId,
    )
  }
}
