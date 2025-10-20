import { Application, FormValue } from '@island.is/application/types'
import {
  ApplicationDto,
  CurrentApplicationStatus,
} from '@island.is/clients/hms-application-system'
import { getValueViaPath, YES } from '@island.is/application/core'
import { Fasteign } from '@island.is/clients/assets'
import {
  APPLICATION_TYPE,
  GUID,
  Hlutverk,
  NotandagognFlokkur,
  NotandagognHeiti,
  NotandagognTegund,
  Tegund,
} from './shared'
import * as kennitala from 'kennitala'

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
  const selectedRealEstateId = getValueViaPath<string>(answers, 'realEstate')
  const selectedRealEstate = getValueViaPath<Array<Fasteign>>(
    externalData,
    'getProperties.data',
  )?.find((realEstate) => realEstate.fasteignanumer === selectedRealEstateId)

  return {
    applicationName: '?',
    status: CurrentApplicationStatus.NUMBER_40,
    language: 'IS', // TODO Should we set this based on users starting language ?
    portalApplicationID: application.id,
    applicationType: APPLICATION_TYPE, // TODO We need this id from HMS
    applicationJson: null,
    dagssetning: new Date(),
    adilar: [
      {
        kennitala: applicant.nationalId,
        heiti: applicant.name,
        // TODO We do not show these in the application do they need to be returned to HMS ?
        //heimili: applicant.address,
        //postnumer: applicant.postalCode,
        //stadur: applicant.city,
        tegund: kennitala.isPerson(applicant.nationalId ?? '')
          ? Tegund.Person
          : Tegund.Company,
        hlutverk: Hlutverk.Applicant,
        netfang: applicant.email,
        simi: applicant.phoneNumber,
      },
      // How do we handle contacts ? are they also adilar with a distinct hlutverk ?
      // Additionally we do not have all the data fields for contacts are we sure they are optional etc. ?
      // If contact is the same as applicant do we add them again or some form of boolean flag ?
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
        guid: GUID,
      },
      {
        flokkur: NotandagognFlokkur.Property,
        heiti: 'Fasteignanumer',
        tegund: 'fastanúmer',
        gildi: selectedRealEstate?.fasteignanumer?.replace(/\D/g, ''),
        guid: crypto.randomUUID(),
      },
      // Do we need to return landeigna numer ? In the case of fasteignanumer the prefix is removed so do we/you know if it is a land property or not ?
      {
        flokkur: NotandagognFlokkur.DerivedPropertyNumber,
        heiti: NotandagognHeiti.Address,
        tegund: NotandagognTegund.String,
        gildi: selectedRealEstate?.sjalfgefidStadfang?.birtingStutt,
        guid: crypto.randomUUID(),
      },
      {
        flokkur: NotandagognFlokkur.DerivedPropertyNumber,
        heiti: NotandagognHeiti.PostalCode,
        tegund: NotandagognTegund.String,
        gildi: selectedRealEstate?.sjalfgefidStadfang?.postnumer?.toString(),
        guid: crypto.randomUUID(),
      },
      {
        flokkur: NotandagognFlokkur.DerivedPropertyNumber,
        heiti: NotandagognHeiti.Municipality,
        tegund: NotandagognTegund.String,
        gildi: selectedRealEstate?.sjalfgefidStadfang?.sveitarfelagBirting,
        guid: crypto.randomUUID(),
      },
      // Do we need to return landeigna numer ?
    ],
    greidsla: {
      upphaed: null,
      dags: null,
      korthafi: null,
      kortanumer: null,
      tegundKorts: null,
    },
  }
}
