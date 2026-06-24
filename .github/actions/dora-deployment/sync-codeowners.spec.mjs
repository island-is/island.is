import { jest } from '@jest/globals'
import {
  parseCodeownersRules,
  resolveOwner,
  buildServiceDefinition,
  upsertServiceDefinition,
} from './sync-codeowners.mjs'

describe('sync-codeowners', () => {
  describe('parseCodeownersRules', () => {
    it('parses a simple rule', () => {
      const rules = parseCodeownersRules('/apps/api/  @island-is/core')
      expect(rules).toEqual([{ pattern: '/apps/api/', teams: ['core'] }])
    })

    it('parses multiple teams', () => {
      const rules = parseCodeownersRules(
        '/apps/web/  @island-is/juni @island-is/stefna',
      )
      expect(rules).toEqual([
        { pattern: '/apps/web/', teams: ['juni', 'stefna'] },
      ])
    })

    it('skips comments', () => {
      const rules = parseCodeownersRules('# /apps/api/  @island-is/core')
      expect(rules).toEqual([])
    })

    it('skips empty lines', () => {
      const rules = parseCodeownersRules('\n\n  \n')
      expect(rules).toEqual([])
    })

    it('skips lines without @island-is teams', () => {
      const rules = parseCodeownersRules('/apps/api/  @other-org/team')
      expect(rules).toEqual([])
    })

    it('handles wildcard patterns', () => {
      const rules = parseCodeownersRules('*  @island-is/core')
      expect(rules).toEqual([{ pattern: '*', teams: ['core'] }])
    })

    it('handles glob patterns', () => {
      const rules = parseCodeownersRules('**/infra/  @island-is/devops')
      expect(rules).toEqual([{ pattern: '**/infra/', teams: ['devops'] }])
    })

    it('parses multiple rules preserving order', () => {
      const content = [
        '*  @island-is/core',
        '/apps/api/  @island-is/norda',
        '/apps/web/  @island-is/stefna',
      ].join('\n')
      const rules = parseCodeownersRules(content)
      expect(rules).toHaveLength(3)
      expect(rules[0].teams).toEqual(['core'])
      expect(rules[1].teams).toEqual(['norda'])
      expect(rules[2].teams).toEqual(['stefna'])
    })
  })

  describe('resolveOwner', () => {
    const rules = parseCodeownersRules(
      [
        '*  @island-is/core',
        '/apps/judicial-system/  @island-is/kolibri-justice-league',
        '/apps/services/endorsements/  @island-is/juni',
        '/apps/download-service/  @island-is/hugsmidjan',
      ].join('\n'),
    )

    it('matches exact app path', () => {
      expect(resolveOwner('apps/download-service', rules)).toEqual([
        'hugsmidjan',
      ])
    })

    it('matches nested app under parent', () => {
      expect(resolveOwner('apps/judicial-system/api', rules)).toEqual([
        'kolibri-justice-league',
      ])
    })

    it('matches 2-level nested path', () => {
      expect(resolveOwner('apps/services/endorsements', rules)).toEqual([
        'juni',
      ])
    })

    it('falls back to catch-all wildcard', () => {
      expect(resolveOwner('apps/unknown-service', rules)).toEqual(['core'])
    })

    it('returns default team when no rules match', () => {
      expect(resolveOwner('apps/something', [])).toEqual(['core'])
    })

    it('last match wins', () => {
      const overrideRules = parseCodeownersRules(
        ['/apps/web/  @island-is/juni', '/apps/web/  @island-is/stefna'].join(
          '\n',
        ),
      )
      expect(resolveOwner('apps/web', overrideRules)).toEqual(['stefna'])
    })

    it('more specific path wins over general when ordered correctly', () => {
      const orderedRules = parseCodeownersRules(
        [
          '/apps/services/  @island-is/core',
          '/apps/services/endorsements/  @island-is/juni',
        ].join('\n'),
      )
      expect(resolveOwner('apps/services/endorsements', orderedRules)).toEqual([
        'juni',
      ])
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
  })

  describe('upsertServiceDefinition', () => {
    it('calls Datadog API with correct URL and headers', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ data: {} }),
      }
      globalThis.fetch = jest.fn(() => Promise.resolve(mockResponse))

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

      expect(globalThis.fetch).toHaveBeenCalledWith(
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

      await expect(
        upsertServiceDefinition(
          { 'schema-version': 'v2.2', 'dd-service': 'x', team: 'y' },
          { apiKey: 'k', appKey: 'k', site: 'datadoghq.eu' },
        ),
      ).rejects.toThrow('Failed to upsert x: 400 Bad Request')
    })
  })
})
