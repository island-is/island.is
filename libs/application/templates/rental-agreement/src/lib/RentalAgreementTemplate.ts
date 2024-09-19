import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationStateSchema,
  DefaultEvents,
} from '@island.is/application/types'

import { dataSchema } from './dataSchema'

type Events = { type: DefaultEvents.SUBMIT } | { type: DefaultEvents.EDIT }

export enum ApplicationStates {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  SPOUSE = 'spouse',
  PREREQUISITESSPOUSE = 'prerequisitesSpouse',
  MUNCIPALITYNOTREGISTERED = 'muncipalityNotRegistered',
}

export enum Routes {
  GENERALINFORMATION = 'generalInformation',
  ACCECPTCONTRACT = 'acceptContract',
  INRELATIONSHIP = 'inRelationship',
  UNKNOWNRELATIONSHIP = 'unknownRelationship',
  HOMECIRCUMSTANCES = 'homeCircumstances',
  STUDENT = 'student',
  EMPLOYMENT = 'employment',
  INCOME = 'income',
  PERSONALTAXCREDIT = 'personalTaxCredit',
  BANKINFO = 'bankInfo',
  CONTACTINFO = 'contactInfo',
  TAXRETURNFILES = 'taxReturnFiles',
  INCOMEFILES = 'incomeFiles',
  SUMMARY = 'summary',
  CONFIRMATION = 'confirmation',
  CHILDRENSCHOOLINFO = 'childrenSchoolInfo',
  CHILDRENFILES = 'childrenFiles',
  SPOUSEACCECPTCONTRACT = 'spouseAcceptContract',
  SPOUSEINCOME = 'spouseIncome',
  SPOUSEINCOMEFILES = 'spouseIncomeFiles',
  SPOUSETAXRETURNFILES = 'spouseTaxReturnFiles',
  SPOUSECONTACTINFO = 'spouseContactInfo',
  SPOUSESUMMARY = 'spouseSummary',
  SPOUSECONFIRMATION = 'spouseConfirmation',
  MISSINGFILES = 'missingFiles',
  APPLICANTSTATUS = 'applicantStatus',
  MISSINGFILESCONFIRMATION = 'missingFilesConfirmation',
  SPOUSESTATUS = 'spouseStatus',
  SERVICECENTER = 'serviceCenter',
}

export enum Roles {
  APPLICANT = 'applicant',
  SPOUSE = 'spouse',
}

const DAY = 24 * 3600 * 1000

const RentalAgreementTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.RENTAL_AGREEMENT,
  name: 'Leigusamningur',
  institution: 'Húsnæðis- og mannvirkjastofnun',
  dataSchema,
  stateMachineConfig: {
    initial: ApplicationStates.PREREQUISITES,
    states: {
      [ApplicationStates.PREREQUISITES]: {
        meta: {
          name: 'Leigusamningur',
          status: 'draft',
          lifecycle: {
            shouldBeListed: false,
            shouldBePruned: true,
            whenToPrune: DAY,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Prerequisites').then((module) =>
                  Promise.resolve(module.Prerequisites),
                ),
              write: 'all',
              delete: true,
            },
          ],
        },

        on: {
          [DefaultEvents.SUBMIT]: {
            target: 'draft',
          },
        },
      },
    },
  },
  mapUserToRole() {
    return 'applicant'
  },
}

export default RentalAgreementTemplate
