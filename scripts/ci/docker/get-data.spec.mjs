import { jest } from '@jest/globals'
import * as core from '@actions/core'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'url'
import { getBranch, getTypeOfDeployment } from './get-data.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Mock process.exit to prevent test termination
const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
  throw new Error('process.exit mock called')
})

// Mock console methods for cleaner test output
jest.spyOn(console, 'log').mockImplementation(() => {})
jest.spyOn(console, 'info').mockImplementation(() => {})
jest.spyOn(console, 'error').mockImplementation(() => {})

// Mock core module
jest.mock('@actions/core', () => ({
  setOutput: jest.fn(),
}))

// Mock fs operations
jest.spyOn(fs, 'existsSync').mockImplementation(() => false)
jest.spyOn(fs, 'readFileSync').mockImplementation(() => '[]')
jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {})
jest.spyOn(fs, 'mkdirSync').mockImplementation(() => {})

// Mock const.mjs
jest.mock('./const.mjs', () => ({
  MAIN_BRANCHES: ['main'],
  RELEASE_BRANCHES: ['release'],
}))

// Mock jsyaml
jest.mock('js-yaml', () => ({
  load: jest.fn((data) => {
    try {
      return JSON.parse(data)
    } catch (e) {
      return {}
    }
  }),
  dump: jest.fn((data) => JSON.stringify(data)),
}))

