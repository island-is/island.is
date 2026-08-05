import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { Audit } from '@island.is/nest/audit'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import {
  BadRequestException,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { FormSystemHomeByNationalId } from '../../models/nationalRegistryHome.model'
import { FormSystemNameByNationalId } from '../../models/nationalRegistryName.model'
import { FormSystemPersonByNationalId } from '../../models/nationalRegistryPerson.model'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
@Audit({ namespace: '@island.is/api/form-system/national-registry' })
export class NationalRegistryResolver {
  constructor(private readonly service: NationalRegistryV3ClientService) {}

  @Audit()
  @Query(() => FormSystemNameByNationalId, {
    name: 'formSystemNameByNationalId',
    nullable: true,
  })
  async getName(
    @Args('input', { type: () => String }) input: string,
    @CurrentUser() user: User,
  ): Promise<FormSystemNameByNationalId | null> {
    const nationalId = this.getAuthorizedNationalId(input, user)

    return this.service.getName(nationalId)
  }

  @Audit()
  @Query(() => FormSystemHomeByNationalId, {
    name: 'formSystemHomeByNationalId',
    nullable: true,
  })
  async getAddress(
    @Args('input', { type: () => String }) input: string,
    @CurrentUser() user: User,
  ): Promise<FormSystemHomeByNationalId | null> {
    const nationalId = this.getAuthorizedNationalId(input, user)

    return this.service.getHousing(nationalId)
  }

  @Audit()
  @Query(() => FormSystemPersonByNationalId, {
    name: 'formSystemPersonByNationalId',
    nullable: true,
  })
  async getPerson(
    @Args('input', { type: () => String }) input: string,
    @CurrentUser() user: User,
  ): Promise<FormSystemPersonByNationalId | null> {
    const nationalId = this.getAuthorizedNationalId(input, user)
    const person = await this.service.getAllDataIndividual(nationalId)

    if (!person?.kennitala) {
      return null
    }

    const fullName = person.fulltNafn?.fulltNafn ?? person.nafn ?? null
    const address = person.heimilisfang

    return {
      nationalId: person.kennitala,
      fullName,
      name: fullName
        ? {
            firstName: person.fulltNafn?.eiginNafn ?? null,
            middleName: person.fulltNafn?.milliNafn ?? null,
            lastName: person.fulltNafn?.kenniNafn ?? null,
            fullName,
            displayName: person.nafn ?? fullName,
          }
        : null,
      address: address
        ? {
            streetAddress: address.husHeiti ?? null,
            apartment: address.ibud ?? null,
            postalCode: address.postnumer ?? null,
            city: address.poststod ?? null,
            municipalityText: address.sveitarfelag ?? null,
          }
        : null,
    }
  }

  private getAuthorizedNationalId(input: string, user: User): string {
    const nationalId = this.normalizeNationalId(input)

    this.assertValidNationalId(nationalId)
    this.assertCanQueryNationalId(user, nationalId)

    return nationalId
  }

  private normalizeNationalId(input: string): string {
    return input.replace(/\D/g, '')
  }

  private assertValidNationalId(nationalId: string): void {
    if (!this.isValidNationalId(nationalId)) {
      throw new BadRequestException('Invalid national id format')
    }
  }

  private assertCanQueryNationalId(user: User, nationalId: string): void {
    const actorNationalId = this.normalizeNationalId(user?.nationalId ?? '')

    if (!actorNationalId || actorNationalId !== nationalId) {
      throw new ForbiddenException('Not authorized to query this national id')
    }
  }

  private isValidNationalId(nationalId: string): boolean {
    return /^\d{10}$/.test(nationalId)
  }
}
