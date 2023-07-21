import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { NationalRegistryApi } from '@island.is/clients/national-registry-v1'
import { Inject, ForbiddenException } from '@nestjs/common'
import { FamilyCorrectionInput } from '../../dto/FamilyCorrectionInput.input'
import { NationalRegistryAddress } from '../../models/nationalRegistryAddress.model'
import { NationalRegistryBirthplace } from '../../models/nationalRegistryBirthplace.model'
import { NationalRegistryCitizenship } from '../../models/nationalRegistryCitizenship.model'
import { NationalRegistryCustodian } from '../../models/nationalRegistryCustodian.model'
import { NationalRegistryFamilyCorrectionResponse } from '../../models/nationalRegistryFamilyCorrection.model'
import { NationalRegistryName } from '../../models/nationalRegistryName.model'
import {
  NationalRegistryPerson,
  NationalRegistryPersonDiscriminated,
} from '../../models/nationalRegistryPerson.model'
import { NationalRegistryReligion } from '../../models/nationalRegistryReligion.model'
import { NationalRegistrySpouse } from '../../models/nationalRegistrySpouse.model'
import { ExcludesFalse } from '../../utils'
import { User } from '@island.is/auth-nest-tools'
import some from 'lodash/some'
import { NationalRegistryFamilyMember } from '../../models/nationalRegistryFamilyMember.model'
import {
  formatAddress,
  formatCustodian,
  formatSpouse,
  formatCitizenship,
  formatBirthplace,
  formatName,
  formatReligion,
  formatPerson,
  formatPersonDiscriminated,
} from './mapper'
import { NationalRegistryChildGuardianship } from '../../models/nationalRegistryChildGuardianship.model'
import { child } from 'winston'
import { NationalRegistryResidence } from '../../models/nationalRegistryResidence.model'

