import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { NationalRegistryApi } from '@island.is/clients/national-registry-v1'
import { Inject, ForbiddenException } from '@nestjs/common'
import { FamilyCorrectionInput } from '../../dto/FamilyCorrectionInput.input'
import { NationalRegistryAddress } from '../../models/nationalRegistryAddress.model'
import { NationalRegistryBirthplace } from '../../models/nationalRegistryBirthplace.model'
import { NationalRegistryCitizenship } from '../../models/nationalRegistryCitizenship.model'
import { NationalRegistryFamilyCorrectionResponse } from '../../models/nationalRegistryFamilyCorrection.model'
import { NationalRegistryName } from '../../models/nationalRegistryName.model'
import { PersonV3 } from '../../models/nationalRegistryPerson.model'
import { NationalRegistryReligion } from '../../models/nationalRegistryReligion.model'
import { NationalRegistrySpouse } from '../../models/nationalRegistrySpouse.model'
import { ExcludesFalse } from '../../utils'
import { User } from '@island.is/auth-nest-tools'
import some from 'lodash/some'
import { NationalRegistryFamilyMember } from '../../models/nationalRegistryFamilyMember.model'
import {
  formatAddress,
  formatSpouse,
  formatCitizenship,
  formatBirthplace,
  formatName,
  formatReligion,
  formatPerson,
  formatPersonDiscriminated,
  formatLivingArrangements,
  formatBirthParent,
  formatCustodian,
} from './mapper'
import { NationalRegistryLivingArrangements } from '../../models/nationalRegistryLivingArrangements.model'
import { NationalRegistryBasePerson } from '../../models/nationalRegistryBasePerson.model'
import { NationalRegistryCustodian } from '../../models/nationalRegistryCustodian.model'
import { NationalRegistryChild } from '../../models/nationalRegistryChild.model'

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
  ): Promise<PersonV3 | null> {
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
  ): Promise<Array<NationalRegistryBasePerson> | null> {
    const data = await this.nationalRegistryV3.getAllDataIndividual(nationalId)

    if (!data?.logforeldrar?.logForeldrar) {
      return null
    }

    return data.logforeldrar.logForeldrar
      .map((l) => {
        if (!l.logForeldriKennitala || !l.logForeldriNafn) {
          return null
        }
        return {
          nationalId: l.logForeldriKennitala,
          fullName: l.logForeldriNafn,
        }
      })
      .filter((Boolean as unknown) as ExcludesFalse)
  }

  async getCustodians(
    nationalId: string,
  ): Promise<Array<NationalRegistryCustodian> | null> {
    const data = await this.nationalRegistryV3.getAllDataIndividual(nationalId)

    if (!data) {
      return null
    }

    const custodians = data.forsja?.forsjaradilar
      ?.map((custodian) => {
        if (!custodian.forsjaAdiliNafn || !custodian.forsjaAdiliKennitala) {
          return null
        }
        return {
          fullName: custodian.forsjaAdiliNafn,
          nationalId: custodian.forsjaAdiliKennitala,
          code: custodian.forsjaKodi ?? null,
          text: custodian.forsjaTexti ?? null,
          livesWithChild:
            data.logheimilistengsl?.logheimilismedlimir?.some(
              (l) => l.kennitala === custodian.forsjaAdiliKennitala,
            ) ?? null,
        } as NationalRegistryCustodian
      })
      .filter((Boolean as unknown) as ExcludesFalse)

    return custodians ?? null
  }

  /*
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
´*/
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
  ): Promise<Array<NationalRegistryChild> | null> {
    const parentData = await this.nationalRegistryV3.getAllDataIndividual(
      parentUser.nationalId,
    )

    if (!parentData) {
      return null
    }

    const children = parentData.forsja?.born?.length
      ? parentData.forsja.born
      : []

    const childDetails: Array<NationalRegistryChild | null> = await Promise.all(
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

        return {
          ...formatPerson(childDetails),
          nationalId: child.barnKennitala,
          fullName: child.barnNafn,
          custodians: childDetails.forsja?.forsjaradilar
            ?.map((f) => formatCustodian(f, childDetails.logheimilistengsl))
            .filter((Boolean as unknown) as ExcludesFalse),
          birthParents: childDetails.logforeldrar?.logForeldrar
            ?.map((p) => formatBirthParent(p))
            .filter((Boolean as unknown) as ExcludesFalse),
        }
      }),
    )

    return childDetails.filter(
      (child): child is NationalRegistryChild => child != null,
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

  async getNationalRegistryLivingArrangements(
    nationalId: string,
  ): Promise<NationalRegistryLivingArrangements | null> {
    const response = await Promise.all([
      this.nationalRegistryV3.getResidence(nationalId),
      this.nationalRegistryV3.getDomicile(nationalId),
    ])

    return response && formatLivingArrangements(...response)
  }
}
