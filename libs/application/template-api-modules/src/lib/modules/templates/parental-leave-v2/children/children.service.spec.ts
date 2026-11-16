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
    {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as unknown as Logger,
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
    parentalLeaveGetParentalLeavesRaw: jest.fn().mockRejectedValue(new Error()),
  }
  const createService = () =>
    new ChildrenService(
      {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
      } as unknown as Logger,
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
    {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as unknown as Logger,
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

describe('ChildrenService.queryParentalLeavesAndPregnancyStatus', () => {
  it('should use the parental leaves gathered by the VMST provider', async () => {
    const parentalLeaveApi = { parentalLeaveGetParentalLeavesRaw: jest.fn() }
    const service = new ChildrenService(
      {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
      } as unknown as Logger,
      {} as never,
      parentalLeaveApi as never,
      {} as never,
      {} as never,
    )
    const parentalLeaves = [{ applicationId: 'leave-1' }]

    const res = await service.queryParentalLeavesAndPregnancyStatus(
      APPLICANT_ID,
      { parentalLeaves, applications: {} } as never,
    )

    expect(res.getParentalLeaves).toBe(parentalLeaves)
    expect(
      parentalLeaveApi.parentalLeaveGetParentalLeavesRaw,
    ).not.toHaveBeenCalled()
  })
})

describe('ChildrenService.withIslandIsApplicationIds', () => {
  const V2_APPLICATION_ID = '6b44e738-a278-44a6-8ac8-ff24e9d6e956'
  const V2_CHANGE_ID = 'c8896013-573e-4ea3-9770-99a7246ee020'
  const V1_APPLICATION_ID = '3044a099-76dc-4430-96c6-bfa7ece9e2c7'
  const PRUNED_APPLICATION_ID = '10706b5b-2f5c-4f0e-9d8a-3b1f7a1c2d3e'
  const ASSIGNED_APPLICATION_ID = 'f44563ad-8b0e-4c47-a4b7-6c2d1e0f9a8b'

  const v2Application = {
    id: V2_APPLICATION_ID,
    applicant: APPLICANT_ID,
    answers: {},
    externalData: { sentToVMST: { data: { id: '2017-05168' } } },
  }
  const currentByType: Record<string, unknown[]> = {
    // Most recently modified first, as the queries return them. A change and
    // a residence grant continuing it share the leave's case number.
    ParentalLeaveV2: [
      {
        id: 'residence-grant',
        applicant: APPLICANT_ID,
        answers: { initialQuery: V2_CHANGE_ID },
        externalData: { sendApplication: { data: { id: '2017-05168' } } },
      },
      {
        id: V2_CHANGE_ID,
        applicant: APPLICANT_ID,
        answers: { initialQuery: V2_APPLICATION_ID },
        externalData: {
          navId: { data: '2017-05168' },
          sentToVMST: { data: { id: '2017-05168' } },
        },
      },
      v2Application,
      {
        id: 'mock-application',
        applicant: APPLICANT_ID,
        answers: {},
        externalData: { navId: { data: 'mock-application-fund-id' } },
      },
    ],
    ParentalLeave: [
      {
        id: V1_APPLICATION_ID,
        applicant: APPLICANT_ID,
        answers: {},
        externalData: { sendApplication: { data: { id: '2017-05170' } } },
      },
    ],
  }
  const includingPruned = [
    v2Application,
    // Pruned: only the fields kept by `adminDataConfig` are left
    {
      id: 'pruned-change',
      applicant: APPLICANT_ID,
      answers: { initialQuery: PRUNED_APPLICATION_ID },
      externalData: { sentToVMST: { data: { id: '2017-05001' } } },
    },
    {
      id: PRUNED_APPLICATION_ID,
      applicant: APPLICANT_ID,
      answers: {},
      externalData: { sentToVMST: { data: { id: '2017-05001' } } },
    },
    // The other parent's application, which the applicant was assigned to
    {
      id: ASSIGNED_APPLICATION_ID,
      applicant: 'other-parent',
      answers: {},
      externalData: { sentToVMST: { data: { id: '2017-05002' } } },
    },
  ]
  const customTemplateFindQuery = jest.fn(
    (typeId: string) => async () => currentByType[typeId] ?? [],
  )
  const findAllByNationalIdAndFilters = jest.fn(async () => includingPruned)
  const service = new ChildrenService(
    { info: jest.fn(), warn: jest.fn(), error: jest.fn() } as unknown as Logger,
    { customTemplateFindQuery, findAllByNationalIdAndFilters } as never,
    {} as never,
    {} as never,
    {} as never,
  )
  const leave = (applicationId: string) =>
    ({ applicationId, applicationFundId: applicationId } as never)

  it('should find the island.is id of the V2 or V1 application that started each leave, not of a change continuing it', async () => {
    const leaves = await service.withIslandIsApplicationIds(APPLICANT_ID, [
      leave('2017-05168'),
      leave('2017-05170'),
    ])

    expect(leaves).toEqual([
      { applicationId: V2_APPLICATION_ID, applicationFundId: '2017-05168' },
      { applicationId: V1_APPLICATION_ID, applicationFundId: '2017-05170' },
    ])
    expect(customTemplateFindQuery).toHaveBeenCalledWith('ParentalLeaveV2')
    expect(customTemplateFindQuery).toHaveBeenCalledWith('ParentalLeave')
    expect(findAllByNationalIdAndFilters).toHaveBeenCalledWith(
      APPLICANT_ID,
      'ParentalLeaveV2,ParentalLeave',
      undefined,
      true,
    )
  })

  it('should find the island.is id of a pruned application', async () => {
    expect(
      await service.withIslandIsApplicationIds(APPLICANT_ID, [
        leave('2017-05001'),
      ]),
    ).toEqual([
      { applicationId: PRUNED_APPLICATION_ID, applicationFundId: '2017-05001' },
    ])
  })

  it('should leave out a leave no island.is application of the applicant created', async () => {
    expect(
      await service.withIslandIsApplicationIds(APPLICANT_ID, [
        leave('2017-04407'),
        leave('2017-05002'),
        leave('mock-application-fund-id'),
      ]),
    ).toEqual([])
  })

  it('should keep leaves that already carry an island.is id', async () => {
    customTemplateFindQuery.mockClear()
    findAllByNationalIdAndFilters.mockClear()
    const leaves = [leave(V2_APPLICATION_ID)]

    expect(await service.withIslandIsApplicationIds(APPLICANT_ID, leaves)).toBe(
      leaves,
    )
    expect(customTemplateFindQuery).not.toHaveBeenCalled()
    expect(findAllByNationalIdAndFilters).not.toHaveBeenCalled()
  })
})