describe('get-data.mjs', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    mockExit.mockRestore()
    console.log.mockRestore()
    console.info.mockRestore()
    console.error.mockRestore()
  })

  describe('Function: getBranch', () => {
    test('extracts branch name from merge_group event', () => {
      const mockContext = {
        eventName: 'merge_group',
        payload: {
          merge_group: {
            base_ref: 'refs/heads/main',
          },
        },
      }

      const result = getBranch(mockContext)
      expect(result).toBe('main')
    })

    test('extracts branch name without refs/heads/ prefix', () => {
      const mockContext = {
        eventName: 'merge_group',
        payload: {
          merge_group: {
            base_ref: 'refs/heads/some-branch',
          },
        },
      }

      const result = getBranch(mockContext)
      expect(result).toBe('some-branch')
    })

    test('throws error for unsupported event types', () => {
      const eventTypes = ['push', 'pull_request', 'issue_comment', 'release']

      eventTypes.forEach((eventType) => {
        const mockContext = {
          eventName: eventType,
          payload: {},
        }

        expect(() => getBranch(mockContext)).toThrow(
          `Unsupported event: ${eventType}`,
        )
      })
    })

    test('handles missing context gracefully', () => {
      expect(() => getBranch()).toThrow('Unsupported event: undefined')
    })

    test('handles missing payload gracefully', () => {
      const mockContext = {
        eventName: 'merge_group',
        payload: undefined,
      }

      expect(() => getBranch(mockContext)).toThrow(TypeError)
    })
  })

  describe('Function: getTypeOfDeployment', () => {
    test('returns dev configuration for main branch', () => {
      const result = getTypeOfDeployment('main')

      expect(result).toEqual({
        dev: true,
        staging: false,
        prod: false,
      })
    })

    test('returns staging and prod configuration for release branch', () => {
      const result = getTypeOfDeployment('release')

      expect(result).toEqual({
        dev: false,
        staging: true,
        prod: true,
      })
    })

    test('throws error for unsupported branch', () => {
      const unsupportedBranches = [
        'feature',
        'develop',
        'hotfix',
        'random-branch',
      ]

      unsupportedBranches.forEach((branch) => {
        expect(() => getTypeOfDeployment(branch)).toThrow(
          `Unsupported branch: ${branch}`,
        )
      })
    })

    test('handles empty branch name', () => {
      expect(() => getTypeOfDeployment('')).toThrow('Unsupported branch: ')
    })

    test('handles undefined branch name', () => {
      expect(() => getTypeOfDeployment(undefined)).toThrow(
        'Unsupported branch: undefined',
      )
    })

    test('is case sensitive for branch names', () => {
      // Should throw error for 'Main' (uppercase M) since it doesn't match 'main'
      expect(() => getTypeOfDeployment('Main')).toThrow(
        'Unsupported branch: Main',
      )
    })
  })

  describe('Integration: main function', () => {
    let main

    beforeEach(async () => {
      jest.resetModules()
      const module = await import('./get-data.mjs')
      main = module.main
    })

    test('exits when data.json does not exist', async () => {
      const testContext = {
        eventName: 'merge_group',
        payload: {
          merge_group: {
            base_ref: 'refs/heads/main',
          },
        },
        sha: 'test-sha-123',
      }

      fs.existsSync.mockReturnValue(false)

      try {
        await main(testContext)
        // If we get here without process.exit being called, we should see MQ_HAS_OUTPUT = false
        expect(core.setOutput).toHaveBeenCalledWith('MQ_HAS_OUTPUT', 'false')
      } catch (error) {
        if (error.message === 'process.exit mock called') {
          expect(mockExit).toHaveBeenCalledWith(0)
        } else {
          throw error
        }
      }
    })

    test('sets MQ_HAS_OUTPUT to false when no files are changed', async () => {
      const testContext = {
        eventName: 'merge_group',
        payload: {
          merge_group: {
            base_ref: 'refs/heads/main',
          },
        },
        sha: 'test-sha-456',
      }

      // No data.json, so no files will be processed
      fs.existsSync.mockReturnValue(false)

      try {
        await main(testContext)
        expect(core.setOutput).toHaveBeenCalledWith('MQ_HAS_OUTPUT', 'false')
        expect(core.setOutput).not.toHaveBeenCalledWith(
          'MQ_CHANGED_FILES',
          expect.anything(),
        )
      } catch (error) {
        if (error.message !== 'process.exit mock called') {
          throw error
        }
      }
    })
  })

  describe('Error handling', () => {
    test('getBranch throws with descriptive error for unsupported events', () => {
      expect(() => getBranch({ eventName: 'random-event' })).toThrow(
        'Unsupported event: random-event',
      )
    })

    test('getTypeOfDeployment throws with descriptive error for unsupported branches', () => {
      expect(() => getTypeOfDeployment('random-branch')).toThrow(
        'Unsupported branch: random-branch',
      )
    })
  })

  describe('Branch configuration', () => {
    test('main branches are configured correctly', () => {
      const deployment = getTypeOfDeployment('main')
      expect(deployment.dev).toBe(true)
      expect(deployment.staging).toBe(false)
      expect(deployment.prod).toBe(false)
    })

    test('release branches are configured correctly', () => {
      const deployment = getTypeOfDeployment('release')
      expect(deployment.dev).toBe(false)
      expect(deployment.staging).toBe(true)
      expect(deployment.prod).toBe(true)
    })
  })

  describe('Input validation', () => {
    test('getBranch handles various context formats', () => {
      // Valid context
      const validContext = {
        eventName: 'merge_group',
        payload: {
          merge_group: {
            base_ref: 'refs/heads/main',
          },
        },
      }
      expect(getBranch(validContext)).toBe('main')

      // Invalid eventName
      expect(() => getBranch({ eventName: 'invalid' })).toThrow()

      // Missing payload
      expect(() => getBranch({ eventName: 'merge_group' })).toThrow()
    })
  })

  describe('Edge cases', () => {
    test('handles branch names with special characters', () => {
      // Special characters in branch name should still be extracted correctly
      const mockContext = {
        eventName: 'merge_group',
        payload: {
          merge_group: {
            base_ref: 'refs/heads/feature/special-branch-name',
          },
        },
      }

      // This should extract the branch name, but then throw because it's not a supported branch
      expect(() => getBranch(mockContext)).not.toThrow('Unsupported event')
      expect(() => {
        const branch = getBranch(mockContext)
        getTypeOfDeployment(branch)
      }).toThrow('Unsupported branch: feature/special-branch-name')
    })

    test('branch name extraction strips refs/heads/ prefix correctly', () => {
      const testCases = [
        { input: 'refs/heads/main', expected: 'main' },
        { input: 'refs/heads/release', expected: 'release' },
        { input: 'refs/heads/feature/test', expected: 'feature/test' },
        { input: 'refs/heads/', expected: '' },
      ]

      testCases.forEach(({ input, expected }) => {
        const mockContext = {
          eventName: 'merge_group',
          payload: {
            merge_group: {
              base_ref: input,
            },
          },
        }

        expect(getBranch(mockContext)).toBe(expected)
      })
    })
  })
})
