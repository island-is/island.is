import { Args, Query, Resolver } from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import { UseGuards } from '@nestjs/common'
import {
  CurrentUser,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { TransportAuthorityApi } from '../transportAuthority.service'
import { CheckTachoNetInput, OwnerChangeAnswers } from './dto'
import {
  InsuranceCompany,
  AnonymityStatus,
  QualityPhotoAndSignature,
  CheckTachoNetExists,
  NewestDriversCard,
  DeliveryStation,
  OwnerChangeValidation,
} from './models'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MainResolver {
  constructor(private readonly transportAuthorityApi: TransportAuthorityApi) {}

  @Query(() => OwnerChangeValidation, { nullable: true })
  vehicleOwnerChangeValidation(
    @CurrentUser() user: User,
    @Args('answers') answers: OwnerChangeAnswers,
  ) {
    return this.transportAuthorityApi.validateApplicationForOwnerChange(
      user,
      answers,
    )
  }

  @Query(() => [InsuranceCompany])
  transportAuthorityInsuranceCompanies() {
    return this.transportAuthorityApi.getInsuranceCompanies()
  }

  @Query(() => AnonymityStatus)
  vehicleRegistryAnonymityStatus(@CurrentUser() user: User) {
    return {
      isChecked: this.transportAuthorityApi.getAnonymityStatus(user),
    }
  }

  @Query(() => CheckTachoNetExists)
  digitalTachographTachoNetExists(
    @CurrentUser() user: User,
    @Args('input') input: CheckTachoNetInput,
  ) {
    return this.transportAuthorityApi.checkTachoNet(user, input)
  }

  @Query(() => NewestDriversCard, { nullable: true })
  digitalTachographNewestDriversCard(@CurrentUser() user: User) {
    return this.transportAuthorityApi.getNewestDriversCard(user)
  }

  @Query(() => QualityPhotoAndSignature)
  digitalTachographQualityPhotoAndSignature(@CurrentUser() user: User) {
    return this.transportAuthorityApi.getPhotoAndSignature(user)
  }

  @Query(() => [DeliveryStation])
  vehicleLicensePlateDeliveryStations(@CurrentUser() user: User) {
    return this.transportAuthorityApi.getDeliveryStations(user)
  }
}
