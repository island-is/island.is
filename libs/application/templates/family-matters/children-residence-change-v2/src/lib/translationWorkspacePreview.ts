import { YesOrNoEnum } from '@island.is/application/core'
import type {
  ApplicantChildCustodyInformation,
  ExternalData,
  FormValue,
  NationalRegistryIndividual,
} from '@island.is/application/types'

const previewDate = new Date('2026-01-15')

const applicantAddress = {
  streetAddress: 'Borgartún 21',
  postalCode: '105',
  locality: 'Reykjavík',
  city: 'Reykjavík',
  municipalityCode: '0000',
}

const parentBAddress = {
  streetAddress: 'Laugavegur 1',
  postalCode: '101',
  locality: 'Reykjavík',
  city: 'Reykjavík',
  municipalityCode: '0000',
}

const applicant: NationalRegistryIndividual = {
  nationalId: '0101307789',
  age: 30,
  givenName: 'Gervimaður',
  familyName: 'Færeyjar',
  fullName: 'Gervimaður Færeyjar',
  citizenship: { code: 'IS', name: 'Ísland' },
  address: applicantAddress,
  genderCode: '1',
  birthDate: new Date('1930-01-01'),
}

const parentB: NationalRegistryIndividual = {
  nationalId: '0101303019',
  age: 30,
  givenName: 'Gervimaður',
  familyName: 'Afríka',
  fullName: 'Gervimaður Afríka',
  citizenship: { code: 'IS', name: 'Ísland' },
  address: parentBAddress,
  genderCode: '2',
  birthDate: new Date('1930-01-01'),
}

const childNationalId = '1508135599'

const child: ApplicantChildCustodyInformation = {
  nationalId: childNationalId,
  givenName: 'Gervibarn',
  familyName: 'Færeyjar',
  fullName: 'Gervibarn Færeyjar',
  genderCode: '1',
  livesWithApplicant: true,
  livesWithBothParents: false,
  otherParent: parentB,
  citizenship: { code: 'IS', name: 'Ísland' },
  domicileInIceland: true,
}

const asProviderResult = (data: object): ExternalData[string] => ({
  data,
  date: previewDate,
  status: 'success',
})

export const translationWorkspacePreviewApplication: {
  answers: FormValue
  externalData: ExternalData
} = {
  answers: {
    selectedChildren: [childNationalId],
    residenceChangeReason: 'Flutningur vegna vinnu',
    parentA: {
      email: 'foreldri.a@example.com',
      phoneNumber: '6111234',
      presentationPhone: '6111234',
    },
    parentB: {
      email: 'foreldri.b@example.com',
      phoneNumber: '6115678',
      presentationPhone: '6115678',
    },
    counterParty: {
      email: 'foreldri.b@example.com',
      phoneNumber: '6115678',
      presentationPhone: '6115678',
    },
    selectDuration: {
      type: 'permanent',
    },
    selectChildSupportPayment: 'childSupport',
    confirmContract: {
      terms: ['yes'],
      timestamp: '12.02.2026',
    },
    acceptContract: YesOrNoEnum.YES,
    approveTerms: ['effect'],
    approveTermsParentB: ['effect'],
    approveChildSupportTerms: ['yes'],
    approveChildSupportTermsParentB: ['yes'],
    confirmContractParentB: ['yes'],
  },
  externalData: {
    nationalRegistry: asProviderResult(applicant),
    childrenCustodyInformation: asProviderResult([child]),
    userProfile: asProviderResult({
      email: 'foreldri.a@example.com',
      emailVerified: true,
      mobilePhoneNumber: '6111234',
      mobilePhoneNumberVerified: true,
    }),
  },
}
