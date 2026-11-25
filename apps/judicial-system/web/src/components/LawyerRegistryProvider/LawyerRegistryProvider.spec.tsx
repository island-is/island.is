import { useContext } from 'react'
import { renderHook } from '@testing-library/react'

import { UserRole } from '@island.is/judicial-system-web/src/graphql/schema'
import { UserContextWrapper } from '@island.is/judicial-system-web/src/utils/testHelpers'

import {
  LawyerRegistryContext,
  LawyerRegistryProvider,
} from './LawyerRegistryProvider'

const mockUseLawyerRegistry = jest.fn()

jest.mock(
  '@island.is/judicial-system-web/src/utils/hooks/useLawyerRegistry/useLawyerRegistry',
  () => ({
    useLawyerRegistry: (shouldFetch: boolean) => {
      mockUseLawyerRegistry(shouldFetch)

      return { allLawyers: [] }
    },
  }),
)

const fetchesFor = (userRole: UserRole): boolean => {
  mockUseLawyerRegistry.mockClear()

  renderHook(() => useContext(LawyerRegistryContext), {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    wrapper: ({ children }: any) => (
      <UserContextWrapper userRole={userRole}>
        <LawyerRegistryProvider>{children}</LawyerRegistryProvider>
      </UserContextWrapper>
    ),
  })

  return mockUseLawyerRegistry.mock.calls[0][0]
}

describe('LawyerRegistryProvider', () => {
  // Without the register every lookup answers that the lawyer is not on it,
  // which is indistinguishable from the lawyer genuinely not being there.
  it('fetches the register for everyone who has to name a lawyer', () => {
    expect(fetchesFor(UserRole.DISTRICT_COURT_JUDGE)).toBe(true)
    expect(fetchesFor(UserRole.COURT_OF_APPEALS_JUDGE)).toBe(true)
    expect(fetchesFor(UserRole.COURT_OF_APPEALS_REGISTRAR)).toBe(true)
    expect(fetchesFor(UserRole.COURT_OF_APPEALS_ASSISTANT)).toBe(true)
    expect(fetchesFor(UserRole.DEFENDER)).toBe(true)
    expect(fetchesFor(UserRole.PROSECUTOR)).toBe(true)
    expect(fetchesFor(UserRole.PUBLIC_PROSECUTOR_STAFF)).toBe(true)
  })

  it('leaves it alone for users who never name one', () => {
    expect(fetchesFor(UserRole.PRISON_SYSTEM_STAFF)).toBe(false)
  })
})
