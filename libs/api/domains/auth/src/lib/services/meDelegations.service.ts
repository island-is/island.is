import { Injectable } from '@nestjs/common'
import { DelegationDTO, MeDelegationsServiceI } from './types'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { User } from '@island.is/auth-nest-tools'
import { MeDelegationsServiceV1 } from '../services-v1/meDelegations.service'
import {
  CreateDelegationInput,
  DelegationInput,
  DelegationsInput,
  DeleteDelegationInput,
  PatchDelegationInput,
  UpdateDelegationInput,
} from '../dto'
import { DelegationByOtherUserInput } from '../dto/delegationByOtherUser.input'

@Injectable()
export class MeDelegationsService implements MeDelegationsServiceI {
  constructor(
    private meDelegationsServiceV1: MeDelegationsServiceV1,
    private featureFlagService: FeatureFlagService,
  ) {}

  private async service(user: User): Promise<MeDelegationsServiceI> {
    const newDelegations = await this.featureFlagService.getValue(
      Features.outgoingDelegationsV2,
      false,
      user,
    )
    // TODO: Implement MeDelegationsServiceV2.
    return newDelegations
      ? this.meDelegationsServiceV1
      : this.meDelegationsServiceV1
  }

  createOrUpdateDelegation(
    user: User,
    input: CreateDelegationInput,
  ): Promise<DelegationDTO> {
    return this.service(user).then((service) =>
      service.createOrUpdateDelegation(user, input),
    )
  }

  getDelegations(
    user: User,
    input: DelegationsInput,
  ): Promise<DelegationDTO[]> {
    return this.service(user).then((service) =>
      service.getDelegations(user, input),
    )
  }

  getDelegationById(
    user: User,
    input: DelegationInput,
  ): Promise<DelegationDTO | null> {
    return this.service(user).then((service) =>
      service.getDelegationById(user, input),
    )
  }

  deleteDelegation(user: User, input: DeleteDelegationInput): Promise<boolean> {
    return this.service(user).then((service) =>
      service.deleteDelegation(user, input),
    )
  }

  patchDelegation(
    user: User,
    input: PatchDelegationInput,
  ): Promise<DelegationDTO> {
    return this.service(user).then((service) =>
      service.patchDelegation(user, input),
    )
  }

  updateDelegation(
    user: User,
    input: UpdateDelegationInput,
  ): Promise<DelegationDTO> {
    return this.service(user).then((service) =>
      service.updateDelegation(user, input),
    )
  }

  getDelegationByOtherUser(
    user: User,
    input: DelegationByOtherUserInput,
  ): Promise<DelegationDTO | null> {
    return this.service(user).then((service) =>
      service.getDelegationByOtherUser(user, input),
    )
  }
}
