/**
 * The batching in useDraftQueries is not a tidiness preference, it is the point
 * of the hook: updateApplicationExternalData is a read-modify-write of the whole
 * externalData column (the runner snapshots it before the providers run and
 * writes `{...snapshot, ...results}` after, with no row lock), so two
 * overlapping calls both merge onto the same snapshot and the later write drops
 * the earlier one's key. A screen issuing one mutation per key raced itself on
 * every mount.
 *
 * These tests therefore assert the mutation COUNT and the providers carried in
 * it — the part that reading the returned content cannot check.
 */
import { render, waitFor } from '@testing-library/react'
import type { Application } from '@island.is/application/types'
import { useDraftQueries, type DraftQueriesResult } from './useDraftQuery'

// Must be `mock`-prefixed to be usable inside a hoisted jest.mock factory.
const mockMutate = jest.fn()

// Only useMutation is replaced: @island.is/application/graphql builds an
// HttpLink at module load, so the rest of the module has to stay real.
jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useMutation: () => [mockMutate, { loading: false }],
}))

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({ lang: 'is', formatMessage: (m: unknown) => String(m) }),
}))

type Contents = {
  draftOutlierGroups: { groups: { id: string }[] }
  draftEmployees: { employees: { id: string }[] }
  draftRoles: { roles: { id: string }[] }
}

const application = {
  id: 'app-1',
  externalData: {
    draftEmployees: {
      status: 'success',
      data: { employees: [{ id: 'persisted' }] },
    },
  },
} as unknown as Application

const spec = {
  draftOutlierGroups: 'listDraftOutlierGroups',
  draftEmployees: 'listDraftEmployees',
  draftRoles: 'listDraftRoles',
}

const response = {
  data: {
    updateApplicationExternalData: {
      externalData: {
        draftOutlierGroups: { status: 'success', data: { groups: [] } },
        draftEmployees: { status: 'success', data: { employees: [] } },
        draftRoles: { status: 'success', data: { roles: [] } },
      },
    },
  },
}

let observed: DraftQueriesResult<Contents> | null = null

const Screen = ({ enabled }: { enabled: boolean }) => {
  observed = useDraftQueries<Contents>(application, spec, { enabled })
  return null
}

const dataProvidersOfCall = (index: number) =>
  mockMutate.mock.calls[index][0].variables.input.dataProviders

describe('useDraftQueries', () => {
  beforeEach(() => {
    mockMutate.mockReset()
    mockMutate.mockResolvedValue(response)
    observed = null
  })

  it('reads three keys with a single mutation', async () => {
    render(<Screen enabled />)

    await waitFor(() => expect(observed?.loading).toBe(false))

    expect(mockMutate).toHaveBeenCalledTimes(1)
    // Same order for all three, so the runner resolves them in one Promise.all.
    expect(dataProvidersOfCall(0)).toEqual([
      { actionId: 'listDraftOutlierGroups', order: 0 },
      { actionId: 'listDraftEmployees', order: 0 },
      { actionId: 'listDraftRoles', order: 0 },
    ])
  })

  it('exposes every key from that one response', async () => {
    render(<Screen enabled />)

    await waitFor(() => expect(observed?.loading).toBe(false))

    expect(observed?.contents).toEqual({
      draftOutlierGroups: { groups: [] },
      draftEmployees: { employees: [] },
      draftRoles: { roles: [] },
    })
    expect(observed?.hasError).toBe(false)
  })

  it('fails the group when one leg fails', async () => {
    mockMutate.mockResolvedValue({
      data: {
        updateApplicationExternalData: {
          externalData: {
            ...response.data.updateApplicationExternalData.externalData,
            draftRoles: { status: 'failure', reason: 'Tímamörk' },
          },
        },
      },
    })

    render(<Screen enabled />)

    await waitFor(() => expect(observed?.loading).toBe(false))

    expect(observed?.hasError).toBe(true)
    // The legs that did land are still exposed.
    expect(observed?.contents.draftEmployees).toEqual({ employees: [] })
  })

  it('fetches nothing when disabled, falling back to the persisted snapshot', async () => {
    render(<Screen enabled={false} />)

    await waitFor(() => expect(observed?.loading).toBe(false))

    expect(mockMutate).not.toHaveBeenCalled()
    // Only the key the application actually carries — the other two were never
    // persisted, so they stay absent rather than becoming empty objects.
    expect(observed?.contents).toEqual({
      draftEmployees: { employees: [{ id: 'persisted' }] },
    })
  })

  it('refetches the whole group in one mutation', async () => {
    render(<Screen enabled />)
    await waitFor(() => expect(observed?.loading).toBe(false))

    await observed?.refetch({ silent: true })

    expect(mockMutate).toHaveBeenCalledTimes(2)
    expect(dataProvidersOfCall(1)).toHaveLength(3)
  })
})
