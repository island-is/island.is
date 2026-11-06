import { act, renderHook } from '@testing-library/react'

import type { Lawyer } from '@island.is/judicial-system/types'

import { useGetLawyers } from '../useLawyers/useLawyers'
import { Database, useLawyerRegistry } from './useLawyerRegistry'

jest.mock('../useLawyers/useLawyers', () => ({
  useGetLawyers: jest.fn(),
}))

const fetchedLawyer: Lawyer = {
  id: 'row-fetched',
  name: 'Prufa Prufudóttir',
  practice: '',
  email: '',
  phoneNr: '0000001',
  nationalId: '0000000001',
  isLitigator: true,
}

const cachedLawyer: Lawyer = {
  id: 'row-cached',
  name: 'Þórður Prufuson',
  practice: '',
  email: '',
  phoneNr: '0000002',
  nationalId: '0000000002',
  isLitigator: false,
}

// A hand-rolled stand-in for window.indexedDB that lets each test drive the
// open request and the getAll request by firing their event handlers.
type FakeOpenRequest = IDBOpenDBRequest & { result: FakeDb }
type FakeDb = {
  close: jest.Mock
  onversionchange?: () => void
  transaction: jest.Mock
}

const setupIndexedDB = (records: (Lawyer & { created: Date })[] = []) => {
  const getAllRequest = { result: records } as unknown as IDBRequest & {
    onsuccess?: () => void
    onerror?: () => void
  }
  const store = {
    getAll: jest.fn(() => getAllRequest),
    clear: jest.fn(),
    put: jest.fn(),
  }
  const transaction = {
    objectStore: jest.fn(() => store),
  } as unknown as IDBTransaction & { oncomplete?: () => void }
  const db: FakeDb = {
    close: jest.fn(),
    transaction: jest.fn(() => transaction),
  }
  // Every open() call gets its own request, as in the browser.
  const openRequests: FakeOpenRequest[] = []

  Object.defineProperty(window, 'indexedDB', {
    configurable: true,
    value: {
      open: jest.fn(() => {
        const openRequest = { result: db } as unknown as FakeOpenRequest
        openRequests.push(openRequest)
        return openRequest
      }),
    },
  })

  return { openRequests, db, transaction, getAllRequest, store }
}

const mockUseGetLawyers = useGetLawyers as jest.Mock
const fetchedLawyers = [fetchedLawyer]
const noLawyers: Lawyer[] = []

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => undefined)
  jest.spyOn(console, 'warn').mockImplementation(() => undefined)
  jest.spyOn(console, 'error').mockImplementation(() => undefined)
  // Like the real hook, return stable array references across renders.
  mockUseGetLawyers.mockImplementation((shouldFetch: boolean) =>
    shouldFetch ? fetchedLawyers : noLawyers,
  )
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('useLawyerRegistry', () => {
  it('fetches from the API when the IndexedDB upgrade is blocked by another tab', async () => {
    const { openRequests, db } = setupIndexedDB()
    const { result } = renderHook(() => useLawyerRegistry(true))

    expect(mockUseGetLawyers).toHaveBeenLastCalledWith(false)

    await act(async () => {
      openRequests[0].onblocked?.(new Event('blocked') as IDBVersionChangeEvent)
    })

    expect(mockUseGetLawyers).toHaveBeenLastCalledWith(true)
    expect(result.current.allLawyers).toEqual([fetchedLawyer])

    // The blocked request eventually succeeds once the other tab closes; that
    // late connection is not used and must not stay open.
    await act(async () => {
      openRequests[0].onsuccess?.(new Event('success'))
    })

    expect(db.close).toHaveBeenCalled()
  })

  it('fetches from the API when IndexedDB cannot be opened', async () => {
    const { openRequests } = setupIndexedDB()
    const { result } = renderHook(() => useLawyerRegistry(true))

    await act(async () => {
      openRequests[0].onerror?.(new Event('error'))
    })

    expect(mockUseGetLawyers).toHaveBeenLastCalledWith(true)
    expect(result.current.allLawyers).toEqual([fetchedLawyer])
  })

  it('uses a fresh cache without fetching and closes the connection', async () => {
    const { openRequests, db, transaction, getAllRequest } = setupIndexedDB([
      { ...cachedLawyer, created: new Date() },
    ])
    const { result } = renderHook(() => useLawyerRegistry(true))

    await act(async () => {
      openRequests[0].onsuccess?.(new Event('success'))
    })
    await act(async () => {
      getAllRequest.onsuccess?.()
      transaction.oncomplete?.()
    })

    expect(mockUseGetLawyers).toHaveBeenLastCalledWith(false)
    expect(result.current.allLawyers).toEqual([
      { ...cachedLawyer, created: expect.any(Date) },
    ])
    expect(db.close).toHaveBeenCalled()
    expect(db.onversionchange).toBeDefined()
  })

  it('refreshes a stale cache from the API', async () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
    const { openRequests, getAllRequest, store } = setupIndexedDB([
      { ...cachedLawyer, created: twoHoursAgo },
    ])
    const { result } = renderHook(() => useLawyerRegistry(true))

    await act(async () => {
      openRequests[0].onsuccess?.(new Event('success'))
    })
    await act(async () => {
      getAllRequest.onsuccess?.()
    })

    expect(mockUseGetLawyers).toHaveBeenLastCalledWith(true)
    expect(result.current.allLawyers).toEqual([fetchedLawyer])

    // The refresh opens a second connection and rewrites the store.
    expect(openRequests).toHaveLength(2)

    await act(async () => {
      openRequests[1].onsuccess?.(new Event('success'))
    })

    expect(store.clear).toHaveBeenCalled()
    expect(store.put).toHaveBeenCalledWith({
      ...fetchedLawyer,
      created: expect.any(Date),
    })
  })

  it('does nothing until asked to fetch', () => {
    const { openRequests } = setupIndexedDB()
    renderHook(() => useLawyerRegistry(false))

    expect(window.indexedDB.open).not.toHaveBeenCalled()
    expect(openRequests).toHaveLength(0)
    expect(Database.version).toBe(6)
  })
})
