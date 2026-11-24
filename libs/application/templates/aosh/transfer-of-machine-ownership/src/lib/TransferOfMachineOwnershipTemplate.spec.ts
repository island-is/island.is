import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
  DefaultEvents,
} from '@island.is/application/types'
import { ApplicationTemplateHelper } from '@island.is/application/core'
import TransferOfMachineOwnershipTemplate from './TransferOfMachineOwnershipTemplate'
import { Roles, States } from './constants'

const buildApplication = (state: string): Application =>
  (({
    id: '123',
    typeId: ApplicationTypes.TRANSFER_OF_MACHINE_OWNERSHIP,
    applicant: '1111111111',
    applicantActors: [],
    assignees: ['2222222222'],
    state,
    status: ApplicationStatus.IN_PROGRESS,
    answers: { buyer: { nationalId: '2222222222' } },
    externalData: {},
    modified: new Date(),
    created: new Date(),
    attachments: {},
  } as unknown) as Application)

describe('TransferOfMachineOwnershipTemplate review permissions', () => {
  const helper = new ApplicationTemplateHelper(
    buildApplication(States.REVIEW),
    TransferOfMachineOwnershipTemplate,
  )

  it('should not let the seller send any event in review', () => {
    expect(helper.getPermittedEventsForRole(Roles.APPLICANT)).toEqual([])
  })

  it('should let the buyer approve or reject in review', () => {
    expect(helper.getPermittedEventsForRole(Roles.BUYER)).toEqual([
      DefaultEvents.SUBMIT,
      DefaultEvents.REJECT,
    ])
  })
})
