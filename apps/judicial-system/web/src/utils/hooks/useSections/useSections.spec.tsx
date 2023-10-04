import React from 'react'
import { IntlProvider } from 'react-intl'
import faker from 'faker'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { renderHook } from '@testing-library/react'

import {
  Case,
  CaseState,
  CaseType,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'
import { UserProvider } from '@island.is/judicial-system-web/src/components'
import { CaseOrigin } from '@island.is/judicial-system-web/src/graphql/schema'

import useSections from './index'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '',
    }
  },
}))

describe('useSections getSections', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wrapper = ({ children }: any) => (
    <IntlProvider locale="is" onError={jest.fn}>
      <ApolloProvider client={new ApolloClient({ cache: new InMemoryCache() })}>
        <UserProvider authenticated={true}>{children}</UserProvider>
      </ApolloProvider>
    </IntlProvider>
  )

  it('should return the correct sections for restriction cases in DRAFT state', () => {
    const { result } = renderHook(() => useSections(), { wrapper })
    const c: Case = {
      origin: CaseOrigin.RVG,
      type: CaseType.CUSTODY,
      created: faker.date.past().toISOString(),
      modified: faker.date.past().toISOString(),
      id: faker.datatype.uuid(),
      state: CaseState.DRAFT,
      policeCaseNumbers: [],
    }

    const u: User = {
      created: faker.date.past().toISOString(),
      modified: faker.date.past().toISOString(),
      id: faker.datatype.uuid(),
      nationalId: '0000000000',
      name: faker.name.firstName(),
      title: faker.name.jobType(),
      mobileNumber: faker.phone.phoneNumber(),
      role: UserRole.PROSECUTOR,
      email: faker.internet.email(),
      active: true,
      institution: {
        created: faker.date.past().toISOString(),
        modified: faker.date.past().toISOString(),
        id: faker.datatype.uuid(),
        name: faker.company.companyName(),
        active: true,
        type: InstitutionType.PROSECUTORS_OFFICE,
      },
    }

    expect(result.current.getSections(c, u)).toStrictEqual([
      {
        children: [
          {
            href: expect.any(String),
            name: expect.any(String),
            isActive: expect.any(Boolean),
          },
          {
            href: expect.any(String),
            name: expect.any(String),
            isActive: expect.any(Boolean),
            onClick: undefined,
          },
          {
            href: expect.any(String),
            name: expect.any(String),
            isActive: expect.any(Boolean),
            onClick: undefined,
          },
          {
            href: expect.any(String),
            name: expect.any(String),
            isActive: expect.any(Boolean),
            onClick: undefined,
          },
          {
            href: expect.any(String),
            name: expect.any(String),
            isActive: expect.any(Boolean),
            onClick: undefined,
          },
          {
            href: expect.any(String),
            name: expect.any(String),
            isActive: expect.any(Boolean),
            onClick: undefined,
          },
        ],
        isActive: expect.any(Boolean),
        name: expect.any(String),
      },
      {
        children: [],
        isActive: false,
        name: 'Úrskurður Héraðsdóms',
      },
      { children: [], isActive: false, name: 'Niðurstaða' },
    ])
  })
})
