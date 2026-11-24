import { mkdtempSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { logger } from '@island.is/logging'
import {
  APPLICATION_TYPE_SETTINGS_MOCK_FILE_ENV,
  getLocalApplicationTypeSettingsOverride,
} from './applicationTypeSettings.localOverride'

jest.mock('@island.is/logging', () => ({ logger: { warn: jest.fn() } }))

describe('getLocalApplicationTypeSettingsOverride', () => {
  const originalEnv = { ...process.env }
  let dir: string
  let file: string

  const writeSettings = (content: unknown) =>
    writeFileSync(file, JSON.stringify(content))

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'application-type-settings-'))
    file = join(dir, 'settings.json')
    process.env = { ...originalEnv, NODE_ENV: 'development' }
    process.env[APPLICATION_TYPE_SETTINGS_MOCK_FILE_ENV] = file
  })

  afterEach(() => {
    process.env = originalEnv
    rmSync(dir, { recursive: true, force: true })
  })

  it('is not active when the env variable is not set', () => {
    delete process.env[APPLICATION_TYPE_SETTINGS_MOCK_FILE_ENV]

    expect(getLocalApplicationTypeSettingsOverride('ExampleInputs')).toBeNull()
  })

  it('is not active in production', () => {
    process.env.NODE_ENV = 'production'
    writeSettings([{ applicationType: 'ExampleInputs' }])

    expect(getLocalApplicationTypeSettingsOverride('ExampleInputs')).toBeNull()
  })

  it('returns the global and matching settings with defaults, global first', () => {
    writeSettings([
      {
        applicationType: 'ExampleInputs',
        disableLeavingPrerequisites: true,
        alertBanner: { title: 'Type banner' },
      },
      { applicationType: 'Other', disableLeavingPrerequisites: true },
      { applicationType: '*' },
    ])

    const settings = getLocalApplicationTypeSettingsOverride('ExampleInputs')

    expect(settings).toEqual([
      expect.objectContaining({
        applicationType: '*',
        disableLeavingPrerequisites: false,
        alertBanner: null,
        blockedTitle: null,
        blockedMessage: null,
      }),
      expect.objectContaining({
        applicationType: 'ExampleInputs',
        disableLeavingPrerequisites: true,
        alertBanner: expect.objectContaining({
          title: 'Type banner',
          showAlertBanner: true,
          bannerVariant: 'warning',
          isDismissable: true,
          dismissedForDays: 0,
        }),
      }),
    ])
  })

  it('reads the file on every call', () => {
    writeSettings([{ applicationType: 'ExampleInputs' }])
    expect(
      getLocalApplicationTypeSettingsOverride('ExampleInputs'),
    ).toHaveLength(1)

    writeSettings([])
    expect(getLocalApplicationTypeSettingsOverride('ExampleInputs')).toEqual([])
  })

  it('returns no settings when the file is invalid', () => {
    writeFileSync(file, 'not json')

    expect(getLocalApplicationTypeSettingsOverride('ExampleInputs')).toEqual([])
    expect(logger.warn).toHaveBeenCalled()
  })
})
