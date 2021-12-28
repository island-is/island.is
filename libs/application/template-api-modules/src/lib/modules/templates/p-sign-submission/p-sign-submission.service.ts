import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  SyslumennService,
  Person,
  Attachment,
  PersonType,
} from '@island.is/clients/syslumenn'
import { NationalRegistry, UserProfile } from './types'

@Injectable()
export class PSignSubmissionService {
  constructor(
    private readonly syslumennService: SyslumennService,
  ) {}


  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    const nationalRegistryData = application.externalData.nationalRegistry
      ?.data as NationalRegistry
    const userProfileData = application.externalData.userProfile
      ?.data as UserProfile
    const person: Person = {
      name: nationalRegistryData?.fullName,
      ssn: nationalRegistryData?.nationalId,
      phoneNumber: application.answers.phone as string,
      email: application.answers.email as string,
      homeAddress: nationalRegistryData?.address.streetAddress,
      postalCode: nationalRegistryData?.address.postalCode,
      city: nationalRegistryData?.address.city,
      signed: true,
      type: PersonType.Plaintiff,
    }
    const persons: Person[] = [person]

    const dateStr = new Date(Date.now()).toISOString().substring(0, 10)
    const content = application.answers.photoAttachment as string
    const attachment: Attachment = {
      name: `p_kort_mynd_${nationalRegistryData?.nationalId}_${dateStr}.pdf`,
      content: content
    }

    const extraData: { [key: string]: string } = {"StarfsstodID": application.answers.district as string}

    const uploadDataName = 'pkort1.0'
    const uploadDataId = 'pkort1.0'

    await this.syslumennService
      .uploadData(persons, attachment, extraData, uploadDataName, uploadDataId)
      .catch((error) =>  new Error('Ekki tókst að senda umsókn'))
  }
}
