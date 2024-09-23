import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationStateSchema,
  DefaultEvents,
  ApplicationConfigurations,
} from '@island.is/application/types'
import { Roles, ApplicationStates, DAY, MONTH } from './constants'
import { dataSchema } from './dataSchema'
import { application } from 'express'

type Events =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.EDIT }

const oneMonthLifeCycle = {
  shouldBeListed: true,
  shouldBePruned: true,
  whenToPrune: MONTH,
}

const RentalAgreementTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.RENTAL_AGREEMENT,
  name: application.name,
  institution: 'Húsnæðis- og mannvirkjastofnun',
  translationNamespaces: [
    ApplicationConfigurations.RentalAgreement.translation,
  ],
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
          SUBMIT: [{ target: ApplicationStates.DRAFT }],
        },
      },
      [ApplicationStates.DRAFT]: {
        meta: {
          name: 'Leigusamningur',
          status: 'draft',
          lifecycle: oneMonthLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Application').then((module) =>
                  Promise.resolve(module.Application),
                ),
              write: 'all',
              read: 'all',
              delete: true,
            },
          ],
        },
      },
    },
  },
  mapUserToRole() {
    return Roles.APPLICANT
  },
}

export default RentalAgreementTemplate
