import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Inject, UseGuards } from '@nestjs/common'
import { ApiScope } from '@island.is/auth/scopes'
import { Document } from '../models/toBeDeprecated/getDocuments'
import { Args, Directive, Query, Resolver } from '@nestjs/graphql'
import { Audit } from '@island.is/nest/audit'
import { DownloadServiceConfig } from '@island.is/nest/config'
import { FeatureFlagGuard } from '@island.is/nest/feature-flags'
import { ConfigType } from '@nestjs/config'
import { WorkMachinesService } from '../workMachines.service'
import { MachineDetails } from '../models/toBeDeprecated/machineDetails'
import { Model } from '../models/model.model'
import { Category } from '../models/category.model'
import { GetMachineParentCategoryByTypeAndModelInput } from '../dto/getMachineParentCategoryByTypeAndModel.input'
import { MachineType } from '../models/toBeDeprecated/machineType'
import { GetDocumentsInput } from '../dto/getDocuments.input'
import { FileType } from '../workMachines.types'
import { SubCategory } from '../models/subCategory.model'
import { TechInfoItem } from '../models/techInfoItem.model'

@Directive('@deprecated(reason: "Use something else")')
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/work-machines' })
export class DeprecatedResolver {
  constructor(
    private readonly workMachinesService: WorkMachinesService,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadServiceConfig: ConfigType<
      typeof DownloadServiceConfig
    >,
  ) {}

  @Scopes(ApiScope.vinnueftirlitid)
  @Query(() => MachineDetails, {
    deprecationReason: 'use workMachine model',
  })
  @Audit()
  async getWorkerMachineDetails(
    @CurrentUser() auth: User,
    @Args('id') id: string,
    @Args('rel') rel: string,
  ) {
    return this.workMachinesService.getMachineDetails(auth, id, rel)
  }

  @Scopes(ApiScope.vinnueftirlitid)
  @Query(() => Boolean, {
    deprecationReason: 'Property available in workMachine model',
  })
  @Audit()
  async getWorkerMachinePaymentRequired(
    @CurrentUser() auth: User,
    @Args('regNumber') regNumber: string,
  ) {
    return this.workMachinesService.isPaymentRequired(auth, regNumber)
  }

  @Scopes(ApiScope.vinnueftirlitid)
  @Query(() => MachineDetails, {
    deprecationReason:
      'TO BE REMOVED. Pass in registrationnumber to "workMachine" resolver function instead',
  })
  @Audit()
  async getWorkerMachineByRegno(
    @CurrentUser() auth: User,
    @Args('regno') regno: string,
    @Args('rel') rel: string,
  ) {
    return this.workMachinesService.getMachineByRegno(auth, regno, rel)
  }

  @Scopes(ApiScope.vinnueftirlitid)
  @Query(() => [Model], { deprecationReason: 'TO BE REMOVED' })
  @Audit()
  async getMachineModels(
    @CurrentUser() auth: User,
    @Args('type') type: string,
  ) {
    return this.workMachinesService.getMachineModels(auth, type)
  }

  @Scopes(ApiScope.vinnueftirlitid)
  @Query(() => [Category], { deprecationReason: 'TO BE REMOVED' })
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
  @Query(() => [SubCategory], { deprecationReason: 'TO BE REMOVED' })
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
  @Query(() => [TechInfoItem], { deprecationReason: 'TO BE REMOVED' })
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
  @Query(() => MachineType, {
    deprecationReason: 'Use workMachine with registrationNumber input',
  })
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

  @Directive('@deprecated(reason: "Will be removed shortly")')
  @Scopes(ApiScope.workMachines)
  @Query(() => Document, {
    name: 'workMachinesCollectionDocument',
    nullable: true,
    deprecationReason:
      'Use the field resolver on the paginated collection type instead',
  })
  @Audit()
  async getWorkMachinesCollectionDocument(
    @Args('input', {
      type: () => GetDocumentsInput,
      nullable: true,
    })
    input?: GetDocumentsInput,
  ) {
    const downloadServiceURL = `${
      this.downloadServiceConfig.baseUrl
    }/download/v1/workMachines/export/${input?.fileType ?? FileType.EXCEL}`

    return {
      downloadUrl: downloadServiceURL,
    }
  }
}