export class NationalRegistryV3Service {
  constructor(
    private nationalRegistryV3: NationalRegistryV3ClientService,
    private nationalRegistrySoffia: NationalRegistryApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async postUserCorrection(
    input: FamilyCorrectionInput,
    nationalId: User['nationalId'],
  ): Promise<NationalRegistryFamilyCorrectionResponse> {
    const userChildren = await this.nationalRegistrySoffia.getMyChildren(
      nationalId,
    )
    const isAllowed = some(userChildren, ['Barn', input.nationalIdChild])

    /**
     * Only show data if child SSN is part of user's family.
     */
    if (!isAllowed) {
      throw new ForbiddenException('Child not found')
    }

    const user = await this.getNationalRegistryPerson(nationalId)

    if (!user?.fullName) {
      throw new ForbiddenException('Name missing')
    }

    const correctionInput = {
      ...input,
      name: user.fullName,
      nationalId: nationalId,
    }

    const userCorrectionResponse = await this.nationalRegistrySoffia.postUserCorrection(
      correctionInput,
    )

    return userCorrectionResponse
  }

  async getNationalRegistryPerson(
    nationalId: string,
  ): Promise<NationalRegistryPersonDiscriminated | null> {
    const user = await this.nationalRegistryV3.getAllDataIndividual(nationalId)

    if (!user?.kennitala) {
      return null
    }

    return formatPersonDiscriminated(user)
  }

  async getAddress(
    nationalId: string,
  ): Promise<NationalRegistryAddress | null> {
    const address = await this.nationalRegistryV3.getAddress(nationalId)

    return address && formatAddress(address)
  }

  async getParents(
    nationalId: string,
  ): Promise<Array<NationalRegistryPerson> | null> {
    const data = await this.nationalRegistryV3.getAllDataIndividual(nationalId)

    if (!data?.logforeldrar?.logForeldrar) {
      return null
    }

    const parentData: Array<NationalRegistryPerson | null> =
      (await Promise.all(
        data.logforeldrar?.logForeldrar
          .map(async (parent) => {
            if (!parent.logForeldriKennitala || !parent.logForeldriNafn) {
              return null
            }
            const personData = await this.nationalRegistryV3.getAllDataIndividual(
              parent.logForeldriKennitala,
            )
            return formatPerson(personData)
          })
          .filter((Boolean as unknown) as ExcludesFalse),
      )) ?? []

    return parentData.filter(
      (parent): parent is NationalRegistryPerson => parent != null,
    )
  }

  async getCustodians(
    nationalId: string,
  ): Promise<Array<NationalRegistryPerson> | null> {
    const data = await this.nationalRegistryV3.getCustodians(nationalId)

    if (!data) {
      return null
    }

    const custodians = await Promise.all(
      data.map((custodian) => {
        if (!custodian.forsjaAdiliKennitala) {
          return null
        }
        return this.nationalRegistryV3.getAllDataIndividual(
          custodian.forsjaAdiliKennitala,
        )
      }) ?? null,
    )

    const persons = custodians
      .map((p) => formatPerson(p))
      .filter((Boolean as unknown) as ExcludesFalse)

    return persons
  }

  async getChildGuardianship(
    user: User,
    childNationalId: string,
  ): Promise<NationalRegistryChildGuardianship | null> {
    const childData = await this.nationalRegistryV3.getAllDataIndividual(
      childNationalId,
    )
    const isChildOfUser = childData?.forsja?.forsjaradilar?.some(
      (custodianId) => custodianId === user.nationalId,
    )

    if (!isChildOfUser) {
      return null
    }

    const legalDomicileParent =
      childData?.logheimilistengsl?.logheimilismedlimir?.find(
        (inhabitant) => inhabitant.kennitala === user.nationalId,
      )?.nafn ?? null

    return {
      childNationalId,
      legalDomicileParent: legalDomicileParent ? [legalDomicileParent] : null,
    }
  }

  async getSpouse(nationalId: string): Promise<NationalRegistrySpouse | null> {
    const data = await this.nationalRegistryV3.getSpouse(nationalId)

    return data && formatSpouse(data)
  }

  async getCitizenship(
    nationalId: string,
  ): Promise<NationalRegistryCitizenship | null> {
    const data = await this.nationalRegistryV3.getCitizenship(nationalId)

    return data && formatCitizenship(data)
  }

  async getChildrenCustodyInformation(
    parentUser: User,
  ): Promise<Array<NationalRegistryPerson> | null> {
    const parentData = await this.nationalRegistryV3.getAllDataIndividual(
      parentUser.nationalId,
    )

    if (!parentData) {
      return null
    }

    const children = parentData.forsja?.born?.length
      ? parentData.forsja.born
      : []

    const childDetails: Array<NationalRegistryPerson | null> = await Promise.all(
      children.map(async (child) => {
        if (!child.barnKennitala || !child.barnNafn) {
          return null
        }

        const childDetails = await this.nationalRegistryV3.getAllDataIndividual(
          child.barnKennitala,
        )

        if (!childDetails) {
          return null
        }

        const otherParents =
          childDetails.forsja?.forsjaradilar?.filter(
            (f) => f.forsjaAdiliKennitala !== parentUser.nationalId,
          ) ?? []

        const otherParentsDetails = await Promise.all(
          otherParents.map(async (p) => {
            if (!p.forsjaAdiliKennitala) {
              return null
            }
            return await this.nationalRegistryV3.getAllDataIndividual(
              p.forsjaAdiliKennitala,
            )
          }),
        )

        const livesWithApplicant = childDetails.logheimilistengsl?.logheimilismedlimir
          ?.map((l) => l.kennitala)
          .includes(parentData.kennitala)

        return {
          ...formatPerson(childDetails),
          nationalId: child.barnKennitala,
          fullName: child.barnNafn,
          livesWithApplicant,
          livesWithBothParents:
            livesWithApplicant &&
            otherParentsDetails.every(
              (o) =>
                o?.logheimilistengsl?.logheimilistengsl ===
                childDetails.logheimilistengsl?.logheimilistengsl,
            ),
          otherParent:
            otherParentsDetails.length && otherParentsDetails[0]
              ? formatPerson(otherParentsDetails[0])
              : null,
        }
      }),
    )

    return childDetails.filter(
      (child): child is NationalRegistryPerson => child != null,
    )
  }

  async getFamily(
    nationalId: string,
  ): Promise<Array<NationalRegistryFamilyMember> | null> {
    //const data = await this.nationalRegistryV3.getBirthplace(nationalId)
    //return data && formatBirthplace(data)
    return null
  }

  async getBirthplace(
    nationalId: string,
  ): Promise<NationalRegistryBirthplace | null> {
    const data = await this.nationalRegistryV3.getBirthplace(nationalId)
    return data && formatBirthplace(data)
  }

  async getName(nationalId: string): Promise<NationalRegistryName | null> {
    const data = await this.nationalRegistryV3.getName(nationalId)

    return data && formatName(data)
  }

  async getReligion(
    nationalId: string,
  ): Promise<NationalRegistryReligion | null> {
    const data = await this.nationalRegistryV3.getReligion(nationalId)

    return data && formatReligion(data)
  }

  async getNationalRegistryResidenceHistory(
    nationalId: string,
  ): Promise<NationalRegistryResidence[] | null> {
    return null
  }
}
