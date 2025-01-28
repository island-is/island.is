import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'

import { Authorize, CurrentUser, Role, User } from '../auth'

import {
  CreateAccessControlInput,
  DeleteAccessControlInput,
  UpdateAccessControlInput,
} from './accessControl.input'
import { AccessControlModel } from './accessControl.model'
import { AccessControlService } from './accessControl.service'

@Authorize({
  roles: [
    Role.developer,
    Role.recyclingFund,
    Role.recyclingCompanyAdmin,
    Role.municipality,
  ],
})
@Resolver(() => AccessControlModel)
export class AccessControlResolver {
  constructor(private accessControlService: AccessControlService) {}

  private verifyDeveloperAccess(user: User, role: Role) {
    const isDeveloper = user.role === Role.developer
    if (!isDeveloper && role === Role.developer) {
      throw new ApolloError('Only developers can modify developer access')
    }
  }

  private verifyRecyclingCompanyInput(
    input: CreateAccessControlInput | UpdateAccessControlInput,
  ) {
    if (
      (input.role === Role.recyclingCompany ||
        input.role === Role.recyclingCompanyAdmin) &&
      !input.partnerId
    ) {
      throw new BadRequestException(
        `User is not recyclingCompany/recyclingCompanyAdmin or partnerId not found`,
      )
    }
  }

  private verifyRecyclingCompanyAdminInput(role: Role, user: User) {
    if (
      user.role === Role.recyclingCompanyAdmin &&
      !(role === Role.recyclingCompany || role === Role.recyclingCompanyAdmin)
    ) {
      throw new BadRequestException(
        `RecyclingCompanyAdmin does not have permission on ${role}`,
      )
    }
  }

  @Query(() => [AccessControlModel])
  async skilavottordAccessControls(
    @CurrentUser() user: User,
  ): Promise<AccessControlModel[]> {
    const isDeveloper = user.role === Role.developer

    if (user.role === Role.municipality) {
      try {
        return this.accessControlService.findByRecyclingPartner(user.partnerId)
      } catch (error) {
        throw new ApolloError(
          'Failed to fetch municipality access controls',
          'MUNICIPALITY_ACCESS_ERROR',
        )
      }
    }

    return this.accessControlService.findAll(isDeveloper)
  }

  @Query(() => [AccessControlModel])
  async skilavottordAccessControlsByRecyclingPartner(
    @CurrentUser() user: User,
    // @Args('recyclingPartnerId') recyclingPartnerId: string,
  ): Promise<AccessControlModel[]> {
    //recyclingPartnerId = user.partnerId ath
    return this.accessControlService.findByRecyclingPartner(user.partnerId)
  }

  @Mutation(() => AccessControlModel)
  async createSkilavottordAccessControl(
    @Args('input', { type: () => CreateAccessControlInput })
    input: CreateAccessControlInput,
    @CurrentUser() user: User,
  ): Promise<AccessControlModel> {
    this.verifyDeveloperAccess(user, input.role)
    this.verifyRecyclingCompanyAdminInput(input.role, user)
    this.verifyRecyclingCompanyInput(input)

    const access = await this.accessControlService.findOne(input.nationalId)

    if (access) {
      throw new ConflictException(
        `Access with the national id ${input.nationalId} already exists`,
      )
    }

    return this.accessControlService.createAccess(input)
  }

  @Mutation(() => AccessControlModel)
  async updateSkilavottordAccessControl(
    @Args('input', { type: () => UpdateAccessControlInput })
    input: UpdateAccessControlInput,
    @CurrentUser() user: User,
  ): Promise<AccessControlModel> {
    this.verifyDeveloperAccess(user, input.role)
    this.verifyRecyclingCompanyAdminInput(input.role, user)
    this.verifyRecyclingCompanyInput(input)
    return this.accessControlService.updateAccess(input)
  }

  @Mutation(() => Boolean)
  async deleteSkilavottordAccessControl(
    @Args('input', { type: () => DeleteAccessControlInput })
    input: DeleteAccessControlInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    const accessControl = await this.accessControlService.findOne(
      input.nationalId,
    )
    this.verifyDeveloperAccess(user, accessControl.role)
    this.verifyRecyclingCompanyAdminInput(accessControl.role, user)
    if (!accessControl) {
      throw new NotFoundException('AccessControl not found')
    }
    return this.accessControlService.deleteAccess(input)
  }
}
