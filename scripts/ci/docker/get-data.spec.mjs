import { jest } from '@jest/globals'
import * as core from '@actions/core'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'url'
import { getBranch, getTypeOfDeployment } from './get-data.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Mock core module
jest.mock('@actions/core', () => ({
  setOutput: jest.fn(),
}))

// Mock glob module with a simple implementation
jest.mock('glob', () => ({
  glob: jest.fn(() => Promise.resolve([])),
}))

// Mock fs operations
jest.spyOn(fs, 'existsSync').mockReturnValue(false)
jest.spyOn(fs, 'readFileSync').mockReturnValue('[]')
jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {})

// Mock const.mjs
jest.mock('./const.mjs', () => ({
  MAIN_BRANCHES: ['main'],
  RELEASE_BRANCHES: ['release'],
}))

describe('get-data script functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getBranch function', () => {
    test('returns the branch name from merge_group event', () => {
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

    test('throws error for unsupported event', () => {
      const mockContext = {
        eventName: 'push',
        payload: {},
      }

      expect(() => getBranch(mockContext)).toThrow('Unsupported event: push')
    })
  })

  describe('getTypeOfDeployment function', () => {
    test('returns dev configuration for main branch', () => {
      const result = getTypeOfDeployment('main')

      expect(result.dev).toBe(true)
      expect(result.staging).toBe(false)
      expect(result.prod).toBe(false)
    })

    test('returns staging and prod configuration for release branch', () => {
      const result = getTypeOfDeployment('release')

      expect(result.dev).toBe(false)
      expect(result.staging).toBe(true)
      expect(result.prod).toBe(true)
    })

    test('throws error for unsupported branch', () => {
      expect(() => getTypeOfDeployment('feature')).toThrow(
        'Unsupported branch: feature',
      )
    })
  })
})
