import type { ExternalData } from '@island.is/application/types'
import {
  getSuccessfulExternalData,
  hasSuccessfulExternalData,
} from './externalDataUtils'

type PlotDetailsData = {
  soilType: string
}

const isPlotDetailsData = (data: unknown): data is PlotDetailsData => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof (data as { soilType?: unknown }).soilType === 'string'
  )
}

describe('externalDataUtils', () => {
  const externalData = {
    getPlotDetails: {
      status: 'success',
      date: new Date(),
      data: { soilType: 'Sandy' },
    },
    failedPlotDetails: {
      status: 'failure',
      date: new Date(),
      data: { soilType: 'Sandy' },
    },
    malformedPlotDetails: {
      status: 'success',
      date: new Date(),
      data: {},
    },
  } satisfies ExternalData

  it('returns typed data for successful external data with a valid payload', () => {
    expect(
      getSuccessfulExternalData(
        externalData,
        'getPlotDetails',
        isPlotDetailsData,
      ),
    ).toEqual({ soilType: 'Sandy' })
  })

  it('returns undefined unless the entry succeeded and matches the payload guard', () => {
    expect(
      getSuccessfulExternalData(
        externalData,
        'failedPlotDetails',
        isPlotDetailsData,
      ),
    ).toBeUndefined()
    expect(
      getSuccessfulExternalData(
        externalData,
        'malformedPlotDetails',
        isPlotDetailsData,
      ),
    ).toBeUndefined()
    expect(
      getSuccessfulExternalData(externalData, 'missing', isPlotDetailsData),
    ).toBeUndefined()
  })

  it('checks whether successful external data is available', () => {
    expect(
      hasSuccessfulExternalData(
        externalData,
        'getPlotDetails',
        isPlotDetailsData,
      ),
    ).toBe(true)
    expect(
      hasSuccessfulExternalData(
        externalData,
        'failedPlotDetails',
        isPlotDetailsData,
      ),
    ).toBe(false)
  })
})
