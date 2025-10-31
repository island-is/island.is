import { Application, FormValue } from '@island.is/application/types'
import {
  ApplicationDto,
  CurrentApplicationStatus,
} from '@island.is/clients/hms-application-system'
import { getValueViaPath, YES } from '@island.is/application/core'
import { Fasteign } from '@island.is/clients/assets'
import {
  APPLICATION_NAME,
  APPLICATION_TYPE,
  ContactAnswer,
  EmailRecipient,
  formatCurrency,
  Hlutverk,
  NotandagognFlokkur,
  NotandagognHeiti,
  NotandagognTegund,
  Tegund,
} from './shared'
import * as kennitala from 'kennitala'
import { randomUUID } from 'node:crypto'
import { join } from 'path'
import { ApplicantAnswer } from '@island.is/application/templates/hms/registration-of-new-property-numbers'

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

export const getRecipients = (
  application: Application,
): Array<EmailRecipient> => {
  const applicant = getValueViaPath<ApplicantAnswer>(
    application.answers,
    'applicant',
  )
  const contact = getValueViaPath<ContactAnswer>(application.answers, 'contact')

  const applicantRecipient = {
    email: applicant?.email || '',
    name: applicant?.name || '',
  }
  const contactRecipient = {
    email: contact?.email || '',
    name: contact?.name || '',
  }

  if (
    contactRecipient.email &&
    applicantRecipient.email !== contactRecipient.email
  )
    return [applicantRecipient, contactRecipient]

  return [applicantRecipient]
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
  const selectedRealEstateCost = getValueViaPath<string>(
    answers,
    'realEstate.realEstateCost',
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

  // NOTE
  // HMS is using an API thats maps against "umsóknasmiður", thats why the request is so generic and riddled with string values
  return {
    applicationName: APPLICATION_NAME,
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
        hlutverk: Hlutverk.Customer,
        netfang: applicant.email,
        simi: applicant.phoneNumber,
      },
    ],
    notandagogn: [
      // Stofnupplýsingar
      {
        flokkur: NotandagognFlokkur.CoreInformation,
        heiti: NotandagognHeiti.Applicant,
        tegund: NotandagognTegund.String,
        gildi: selectedRealEstate?.sjalfgefidStadfang?.birting,
        guid: randomUUID(),
      },
      {
        flokkur: NotandagognFlokkur.CoreInformation,
        heiti: NotandagognHeiti.LandId,
        tegund: NotandagognTegund.String,
        gildi: selectedRealEstate?.landeign?.landeignarnumer,
        guid: randomUUID(),
      },
      {
        flokkur: NotandagognFlokkur.CoreInformation,
        heiti: NotandagognHeiti.PropertyNumber,
        tegund: NotandagognTegund.PropertyNumber,
        gildi: selectedRealEstate?.fasteignanumer?.replace(/\D/g, ''),
        guid: randomUUID(),
      },
      {
        flokkur: NotandagognFlokkur.CoreInformation,
        heiti: NotandagognHeiti.DocumentNumber,
        tegund: NotandagognTegund.String,
        gildi: 'F-551',
        guid: randomUUID(),
      },
      // Tengiliður
      {
        flokkur: NotandagognFlokkur.Contact,
        heiti: NotandagognHeiti.Name,
        tegund: NotandagognTegund.String,
        gildi: contactIsSameAsApplicant ? applicant.name : contact?.name,
        guid: randomUUID(),
      },
      {
        flokkur: NotandagognFlokkur.Contact,
        heiti: NotandagognHeiti.Phone,
        tegund: NotandagognTegund.String,
        gildi: contactIsSameAsApplicant
          ? applicant.phoneNumber
          : contact?.phone,
        guid: randomUUID(),
      },
      {
        flokkur: NotandagognFlokkur.Contact,
        heiti: NotandagognHeiti.Email,
        tegund: NotandagognTegund.String,
        gildi: contactIsSameAsApplicant ? applicant.email : contact?.email,
        guid: randomUUID(),
      },
      // Aðrar upplýsingar
      {
        flokkur: NotandagognFlokkur.OtherInformation,
        heiti: NotandagognHeiti.OtherComments,
        tegund: NotandagognTegund.String,
        gildi: selectedRealEstateOtherComments,
        guid: randomUUID(),
      },
      // Vara
      {
        flokkur: NotandagognFlokkur.Product,
        heiti: NotandagognHeiti.AmountOfNewNumbers,
        tegund: NotandagognTegund.String,
        gildi: selectedRealEstateAmount?.toString(),
        guid: randomUUID(),
      },
      {
        flokkur: NotandagognFlokkur.Product,
        heiti: NotandagognHeiti.AmountPaid,
        tegund: NotandagognTegund.String,
        gildi: formatCurrency(selectedRealEstateCost || '0'),
        guid: randomUUID(),
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
