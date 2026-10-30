import set from 'lodash/set'

import {
  ApplicationWithAttachments as Application,
  FormValue,
} from '@island.is/application/types'
import {
  ChildInformation,
  ChildInformationWithoutRights,
  ParentalRelations,
  States,
} from '@island.is/application/templates/parental-leave'
import type { Logger } from '@island.is/logging'

import { ChildrenService } from './children.service'

// eslint-disable-next-line local-rules/disallow-kennitalas
const APPLICANT_ID = '0101302129'

let id = 0

const createApplication = ({
  state,
  answers = {},
  children = [],
  fundId,
}: {
  state: string
  answers?: FormValue
  children?: ChildInformationWithoutRights[]
  fundId?: string
}): Application => {
  const externalData: Application['externalData'] = {}
  set(externalData, 'children.data', { children })
  if (fundId) {
    set(externalData, 'navId.data', fundId)
  }

  return {
    id: `application-${id++}`,
    answers,
    applicant: APPLICANT_ID,
    assignees: [],
    applicantActors: [],
    attachments: {},
    created: new Date(),
    modified: new Date(),
    externalData,
    state,
    status: 'inprogress' as Application['status'],
    typeId: 'ParentalLeave' as Application['typeId'],
  }
}

const childBornOn = (
  expectedDateOfBirth: string,
): ChildInformationWithoutRights => ({
  expectedDateOfBirth,
  parentalRelation: ParentalRelations.primary,
})

describe('ChildrenService.getMockData', () => {
  const service = new ChildrenService(
    {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as unknown as Logger,
    {} as never,
    {} as never,
    {} as never,
  )

  const currentApplication = createApplication({
    state: States.PREREQUISITES,
    answers: {
      mock: {
        useMockData: 'yes',
        useMockedParentalRelation: ParentalRelations.primary,
        useMockedDateOfBirth: '20270301',
        useMockedPrimaryParentRights: '180',
      },
    },
  })

  // Never reached VMST: changing it would be refused by `verifyFollowUpLeave`.
  const draftApplication = createApplication({
    state: States.DRAFT,
    answers: { selectedChild: '0' },
    children: [childBornOn('2027-06-26')],
  })

  const approvedApplication = createApplication({
    state: States.APPROVED,
    answers: { selectedChild: '0' },
    children: [childBornOn('2027-11-08')],
    fundId: 'fund-1',
  })

  const getMockChildren = async () => {
    const { children } = await service.getMockData(
      currentApplication,
      async () => [currentApplication, draftApplication, approvedApplication],
    )

    const byDate = (date: string) =>
      children.find(
        (child) => child.expectedDateOfBirth === date,
      ) as ChildInformation

    return { children, byDate }
  }

  it('holds a child whose application has not reached VMST as in progress', async () => {
    const { byDate } = await getMockChildren()

    expect(byDate('2027-06-26')).toMatchObject({
      existingApplicationId: draftApplication.id,
      existingApplicationIsInProgress: true,
    })
  })

  it('still offers a change for a child whose application was approved', async () => {
    const { byDate } = await getMockChildren()

    expect(byDate('2027-11-08')).toMatchObject({
      existingApplicationId: approvedApplication.id,
      existingApplicationHasFundId: true,
      existingApplicationIsInProgress: false,
    })
  })

  it('adds the mocked child without linking it to an application', async () => {
    const { byDate } = await getMockChildren()

    expect(byDate('2027-03-01')).toBeDefined()
    expect(byDate('2027-03-01').existingApplicationId).toBeUndefined()
  })
})
