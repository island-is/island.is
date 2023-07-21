import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { NationalRegistryApi } from '@island.is/clients/national-registry-v1'
import { Inject, ForbiddenException } from '@nestjs/common'
import { FamilyCorrectionInput } from '../../dto/FamilyCorrectionInput.input'
import {
  NationalRegistryAddress,
  formatAddress,
} from '../../models/nationalRegistryAddress.model'
import {
  NationalRegistryBirthplace,
  formatBirthplace,
} from '../../models/nationalRegistryBirthplace.model'
import {
  NationalRegistryCitizenship,
  formatCitizenship,
} from '../../models/nationalRegistryCitizenship.model'
import {
  NationalRegistryCustodian,
  formatCustodian,
} from '../../models/nationalRegistryCustodian.model'
import { NationalRegistryFamilyCorrectionResponse } from '../../models/nationalRegistryFamilyCorrection.model'
import {
  NationalRegistryName,
  formatName,
} from '../../models/nationalRegistryName.model'
import {
  NationalRegistryPerson,
  NationalRegistryPersonDiscriminated,
  formatUser,
} from '../../models/nationalRegistryPerson.model'
import {
  NationalRegistryReligion,
  formatReligion,
} from '../../models/nationalRegistryReligion.model'
import {
  NationalRegistrySpouse,
  formatSpouse,
} from '../../models/nationalRegistrySpouse.model'
import { ExcludesFalse } from '../../utils'
import { User } from '@island.is/auth-nest-tools'
import some from 'lodash/some'
import { NationalRegistryFamilyMember } from '../../models/nationalRegistryFamilyMember.model'

export class NationalRegistryV3Service {
  constructor(
    private nationalRegistryApi: NationalRegistryV3ClientService,
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
    const user = await this.nationalRegistryApi.getAllDataIndividual(nationalId)

    if (!user?.kennitala) {
      return null
    }

    return formatUser(user)
  }

  async getAddress(
    nationalId: string,
  ): Promise<NationalRegistryAddress | null> {
    const address = await this.nationalRegistryApi.getAddress(nationalId)

    return address && formatAddress(address)
  }
  /*
  async getParents(nationalId: string): Promise<NationalRegistryArray<Person> | null> {
    const data = await this.fetchData(nationalId)

    if (!data.logforeldrar?.logForeldrar) {
      return null
    }

    const parentData: Array<Person | null> =
      (await Promise.all(
        data.logforeldrar?.logForeldrar
          .map(async (parent) => {
            if (!parent.logForeldriKennitala || !parent.logForeldriNafn) {
              return null
            }
            const personData = await this.fetchData(parent.logForeldriKennitala)
            return {
              ...this.extractPerson(personData),
              nationalId: parent.logForeldriKennitala,
              fullName: parent.logForeldriNafn,
            }
          })
          .filter((Boolean as unknown) as ExcludesFalse),
      )) ?? []

    return parentData.filter((parent): parent is Person => parent != null)
  }*/

  async getCustodians(
    nationalId: string,
  ): Promise<Array<NationalRegistryCustodian> | null> {
    const data = await this.nationalRegistryApi.getAllDataIndividual(nationalId)

    const custodians =
      data?.forsja?.forsjaradilar
        ?.map((custodian) => formatCustodian(custodian, data.logheimilistengsl))
        .filter((Boolean as unknown) as ExcludesFalse) ?? null

    return custodians
  }

  /*
  async getChildGuardianship(
    user: User,
    childNationalId: string,
  ): Promise<NationalRegistryChildGuardianship | null> {
    const data = await this.fetchData(user.nationalId)

    if (!data.forsja?.born) {
      return null
    }

    const childrenNationalIds = data.forsja.born.map((b) => b.barnKennitala)

    const isChildOfUser = childrenNationalIds.some(
      (childId) => childId === childNationalId,
    )

    if (!isChildOfUser) {
      return null
    }

    const childData = await this.fetchData(childNationalId)

    const legalDomicileParent = childData.logforeldrar
      ? childData.logforeldrar?.logForeldrar
          ?.map((l) => l.logForeldriKennitala)
          .filter((Boolean as unknown) as ExcludesFalse)
      : []

    return {
      childNationalId,
      legalDomicileParent,
    }
  }*/

  async getSpouse(nationalId: string): Promise<NationalRegistrySpouse | null> {
    const data = await this.nationalRegistryApi.getSpouse(nationalId)

    return data && formatSpouse(data)
  }

  async getCitizenship(
    nationalId: string,
  ): Promise<NationalRegistryCitizenship | null> {
    const data = await this.nationalRegistryApi.getCitizenship(nationalId)

    return data && formatCitizenship(data)
  }

  /*
  async getChildren(nationalId: string): Promise<NationalRegistryArray<Person> | null> {
    const parentData = await this.fetchData(nationalId)

    const children = parentData.forsja?.born?.length
      ? parentData.forsja.born
      : []

    const childDetails: Array<Person | null> = await Promise.all(
      children.map(async (child) => {
        if (!child.barnKennitala || !child.barnNafn) {
          return null
        }

        const childDetails = await this.fetchData(child.barnKennitala)

        const otherParents =
          childDetails.forsja?.forsjaradilar?.filter(
            (f) => f.forsjaAdiliKennitala !== nationalId,
          ) ?? []

        const otherParentsDetails = await Promise.all(
          otherParents.map(async (p) => {
            if (!p.forsjaAdiliKennitala) {
              return null
            }
            return await this.fetchData(p.forsjaAdiliKennitala)
          }),
        )

        const parents = (await this.getParents(child.barnKennitala)) ?? []
        const custodians = (await this.getCustodians(child.barnKennitala)) ?? []

        const livesWithApplicant = childDetails.logheimilistengsl?.logheimilismedlimir
          ?.map((l) => l.kennitala)
          .includes(parentData.kennitala)

        return {
          ...this.extractPerson(childDetails),
          nationalId: child.barnKennitala,
          fullName: child.barnNafn,
          parents,
          custodians,
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
              ? this.extractPerson(otherParentsDetails[0])
              : null,
        }
      }),
    )

    return childDetails.filter((child): child is Person => child != null)
  }*/

  async getFamily(
    nationalId: string,
  ): Promise<Array<NationalRegistryFamilyMember> | null> {
    //const data = await this.nationalRegistryApi.getBirthplace(nationalId)
    //return data && formatBirthplace(data)
    return null
  }

  async getBirthplace(
    nationalId: string,
  ): Promise<NationalRegistryBirthplace | null> {
    const data = await this.nationalRegistryApi.getBirthplace(nationalId)
    return data && formatBirthplace(data)
  }

  async getName(nationalId: string): Promise<NationalRegistryName | null> {
    const data = await this.nationalRegistryApi.getName(nationalId)

    return data && formatName(data)
  }

  async getReligion(
    nationalId: string,
  ): Promise<NationalRegistryReligion | null> {
    const data = await this.nationalRegistryApi.getReligion(nationalId)

    return data && formatReligion(data)
  }
}
