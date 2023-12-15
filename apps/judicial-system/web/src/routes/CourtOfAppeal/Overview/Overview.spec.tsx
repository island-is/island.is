import React from 'react'
import faker from 'faker'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen, within } from '@testing-library/react'

import { CaseState } from '@island.is/judicial-system/types'
import {
  CaseOrigin,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  mockCase,
  mockTransitonCaseMutation,
} from '@island.is/judicial-system-web/src/utils/mocks'
import {
  FormContextWrapper,
  IntlProviderWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import Overview from './Overview'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '',
    }
  },
}))

window.scrollTo = jest.fn()

describe('Overview', () => {
  it('should show a warning alert that indicates that the prosecutor requests the court of appeal ruling be not published, if the prosecutor requested it', async () => {
    const caseId = faker.datatype.uuid()

    render(
      <MockedProvider
        mocks={mockTransitonCaseMutation(caseId)}
        addTypename={false}
      >
        <IntlProviderWrapper>
          <FormContextWrapper
            theCase={{
              ...mockCase(CaseType.CUSTODY),
              requestAppealRulingNotToBePublished: true,
            }}
          >
            <Overview />
          </FormContextWrapper>
        </IntlProviderWrapper>
      </MockedProvider>,
    )

    expect(
      screen.getByTestId('requestAppealRulingNotToBePublished'),
    ).toBeInTheDocument()
  })
})
