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
} from '@island.is/application/templates/parental-leave-v2'
import type { Logger } from '@island.is/logging'

import { ChildrenService } from './children.service'

 
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
    typeId: 'ParentalLeaveV2' as Application['typeId'],
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
    ({
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as unknown) as Logger,
    {} as never,
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
      inProgressApplicationId: draftApplication.id,
      inProgressIsChange: false,
    })
  })

  it('still offers a change for a child whose application was approved', async () => {
    const { byDate } = await getMockChildren()

    expect(byDate('2027-11-08')).toMatchObject({
      vmstApplicationId: approvedApplication.id,
    })
  })

  it('adds the mocked child without linking it to an application', async () => {
    const { byDate } = await getMockChildren()

    expect(byDate('2027-03-01')).toBeDefined()
    expect(byDate('2027-03-01').vmstApplicationId).toBeUndefined()
    expect(byDate('2027-03-01').inProgressApplicationId).toBeUndefined()
  })
})

describe('ChildrenService.provideChildren', () => {
  const failingParentalLeaveApi = {
    parentalLeaveGetParentalLeaves: jest.fn().mockRejectedValue(new Error()),
  }
  const createService = () =>
    new ChildrenService(
      ({
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
      } as unknown) as Logger,
      { customTemplateFindQuery: () => async () => [] } as never,
      failingParentalLeaveApi as never,
      {} as never,
      {} as never,
    )

  it("refuses to list children when VMST's parental leaves cannot be fetched", async () => {
    const service = createService()
    service.isRunningInDevelopment = false

    await expect(
      service.provideChildren(
        createApplication({ state: States.PREREQUISITES }),
        APPLICANT_ID,
      ),
    ).rejects.toThrow()
  })

  it('falls back to the applicant’s own applications in development', async () => {
    const service = createService()
    service.isRunningInDevelopment = true

    await expect(
      service.provideChildren(
        createApplication({ state: States.PREREQUISITES }),
        APPLICANT_ID,
      ),
    ).resolves.toEqual(expect.objectContaining({ existingApplications: [] }))
  })
})

describe('ChildrenService.childrenAndExistingApplications', () => {
  const service = new ChildrenService(
    ({
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as unknown) as Logger,
    {} as never,
    {} as never,
    {} as never,
    {} as never,
  )

  it('collects the primary parent applications stored under every other-parent path', async () => {
    const primaryApplication = (expectedDateOfBirth: string) => ({
      ...createApplication({
        state: States.APPROVED,
        answers: { selectedChild: '0' },
        children: [childBornOn(expectedDateOfBirth)],
      }),
      applicant: '0101307789',
    })
    const underNewPath = primaryApplication('2027-01-01')
    const underOldPath = primaryApplication('2027-09-09')

    const { children } = await service.childrenAndExistingApplications(
      createApplication({ state: States.PREREQUISITES }),
      async (query) =>
        'answers.otherParentObj.otherParentId' in query
          ? [underNewPath]
          : 'answers.otherParentId' in query
          ? [underOldPath, underNewPath]
          : [],
      null,
      [],
    )

    expect(children.map((child) => child.expectedDateOfBirth).sort()).toEqual([
      '2027-01-01',
      '2027-09-09',
    ])
  })
})
