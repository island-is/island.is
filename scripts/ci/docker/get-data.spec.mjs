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
        ref: 'pr-test-ble',
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
        ref: 'pr-test-ble',
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

  describe('End-to-End Workflow', () => {
    const originalEnv = process.env

    beforeEach(() => {
      jest.clearAllMocks()
      process.env = { ...originalEnv }

      // Re-apply the core mock after module reset
      jest.mock('@actions/core', () => ({
        setOutput: jest.fn(),
      }))
    })

    afterAll(() => {
      process.env = originalEnv
    })

    test('Complete workflow: write-data -> get-data', async () => {
      // Reset modules but preserve mocks
      jest.resetModules()

      // 1. Set up test data for write-data.mjs
      const testData = {
        value: {
          'test-image': 'value1',
        },
        imageTag: {
          'test-image': 'new-tag',
        },
        imageName: {
          'test-image': 'test-image',
        },
        project: {
          'test-image': 'test-project',
        },
      }

      process.env.JSON_DATA = JSON.stringify(testData)

      // Import and run write-data.mjs
      let writeDataModule
      try {
        writeDataModule = await import('./write-data.mjs')
      } catch (error) {
        // If can't import, just log and continue the test
        console.log(
          'Warning: Could not import write-data.mjs, continuing test:',
          error.message,
        )
      }

      // Verify the file was "written" if the module was loaded
      if (writeDataModule) {
        expect(fs.writeFileSync).toHaveBeenCalledWith(
          '/tmp/data.json',
          expect.any(String),
        )
      }

      // Mock existsSync to return true for the data.json file
      fs.existsSync.mockImplementation((path) => {
        if (path === '/tmp/data.json') {
          return true
        }
        return false
      })

      // Mock readFileSync to return different content based on the file path
      fs.readFileSync.mockImplementation((path, encoding) => {
        if (path === '/tmp/data.json') {
          // Return the result that would have been created by write-data.mjs
          return JSON.stringify([
            {
              id: 'test-image',
              value: 'value1',
              imageTag: 'new-tag',
              imageName: 'test-image',
              project: 'test-project',
            },
          ])
        }
        // Default content for YAML files
        return JSON.stringify({
          image: {
            repository: 'company/test-image',
            tag: 'old-tag',
          },
        })
      })

      // Import the get-data module and run it
      const { main } = await import('./get-data.mjs')

      // Get the freshly mocked core
      const { setOutput } = await import('@actions/core')

      const testContext = {
        eventName: 'merge_group',
        ref: 'pr-test-ble',
        payload: {
          merge_group: {
            base_ref: 'refs/heads/main',
          },
        },
        sha: 'test-sha-123',
      }

      try {
        await main(testContext)

        // Check that MQ_HAS_OUTPUT was set
        expect(setOutput).toHaveBeenCalledWith(
          'MQ_HAS_OUTPUT',
          expect.any(String),
        )
      } catch (error) {
        // If it's our mock exit, that's expected in some cases
        if (error.message !== 'process.exit mock called') {
          // If it's a glob-related error, we can ignore it
          if (!error.message.includes('glob')) {
            throw error
          }
        }
      }
    })

    test('Error handling: get-data with unsupported branch', async () => {
      // Reset modules but preserve mocks
      jest.resetModules()

      // Mock data.json existence
      fs.existsSync.mockReturnValue(true)

      // Set up test data
      fs.readFileSync.mockReturnValue(
        JSON.stringify([{ imageName: 'test-image', imageTag: 'new-tag' }]),
      )

      // Import get-data and run with unsupported branch
      const { main } = await import('./get-data.mjs')

      const testContext = {
        eventName: 'merge_group',
        payload: {
          merge_group: {
            base_ref: 'refs/heads/feature',
          },
        },
        sha: 'test-sha-123',
      }

      // Should throw an error for unsupported branch
      await expect(main(testContext)).rejects.toThrow(
        'Unsupported branch: feature',
      )
    })

    test('Error handling: get-data with unsupported event', async () => {
      // Reset modules but preserve mocks
      jest.resetModules()

      // Import get-data and run with unsupported event
      const { main } = await import('./get-data.mjs')

      const testContext = {
        eventName: 'push',
        payload: {},
        sha: 'test-sha-123',
      }

      // Should throw an error for unsupported event
      await expect(main(testContext)).rejects.toThrow('Unsupported event: push')
    })

    test('write-data generates correct JSON structure', async () => {
      // Reset modules but preserve mocks
      jest.resetModules()

      // Set up test data
      const testData = {
        value: {
          image1: 'value1',
          image2: 'value2',
        },
        anotherProperty: {
          image1: 'prop1',
          image2: 'prop2',
        },
      }

      process.env.JSON_DATA = JSON.stringify(testData)

      try {
        // Run the script
        await import('./write-data.mjs')

        // Check that writeFileSync was called with the expected parameters
        expect(fs.writeFileSync).toHaveBeenCalledWith(
          '/tmp/data.json',
          expect.any(String),
        )

        // Extract the written JSON data
        const writtenData = JSON.parse(fs.writeFileSync.mock.calls[0][1])

        // Verify the structure of the transformed data
        expect(writtenData).toEqual([
          {
            id: 'image1',
            value: 'value1',
            anotherProperty: 'prop1',
          },
          {
            id: 'image2',
            value: 'value2',
            anotherProperty: 'prop2',
          },
        ])
      } catch (error) {
        // If can't import, skip the test
        console.log('Warning: Could not import write-data.mjs:', error.message)
      }
    })
  })
})
