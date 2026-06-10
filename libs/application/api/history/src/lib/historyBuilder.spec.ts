// Mock the identity client before any imports trigger the module's dependency chain.
// @island.is/clients/identity transitively loads @configcat/sdk, which is not
// available in the test environment.
jest.mock('@island.is/clients/identity', () => ({
  IdentityClientService: class {
    tryToGetNameFromNationalId = jest.fn().mockResolvedValue(undefined)
  },
}))

import { Test } from '@nestjs/testing'
import { HistoryBuilder } from './historyBuilder'
import { History } from './history.model'
import { IdentityClientService } from '@island.is/clients/identity'
import {
  ApplicationTemplateHelper,
  coreHistoryMessages,
} from '@island.is/application/core'
import {
  Application,
  ApplicationContext,
  ApplicationStateSchema,
  FormatMessage,
} from '@island.is/application/types'
import { EventObject } from 'xstate'

type TemplateHelper = ApplicationTemplateHelper<
  ApplicationContext,
  ApplicationStateSchema<EventObject>,
  EventObject
>


const makeEntry = (overrides: Partial<History> = {}): History =>
  ({
    id: 'uuid-1',
    stateKey: 'draft',
    exitEvent: 'SUBMIT',
    exitTimestamp: new Date('2024-01-02T10:00:00Z'),
    entryTimestamp: new Date('2024-01-01T10:00:00Z'),
    application_id: 'app-id',
    previousState: '',
    exitEventSubjectNationalId: undefined,
    exitEventActorNationalId: undefined,
    ...overrides,
  } as unknown as History)

const makeApplication = (answersOverrides = {}): Application =>
  ({
    answers: { buyer: { nationalId: '1234567890' }, ...answersOverrides },
  } as unknown as Application)

const SUBJECT_NATIONAL_ID = '1111111119'
const ACTOR_NATIONAL_ID = '2222222229'
const SUBJECT_NAME = 'Jón Jónsson'
const ACTOR_NAME = 'María Sigurðardóttir'

