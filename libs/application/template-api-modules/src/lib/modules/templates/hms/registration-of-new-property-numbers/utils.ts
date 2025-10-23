import { Application, FormValue } from '@island.is/application/types'
import {
  ApplicationDto,
  CurrentApplicationStatus,
} from '@island.is/clients/hms-application-system'
import { getValueViaPath, YES } from '@island.is/application/core'
import { Fasteign } from '@island.is/clients/assets'
import {
  APPLICATION_TYPE,
  ContactAnswer,
  Hlutverk,
  NotandagognFlokkur,
  NotandagognHeiti,
  NotandagognTegund,
  Tegund,
} from './shared'
import * as kennitala from 'kennitala'
import { join } from 'path'

export const pathToAsset = (file: string) => {
  return join(
    __dirname,
    `./hms/registration-of-new-property-numbers-assets/${file}`,
  )
}

const getApplicant = (answers: FormValue) => {
  return {
    email: getValueViaPath<string>(answers, 'applicant.email'),
    name: getValueViaPath<string>(answers, 'applicant.name'),
    nationalId: getValueViaPath<string>(answers, 'applicant.nationalId'),
    phoneNumber: getValueViaPath<string>(answers, 'applicant.phoneNumber'),
  }
}

export const getRequestDto = (application: Application): ApplicationDto => {
  const { answers, externalData } = application
  const applicant = getApplicant(answers)
  const selectedRealEstateId = getValueViaPath<string>(
    answers,
    'realEstate.realEstateName',
  )
  const selectedRealEstateAmount = getValueViaPath<string>(
    answers,
    'realEstate.realEstateAmount',
  )
  const selectedRealEstateOtherComments = getValueViaPath<string>(
    answers,
    'realEstate.realEstateOtherComments',
  )
  const selectedRealEstate = getValueViaPath<Array<Fasteign>>(
    externalData,
    'getProperties.data',
  )?.find((realEstate) => realEstate.fasteignanumer === selectedRealEstateId)

  const contact = getValueViaPath<ContactAnswer>(answers, 'contact')
  const contactIsSameAsApplicant = contact?.isSameAsApplicant?.[0] === YES

  return {
    applicationName: 'Stofnun nýrra fasteignanúmera',
    status: CurrentApplicationStatus.NUMBER_40,
    language: 'IS',
    portalApplicationID: application.id,
    applicationType: APPLICATION_TYPE,
    applicationJson: null,
    dagssetning: new Date(),
    adilar: [
      {
        kennitala: applicant.nationalId,
        heiti: applicant.name,
        heimili: '',
        postnumer: '',
        stadur: '',
        tegund: kennitala.isPerson(applicant.nationalId ?? '')
          ? Tegund.Person
          : Tegund.Company,
        hlutverk: Hlutverk.Applicant,
        netfang: applicant.email,
        simi: applicant.phoneNumber,
      },
      {
        kennitala: '',
        heiti: contactIsSameAsApplicant ? applicant.name : contact?.name,
        heimili: '',
        postnumer: '',
        stadur: '',
        tegund: Tegund.Person,
        hlutverk: Hlutverk.Contact,
        netfang: contactIsSameAsApplicant ? applicant.email : contact?.email,
        simi: contactIsSameAsApplicant ? applicant.phoneNumber : contact?.phone,
      },
    ],
    notandagogn: [
      {
        flokkur: NotandagognFlokkur.ApplicationSubmission,
        heiti:
          NotandagognHeiti.DeclarationOfPropertyNumberRegistrationAwareness,
        tegund: NotandagognTegund.Boolean,
        gildi: 'true',
        guid: crypto.randomUUID(),
      },
      {
        flokkur: NotandagognFlokkur.ApplicationSubmission,
        heiti: NotandagognHeiti.PrivacyPolicyAcknowledgement,
        tegund: NotandagognTegund.Boolean,
        gildi: 'true',
        guid: crypto.randomUUID(),
      },
      {
        flokkur: NotandagognFlokkur.ApplicationSubmission,
        heiti: NotandagognHeiti.OtherComments,
        tegund: NotandagognTegund.String,
        gildi: selectedRealEstateOtherComments,
        guid: crypto.randomUUID(),
      },
      {
        flokkur: NotandagognFlokkur.Property,
        heiti: 'Fasteignanumer',
        tegund: NotandagognTegund.String,
        gildi: selectedRealEstate?.fasteignanumer?.replace(/\D/g, ''),
        guid: crypto.randomUUID(),
      },
      {
        flokkur: NotandagognFlokkur.Property,
        heiti: 'Fjöldi nýrra fasteignanúmera',
        tegund: NotandagognTegund.String,
        gildi: selectedRealEstateAmount?.toString(),
        guid: crypto.randomUUID(),
      },
      {
        flokkur: NotandagognFlokkur.Property,
        heiti: 'Landnúmer',
        tegund: NotandagognTegund.String,
        gildi: selectedRealEstate?.landeign?.landeignarnumer,
        guid: crypto.randomUUID(),
      },
    ],
    files: [],
    greidsla: {
      upphaed: null,
      dags: null,
      korthafi: null,
      kortanumer: null,
      tegundKorts: null,
    },
  }
}
