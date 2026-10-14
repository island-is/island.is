import { mock } from 'jest-mock-extended'
import { messages } from '@island.is/application/templates/financial-aid'
import { FetchError } from '@island.is/clients/middlewares'
import type { Logger } from '@island.is/logging'
import { TemplateApiError } from '@island.is/nest/problem'
import { ForIslandisApi } from '@island.is/clients/rvk-financial-aid'
import { fetchVeitaMunicipalitySettings } from './veitaMunicipalitySettings'

const params = { veitaTenant: 'reykjavik', municipalityCode: '0000' }
const context = { veitaTenant: 'reykjavik', municipalityCode: '0000' }

describe('fetchVeitaMunicipalitySettings', () => {
  const api = mock<ForIslandisApi>()
  const logger = mock<Logger>()

  beforeEach(() => jest.resetAllMocks())

  it('requests settings for the pinned tenant and maps them', async () => {
    api.getFinaidServiceSettingsForIslandis.mockResolvedValue({
      data: {
        municipalityCode: '0000',
        municipalityName: 'Reykjavík',
        isActive: true,
      },
    })

    const result = await fetchVeitaMunicipalitySettings(api, logger, params)

    expect(api.getFinaidServiceSettingsForIslandis).toHaveBeenCalledWith({
      xTenantIdentifier: 'reykjavik',
      xUserPermissions: 'financialaid:read',
      municipalityCode: '0000',
    })
    expect(result).toMatchObject({
      municipalityId: '0000',
      name: 'Reykjavík',
      active: true,
    })
    expect(logger.error).not.toHaveBeenCalled()
  })

  it('treats a 404 as an unregistered municipality and logs it', async () => {
    api.getFinaidServiceSettingsForIslandis.mockRejectedValue(
      await FetchError.buildMock({ status: 404 }),
    )

    await expect(
      fetchVeitaMunicipalitySettings(api, logger, params),
    ).resolves.toBeNull()
    expect(logger.error).toHaveBeenCalledWith(
      'Veita has no settings for municipality',
      context,
    )
  })

  it('treats missing settings data as an unregistered municipality', async () => {
    api.getFinaidServiceSettingsForIslandis.mockResolvedValue({})

    await expect(
      fetchVeitaMunicipalitySettings(api, logger, params),
    ).resolves.toBeNull()
    expect(logger.error).toHaveBeenCalledWith(
      'Veita returned no municipality settings',
      context,
    )
  })

  it.each([
    ['a server error', () => FetchError.buildMock({ status: 503 })],
    ['a network error', async () => new TypeError('fetch failed')],
  ])('throws a retryable Veita error for %s', async (_, buildError) => {
    const error = await buildError()
    api.getFinaidServiceSettingsForIslandis.mockRejectedValue(error)

    const result = fetchVeitaMunicipalitySettings(api, logger, params)

    await expect(result).rejects.toBeInstanceOf(TemplateApiError)
    await expect(result).rejects.toMatchObject(
      new TemplateApiError(
        {
          title: messages.serviceErrors.veita.title,
          summary: messages.serviceErrors.veita.summary,
        },
        500,
      ),
    )
    expect(logger.error).toHaveBeenCalledWith(
      'Error fetching Veita municipality settings',
      { ...context, error },
    )
  })
})
