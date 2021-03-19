/* eslint-disable @typescript-eslint/no-var-requires */

const ENVIRONMENTS_PATH = '../../../../environments'

describe('validate-template', () => {
  describe('isTemplateReady', () => {
    beforeEach(() => {
      jest.resetModules()
    })

    it('should be ready if not running a production build regardless of readyForProduction flag', () => {
      const environmentsToCheck = ['local', 'dev', 'staging', 'production']

      for (const environment of environmentsToCheck) {
        jest.resetModules()
        jest.mock(ENVIRONMENTS_PATH, () => ({
          environment: {
            production: false,
            name: environment,
          },
        }))

        const { isTemplateReady } = require('./validationUtils')

        expect(isTemplateReady({ readyForProduction: false })).toBe(true)
        expect(isTemplateReady({ readyForProduction: true })).toBe(true)
      }
    })

    it('should be ready if running a production build that is running on local/dev/staging environment regardless of readyForProduction flag', () => {
      const allowedEnvironments = ['local', 'dev', 'staging']

      for (const environment of allowedEnvironments) {
        jest.resetModules()
        jest.mock(ENVIRONMENTS_PATH, () => ({
          environment: {
            production: true,
            name: environment,
          },
        }))

        const { isTemplateReady } = require('./validationUtils')

        expect(isTemplateReady({ readyForProduction: false })).toBe(true)
        expect(isTemplateReady({ readyForProduction: true })).toBe(true)
      }
    })

    it('should not be ready if running a production build on production environment with readyForProduction=false', () => {
      jest.mock(ENVIRONMENTS_PATH, () => ({
        environment: {
          production: true,
          name: 'production',
        },
      }))

      const { isTemplateReady } = require('./validationUtils')

      expect(isTemplateReady({ readyForProduction: false })).toBe(false)
      expect(isTemplateReady({ readyForProduction: true })).toBe(true)
    })

    it('should be ready if running a production build on production environment with readyForProduction=true', () => {
      jest.mock(ENVIRONMENTS_PATH, () => ({
        environment: {
          production: true,
          name: 'production',
        },
      }))

      const { isTemplateReady } = require('./validationUtils')

      expect(isTemplateReady({ readyForProduction: true })).toBe(true)
      expect(isTemplateReady({ readyForProduction: false })).toBe(false)
    })
  })
})
