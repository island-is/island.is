import { jest } from '@jest/globals'
import {
  parseCodeowners,
  buildServiceDefinition,
  upsertServiceDefinition,
} from './sync-codeowners.mjs'

describe('sync-codeowners', () => {
  describe('parseCodeowners', () => {
    it('extracts top-level app with single team', () => {
      const content = '/apps/download-service/  @island-is/hugsmidjan'
      const result = parseCodeowners(content)
      expect(result.get('download-service')).toEqual(['hugsmidjan'])
    })

    it('extracts top-level app with multiple teams', () => {
      const content = '/apps/web*/  @island-is/juni @island-is/stefna'
      // web* contains a glob which won't match our strict regex
      // but /apps/web/ should work:
      const content2 = '/apps/web/  @island-is/juni @island-is/stefna'
      const result = parseCodeowners(content2)
      expect(result.get('web')).toEqual(['juni', 'stefna'])
    })

    it('extracts nested app (2 levels) using leaf name', () => {
      const content = '/apps/services/endorsements/  @island-is/juni'
      const result = parseCodeowners(content)
      expect(result.get('endorsements')).toEqual(['juni'])
    })

    it('skips paths deeper than 2 levels under /apps/', () => {
      const content =
        '/apps/web/screens/PetitionView/  @island-is/juni'
      const result = parseCodeowners(content)
      expect(result.size).toBe(0)
    })

    it('skips comment lines', () => {
      const content = '# /apps/download-service/  @island-is/devops'
      const result = parseCodeowners(content)
      expect(result.size).toBe(0)
    })

    it('skips empty lines', () => {
      const content = '\n\n  \n'
      const result = parseCodeowners(content)
      expect(result.size).toBe(0)
    })

    it('skips lines without @island-is/ teams', () => {
      const content = '/apps/download-service/  @some-other-org/team'
      const result = parseCodeowners(content)
      expect(result.size).toBe(0)
    })

    it('skips non-app paths', () => {
      const content = '/libs/api/domains/identity/  @island-is/core'
      const result = parseCodeowners(content)
      expect(result.size).toBe(0)
    })

    it('last match wins (CODEOWNERS precedence)', () => {
      const content = [
        '/apps/download-service/  @island-is/core',
        '/apps/download-service/  @island-is/hugsmidjan',
      ].join('\n')
      const result = parseCodeowners(content)
      expect(result.get('download-service')).toEqual(['hugsmidjan'])
    })

    it('handles path without trailing slash', () => {
      const content = '/apps/payments  @island-is/aranja'
      const result = parseCodeowners(content)
      expect(result.get('payments')).toEqual(['aranja'])
    })

    it('handles multiple apps in one file', () => {
      const content = [
        '/apps/api/  @island-is/core',
        '/apps/download-service/  @island-is/hugsmidjan',
        '/apps/judicial-system/  @island-is/kolibri-justice-league',
      ].join('\n')
      const result = parseCodeowners(content)
      expect(result.size).toBe(3)
      expect(result.get('api')).toEqual(['core'])
      expect(result.get('download-service')).toEqual(['hugsmidjan'])
      expect(result.get('judicial-system')).toEqual(['kolibri-justice-league'])
    })

    it('handles mixed content (comments, blanks, non-app paths, app paths)', () => {
      const content = [
        '# Top level ownership',
        '',
        '/libs/shared/  @island-is/core',
        '/apps/application-system/  @island-is/norda',
        '# Edge case',
        '/apps/services/endorsements/  @island-is/juni',
        '/apps/web/screens/deep/nested/  @island-is/stefna',
      ].join('\n')
      const result = parseCodeowners(content)
      expect(result.size).toBe(2)
      expect(result.get('application-system')).toEqual(['norda'])
      expect(result.get('endorsements')).toEqual(['juni'])
    })
  })

  describe('buildServiceDefinition', () => {
    it('builds definition with single team', () => {
      const result = buildServiceDefinition('api', ['core'])
      expect(result).toEqual({
        'schema-version': 'v2.2',
        'dd-service': 'api',
        team: 'core',
      })
    })

    it('uses last team as primary when multiple teams', () => {
      const result = buildServiceDefinition('web', ['juni', 'stefna'])
      expect(result.team).toBe('stefna')
    })

    it('adds additional teams as contacts', () => {
      const result = buildServiceDefinition('web', ['juni', 'stefna'])
      expect(result.contacts).toEqual([
        { name: 'juni', type: 'email', contact: 'juni@island.is' },
      ])
    })

    it('does not add contacts for single team', () => {
      const result = buildServiceDefinition('api', ['core'])
      expect(result.contacts).toBeUndefined()
    })

    it('handles three teams', () => {
      const result = buildServiceDefinition('web', ['a', 'b', 'c'])
      expect(result.team).toBe('c')
      expect(result.contacts).toEqual([
        { name: 'a', type: 'email', contact: 'a@island.is' },
        { name: 'b', type: 'email', contact: 'b@island.is' },
      ])
    })
  })

  describe('upsertServiceDefinition', () => {
    it('calls Datadog API with correct URL and headers', async () => {
      const mockResponse = { ok: true, json: () => Promise.resolve({ data: {} }) }
      const mockFetch = jest.fn(() => Promise.resolve(mockResponse))
      globalThis.fetch = mockFetch

      const definition = {
        'schema-version': 'v2.2',
        'dd-service': 'test-service',
        team: 'devops',
      }

      await upsertServiceDefinition(definition, {
        apiKey: 'test-api-key',
        appKey: 'test-app-key',
        site: 'datadoghq.eu',
      })

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.datadoghq.eu/api/v2/services/definitions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'DD-API-KEY': 'test-api-key',
            'DD-APPLICATION-KEY': 'test-app-key',
          },
          body: JSON.stringify(definition),
        },
      )
    })

    it('throws on non-ok response', async () => {
      globalThis.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          text: () => Promise.resolve('Bad Request'),
        }),
      )

      const definition = {
        'schema-version': 'v2.2',
        'dd-service': 'test-service',
        team: 'devops',
      }

      await expect(
        upsertServiceDefinition(definition, {
          apiKey: 'k',
          appKey: 'k',
          site: 'datadoghq.eu',
        }),
      ).rejects.toThrow('Failed to upsert test-service: 400 Bad Request')
    })
  })
})
