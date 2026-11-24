import { mkdtempSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import type { Logger } from '@island.is/logging'
import {
  APPLICATION_TYPE_SETTINGS_MOCK_FILE_ENV,
  ContentfulRepository,
} from '@island.is/cms'
import { ProblemError } from '@island.is/nest/problem'
import { ProblemType } from '@island.is/shared/problem'
import {
  ApplicationTypeSettingsService,
  SETTINGS_CACHE_TTL_MS,
  SETTINGS_REQUEST_TIMEOUT_MS,
} from './applicationTypeSettings.service'

const TYPE_ID = 'ExampleCommonActions'

const entry = (
  applicationType: string,
  fields: {
    disableLeavingPrerequisites?: boolean
    blockedTitle?: string
    blockedMessage?: string
  } = {},
) => ({
  sys: { id: `id-${applicationType}` },
  fields: { applicationType, ...fields },
})

const application = (state = 'prerequisites') => ({
  id: 'application-id',
  typeId: TYPE_ID,
  state,
})

describe('ApplicationTypeSettingsService', () => {
  let getLocalizedEntries: jest.Mock
  let logger: Logger
  let service: ApplicationTypeSettingsService

  const respondWith = (items: unknown[]) =>
    getLocalizedEntries.mockResolvedValue({ items })

  const expectBlocked = async (state?: string) => {
    const error = await service
      .assertCanLeaveState(application(state), 'is')
      .catch((e) => e)
    expect(error).toBeInstanceOf(ProblemError)
    return (error as ProblemError).problem
  }

  beforeEach(() => {
    jest.useRealTimers()
    getLocalizedEntries = jest.fn()
    logger = { warn: jest.fn() } as unknown as Logger
    service = new ApplicationTypeSettingsService(
      { getLocalizedEntries } as unknown as ContentfulRepository,
      logger,
    )
  })

  it('queries both the global and the type specific settings', async () => {
    respondWith([])

    await service.assertCanLeaveState(application(), 'en')

    expect(getLocalizedEntries).toHaveBeenCalledWith(
      'en',
      {
        content_type: 'applicationTypeSettings',
        'fields.applicationType[in]': `*,${TYPE_ID}`,
      },
      1,
    )
  })

  it('does not block when there are no settings', async () => {
    respondWith([])

    await expect(
      service.assertCanLeaveState(application(), 'is'),
    ).resolves.toBeUndefined()
  })

  it('does not block when settings exist but the switch is off', async () => {
    respondWith([entry(TYPE_ID, { disableLeavingPrerequisites: false })])

    await expect(
      service.assertCanLeaveState(application(), 'is'),
    ).resolves.toBeUndefined()
  })

  it('blocks leaving prerequisites when the type is blocked', async () => {
    respondWith([
      entry(TYPE_ID, {
        disableLeavingPrerequisites: true,
        blockedTitle: 'Lokað',
        blockedMessage: 'Umsóknin er lokuð vegna villu',
      }),
    ])

    const problem = await expectBlocked()

    expect(problem).toMatchObject({
      type: ProblemType.APPLICATION_TYPE_BLOCKED,
      status: 403,
      applicationType: TYPE_ID,
      blockedTitle: 'Lokað',
      blockedMessage: 'Umsóknin er lokuð vegna villu',
      detail: 'Umsóknin er lokuð vegna villu',
    })
  })

  it('blocks when the global entry is blocked', async () => {
    respondWith([entry('*', { disableLeavingPrerequisites: true })])

    const problem = await expectBlocked()

    expect(problem).toMatchObject({
      type: ProblemType.APPLICATION_TYPE_BLOCKED,
      applicationType: TYPE_ID,
    })
  })

  it('prefers the type specific message over the global one', async () => {
    respondWith([
      entry(TYPE_ID, {
        disableLeavingPrerequisites: true,
        blockedMessage: 'Type message',
      }),
      entry('*', {
        disableLeavingPrerequisites: true,
        blockedTitle: 'Global title',
        blockedMessage: 'Global message',
      }),
    ])

    const problem = await expectBlocked()

    expect(problem).toMatchObject({
      blockedTitle: 'Global title',
      blockedMessage: 'Type message',
    })
  })

  it('does not block or call Contentful outside of prerequisites', async () => {
    respondWith([entry(TYPE_ID, { disableLeavingPrerequisites: true })])

    await expect(
      service.assertCanLeaveState(application('draft'), 'is'),
    ).resolves.toBeUndefined()
    expect(getLocalizedEntries).not.toHaveBeenCalled()
  })

  it('fails open when Contentful errors', async () => {
    getLocalizedEntries.mockRejectedValue(new Error('Contentful is down'))

    await expect(
      service.assertCanLeaveState(application(), 'is'),
    ).resolves.toBeUndefined()
    expect(logger.warn).toHaveBeenCalled()
  })

  it('fails open when Contentful does not respond in time', async () => {
    jest.useFakeTimers()
    getLocalizedEntries.mockReturnValue(new Promise(() => undefined))

    const result = service.assertCanLeaveState(application(), 'is')
    jest.advanceTimersByTime(SETTINGS_REQUEST_TIMEOUT_MS)

    await expect(result).resolves.toBeUndefined()
    expect(logger.warn).toHaveBeenCalled()
  })

  it('uses the local settings file instead of Contentful when configured', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'application-type-settings-'))
    const file = join(dir, 'settings.json')
    writeFileSync(
      file,
      JSON.stringify([
        {
          applicationType: TYPE_ID,
          disableLeavingPrerequisites: true,
          blockedMessage: 'Local message',
        },
      ]),
    )
    process.env[APPLICATION_TYPE_SETTINGS_MOCK_FILE_ENV] = file

    try {
      const problem = await expectBlocked()
      expect(problem).toMatchObject({ blockedMessage: 'Local message' })

      writeFileSync(file, JSON.stringify([]))
      await expect(
        service.assertCanLeaveState(application(), 'is'),
      ).resolves.toBeUndefined()
      expect(getLocalizedEntries).not.toHaveBeenCalled()
    } finally {
      delete process.env[APPLICATION_TYPE_SETTINGS_MOCK_FILE_ENV]
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('caches settings per type and locale', async () => {
    jest.useFakeTimers()
    respondWith([])

    await service.assertCanLeaveState(application(), 'is')
    await service.assertCanLeaveState(application(), 'is')
    expect(getLocalizedEntries).toHaveBeenCalledTimes(1)

    await service.assertCanLeaveState(application(), 'en')
    expect(getLocalizedEntries).toHaveBeenCalledTimes(2)

    jest.advanceTimersByTime(SETTINGS_CACHE_TTL_MS + 1)
    await service.assertCanLeaveState(application(), 'is')
    expect(getLocalizedEntries).toHaveBeenCalledTimes(3)
  })
})
