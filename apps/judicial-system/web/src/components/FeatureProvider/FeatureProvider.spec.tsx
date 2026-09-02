import { useContext } from 'react'
import { render, screen, waitFor } from '@testing-library/react'

import { Feature } from '@island.is/judicial-system/types'
import { getFeature } from '@island.is/judicial-system-web/src/services/api'

import FeatureProvider, { FeatureContext } from './FeatureProvider'

jest.mock('@island.is/judicial-system-web/src/services/api', () => ({
  getFeature: jest.fn(),
}))

const mockGetFeature = getFeature as jest.MockedFunction<typeof getFeature>

const Consumer = () => {
  const { features, isLoading } = useContext(FeatureContext)

  return (
    <>
      <span data-testid="loading">{isLoading ? 'loading' : 'loaded'}</span>
      <span data-testid="features">{features.join(',')}</span>
    </>
  )
}

const renderProvider = () =>
  render(
    <FeatureProvider>
      <Consumer />
    </FeatureProvider>,
  )

describe('FeatureProvider', () => {
  beforeEach(() => {
    mockGetFeature.mockReset()
  })

  it('should report loading, with no features, until the features have been fetched', async () => {
    let resolveFeature: (provided: boolean) => void = () => undefined
    mockGetFeature.mockReturnValue(
      new Promise<boolean>((resolve) => {
        resolveFeature = resolve
      }),
    )

    renderProvider()

    expect(screen.getByTestId('loading')).toHaveTextContent('loading')
    expect(screen.getByTestId('features')).toHaveTextContent('')

    resolveFeature(true)

    await waitFor(() =>
      expect(screen.getByTestId('loading')).toHaveTextContent('loaded'),
    )
  })

  it('should provide the features the api does not hide', async () => {
    mockGetFeature.mockResolvedValue(true)

    renderProvider()

    await waitFor(() =>
      expect(screen.getByTestId('loading')).toHaveTextContent('loaded'),
    )
    expect(screen.getByTestId('features')).toHaveTextContent(
      Feature.INDICTMENT_APPEAL,
    )
    expect(mockGetFeature).toHaveBeenCalledWith(Feature.INDICTMENT_APPEAL)
  })

  it('should not provide the features the api hides', async () => {
    mockGetFeature.mockResolvedValue(false)

    renderProvider()

    await waitFor(() =>
      expect(screen.getByTestId('loading')).toHaveTextContent('loaded'),
    )
    expect(screen.getByTestId('features')).toHaveTextContent('')
  })

  it('should treat a feature whose request fails as hidden and still finish loading', async () => {
    mockGetFeature.mockRejectedValue(new Error('network'))

    renderProvider()

    await waitFor(() =>
      expect(screen.getByTestId('loading')).toHaveTextContent('loaded'),
    )
    expect(screen.getByTestId('features')).toHaveTextContent('')
  })
})
