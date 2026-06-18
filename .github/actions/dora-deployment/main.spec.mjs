import { jest } from '@jest/globals'

// Mock fs before importing main.mjs
const mockExistsSync = jest.fn()
const mockReadFileSync = jest.fn()
const mockAppendFileSync = jest.fn()

jest.unstable_mockModule('node:fs', () => ({
  existsSync: mockExistsSync,
  readFileSync: mockReadFileSync,
  appendFileSync: mockAppendFileSync,
}))

// Import after mocking
const { getServices, handleStart, handleFinish } = await import('./main.mjs')

// Prevent actual process.exit
const mockExit = jest.spyOn(process, 'exit').mockImplementation((code) => {
  throw new Error(`process.exit(${code})`)
})

jest.spyOn(console, 'log').mockImplementation(() => {})
jest.spyOn(console, 'error').mockImplementation(() => {})

describe('dora-deployment', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
    mockExit.mockRestore()
  })

  describe('getServices', () => {
    it('parses comma-separated DORA_SERVICES', () => {
      process.env.DORA_SERVICES = 'api, web, worker'
      expect(getServices()).toEqual(['api', 'web', 'worker'])
    })

    it('handles single service', () => {
      process.env.DORA_SERVICES = 'api'
      expect(getServices()).toEqual(['api'])
    })

    it('filters empty strings from DORA_SERVICES', () => {
      process.env.DORA_SERVICES = 'api,,web,'
      expect(getServices()).toEqual(['api', 'web'])
    })

    it('reads from data file when DORA_SERVICES is not set', () => {
      delete process.env.DORA_SERVICES
      process.env.DORA_DATA_FILE = '/tmp/test-data.json'

      mockExistsSync.mockReturnValue(true)
      mockReadFileSync.mockReturnValue(
        JSON.stringify([
          { project: 'service-b', imageName: 'service-b', imageTag: 'abc' },
          { project: 'service-a', imageName: 'service-a', imageTag: 'def' },
          { project: 'service-b', imageName: 'service-b', imageTag: 'abc' },
        ]),
      )

      const result = getServices()
      expect(result).toEqual(['service-a', 'service-b'])
    })

    it('returns empty array when no services available', () => {
      delete process.env.DORA_SERVICES
      process.env.DORA_DATA_FILE = '/nonexistent/path.json'
      mockExistsSync.mockReturnValue(false)

      expect(getServices()).toEqual([])
    })
  })

  describe('handleStart', () => {
    it('writes timestamp to GITHUB_OUTPUT', () => {
      process.env.GITHUB_OUTPUT = '/tmp/test-output.txt'

      const result = handleStart()

      expect(result).toBeGreaterThan(0)
      expect(mockAppendFileSync).toHaveBeenCalledWith(
        '/tmp/test-output.txt',
        expect.stringMatching(/^started-at=\d+\n$/),
      )
    })

    it('handles missing GITHUB_OUTPUT gracefully', () => {
      delete process.env.GITHUB_OUTPUT

      const result = handleStart()
      expect(result).toBeGreaterThan(0)
      expect(mockAppendFileSync).not.toHaveBeenCalled()
    })
  })

  describe('handleFinish', () => {
    it('exits with error if environment is not set', () => {
      delete process.env.DORA_ENV
      expect(() => handleFinish()).toThrow('process.exit(1)')
    })

    it('skips when no services are found', () => {
      process.env.DORA_ENV = 'dev'
      delete process.env.DORA_SERVICES
      process.env.DORA_DATA_FILE = '/nonexistent.json'
      mockExistsSync.mockReturnValue(false)

      const result = handleFinish()
      expect(result).toEqual({ sent: 0, services: [] })
    })
  })
})