describe('HistoryBuilder', () => {
  let builder: HistoryBuilder
  let formatMessage: jest.MockedFunction<FormatMessage>
  let identityService: jest.Mocked<
    Pick<IdentityClientService, 'tryToGetNameFromNationalId'>
  >
  let templateHelper: jest.Mocked<Pick<TemplateHelper, 'getHistoryLog'>>

  beforeEach(async () => {
    formatMessage = jest.fn<string, Parameters<FormatMessage>>().mockReturnValue('')
    const module = await Test.createTestingModule({
      providers: [
        HistoryBuilder,
        {
          provide: IdentityClientService,
          useValue: {
            tryToGetNameFromNationalId: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile()

    builder = module.get(HistoryBuilder)
    identityService = module.get(IdentityClientService)
    templateHelper = { getHistoryLog: jest.fn() }
  })

  const build = (entries: History[], application = makeApplication()) =>
    builder.buildApplicationHistory(
      entries,
      formatMessage,
      templateHelper as unknown as TemplateHelper,
      application,
      'applicant',
      '0000000000',
      false,
    )

  // --- Guard behaviour ---

  it('skips entries with no exitEvent', async () => {
    const result = await build([makeEntry({ exitEvent: undefined })])
    expect(result).toHaveLength(0)
    expect(templateHelper.getHistoryLog).not.toHaveBeenCalled()
  })

  it('skips entries with no exitTimestamp', async () => {
    const result = await build([makeEntry({ exitTimestamp: undefined })])
    expect(result).toHaveLength(0)
    expect(templateHelper.getHistoryLog).not.toHaveBeenCalled()
  })

  it('skips entries where no historyLog is configured for the exitEvent', async () => {
    templateHelper.getHistoryLog.mockReturnValue(undefined)
    const result = await build([makeEntry()])
    expect(result).toHaveLength(0)
  })

  // --- Static logMessage (mirrors DRAFT → SUBMIT in TransferOfVehicleOwnership) ---

  it('returns a HistoryResponseDto with the correct date and log for a static MessageDescriptor', async () => {
    templateHelper.getHistoryLog.mockReturnValue({
      onEvent: 'SUBMIT',
      logMessage: coreHistoryMessages.paymentStarted,
    })
    const exitTimestamp = new Date('2024-03-15T12:00:00Z')

    const result = await build([makeEntry({ exitTimestamp })])

    expect(result).toHaveLength(1)
    expect(result[0].date).toEqual(exitTimestamp)
    expect(formatMessage).toHaveBeenCalledWith(
      coreHistoryMessages.paymentStarted,
      undefined,
    )
    expect(result[0].subLog).toBeUndefined()
  })

  // --- Dynamic logMessage function (mirrors REVIEW → APPROVE/REJECT in TransferOfVehicleOwnership) ---

  it('calls a logMessage function with the application and subjectNationalId', async () => {
    const logMessageFn = jest
      .fn()
      .mockReturnValue(coreHistoryMessages.applicationApprovedBy)
    templateHelper.getHistoryLog.mockReturnValue({
      onEvent: 'APPROVE',
      logMessage: logMessageFn,
    })

    await build([
      makeEntry({
        stateKey: 'review',
        exitEvent: 'APPROVE',
        exitEventSubjectNationalId: SUBJECT_NATIONAL_ID,
      }),
    ])

    expect(logMessageFn).toHaveBeenCalledWith(
      expect.objectContaining({ answers: expect.anything() }),
      SUBJECT_NATIONAL_ID,
    )
  })

  it('uses the return value of a logMessage function as the log text', async () => {
    templateHelper.getHistoryLog.mockReturnValue({
      onEvent: 'APPROVE',
      logMessage: () => coreHistoryMessages.applicationApprovedBy,
    })

    const result = await build([
      makeEntry({ stateKey: 'review', exitEvent: 'APPROVE' }),
    ])

    expect(formatMessage).toHaveBeenCalledWith(
      coreHistoryMessages.applicationApprovedBy,
      undefined,
    )
  })

  // --- includeSubjectAndActor ---

  it('does not call the identity service when includeSubjectAndActor is false', async () => {
    templateHelper.getHistoryLog.mockReturnValue({
      onEvent: 'SUBMIT',
      logMessage: coreHistoryMessages.paymentStarted,
      includeSubjectAndActor: false,
    })

    await build([
      makeEntry({ exitEventSubjectNationalId: SUBJECT_NATIONAL_ID }),
    ])

    expect(identityService.tryToGetNameFromNationalId).not.toHaveBeenCalled()
  })

  it('resolves subject name and sets subLog when includeSubjectAndActor is true', async () => {
    identityService.tryToGetNameFromNationalId.mockResolvedValue(SUBJECT_NAME)
    templateHelper.getHistoryLog.mockReturnValue({
      onEvent: 'APPROVE',
      logMessage: coreHistoryMessages.applicationApprovedBy,
      includeSubjectAndActor: true,
    })

    const result = await build([
      makeEntry({
        stateKey: 'review',
        exitEvent: 'APPROVE',
        exitEventSubjectNationalId: SUBJECT_NATIONAL_ID,
      }),
    ])

    expect(identityService.tryToGetNameFromNationalId).toHaveBeenCalledWith(
      SUBJECT_NATIONAL_ID,
    )
    expect(formatMessage).toHaveBeenCalledWith(coreHistoryMessages.byReviewer, {
      subject: SUBJECT_NAME,
    })
  })

  it('falls back to the nationalId as display name when the identity lookup returns undefined', async () => {
    identityService.tryToGetNameFromNationalId.mockResolvedValue(undefined)
    templateHelper.getHistoryLog.mockReturnValue({
      onEvent: 'APPROVE',
      logMessage: coreHistoryMessages.applicationApprovedBy,
      includeSubjectAndActor: true,
    })

    const result = await build([
      makeEntry({
        stateKey: 'review',
        exitEvent: 'APPROVE',
        exitEventSubjectNationalId: SUBJECT_NATIONAL_ID,
      }),
    ])

    expect(formatMessage).toHaveBeenCalledWith(coreHistoryMessages.byReviewer, {
      subject: SUBJECT_NATIONAL_ID,
    })
  })

  it('includes both subject and actor in subLog when they are different people', async () => {
    identityService.tryToGetNameFromNationalId
      .mockResolvedValueOnce(SUBJECT_NAME) // subject
      .mockResolvedValueOnce(ACTOR_NAME) // actor
    templateHelper.getHistoryLog.mockReturnValue({
      onEvent: 'APPROVE',
      logMessage: coreHistoryMessages.applicationApprovedBy,
      includeSubjectAndActor: true,
    })

    const result = await build([
      makeEntry({
        stateKey: 'review',
        exitEvent: 'APPROVE',
        exitEventSubjectNationalId: SUBJECT_NATIONAL_ID,
        exitEventActorNationalId: ACTOR_NATIONAL_ID,
      }),
    ])

    expect(formatMessage).toHaveBeenCalledWith(
      coreHistoryMessages.byReviewerWithActor,
      { subject: SUBJECT_NAME, actor: ACTOR_NAME },
    )
  })

  it('uses the single-name format when subject and actor are the same person', async () => {
    identityService.tryToGetNameFromNationalId.mockResolvedValue(SUBJECT_NAME)
    templateHelper.getHistoryLog.mockReturnValue({
      onEvent: 'APPROVE',
      logMessage: coreHistoryMessages.applicationApprovedBy,
      includeSubjectAndActor: true,
    })

    const result = await build([
      makeEntry({
        stateKey: 'review',
        exitEvent: 'APPROVE',
        exitEventSubjectNationalId: SUBJECT_NATIONAL_ID,
        exitEventActorNationalId: SUBJECT_NATIONAL_ID, // same person
      }),
    ])

    // byReviewer format — name appears once, not twice
    expect(formatMessage).toHaveBeenCalledWith(coreHistoryMessages.byReviewer, {
      subject: SUBJECT_NAME,
    })
  })

  it('calls an includeSubjectAndActor function with currentUserRole, nationalId, and isAdmin', async () => {
    const includeSubjectAndActorFn = jest.fn().mockReturnValue(false)
    templateHelper.getHistoryLog.mockReturnValue({
      onEvent: 'APPROVE',
      logMessage: coreHistoryMessages.applicationApprovedBy,
      includeSubjectAndActor: includeSubjectAndActorFn,
    })

    await builder.buildApplicationHistory(
      [
        makeEntry({
          stateKey: 'review',
          exitEvent: 'APPROVE',
          exitEventSubjectNationalId: SUBJECT_NATIONAL_ID,
        }),
      ],
      formatMessage,
      templateHelper as unknown as TemplateHelper,
      makeApplication(),
      'buyer',
      '3333333339',
      true,
    )

    expect(includeSubjectAndActorFn).toHaveBeenCalledWith(
      'buyer',
      '3333333339',
      true,
    )
  })

  it('does not set subLog when the includeSubjectAndActor function returns false', async () => {
    templateHelper.getHistoryLog.mockReturnValue({
      onEvent: 'APPROVE',
      logMessage: coreHistoryMessages.applicationApprovedBy,
      includeSubjectAndActor: () => false,
    })

    const result = await build([
      makeEntry({
        stateKey: 'review',
        exitEvent: 'APPROVE',
        exitEventSubjectNationalId: SUBJECT_NATIONAL_ID,
      }),
    ])

    expect(identityService.tryToGetNameFromNationalId).not.toHaveBeenCalled()
    expect(result[0].subLog).toBeUndefined()
  })

  // --- Sorting ---

  it('returns entries sorted by exitTimestamp descending', async () => {
    templateHelper.getHistoryLog.mockReturnValue({
      onEvent: 'SUBMIT',
      logMessage: coreHistoryMessages.paymentStarted,
    })
    const entries = [
      makeEntry({ exitTimestamp: new Date('2024-01-01T00:00:00Z') }),
      makeEntry({ exitTimestamp: new Date('2024-01-03T00:00:00Z') }),
      makeEntry({ exitTimestamp: new Date('2024-01-02T00:00:00Z') }),
    ]

    const result = await build(entries)

    expect(result[0].date).toEqual(new Date('2024-01-03T00:00:00Z'))
    expect(result[1].date).toEqual(new Date('2024-01-02T00:00:00Z'))
    expect(result[2].date).toEqual(new Date('2024-01-01T00:00:00Z'))
  })
})
