import React from 'react'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'

import {
  CaseAppealState,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { mockCase } from '@island.is/judicial-system-web/src/utils/mocks'
import {
  FormContextWrapper,
  IntlProviderWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import RequestAppealRulingNotToBePublishedCheckbox from './RequestAppealRulingNotToBePublishedCheckbox'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '',
    }
  },
}))

describe('RequestAppealRulingNotToBePublishedCheckbox', () => {
  it('should show a warning alert that indicates that the prosecutor requests the court of appeal ruling be not published, if the prosecutor requested it', async () => {
    render(
      <FormContextWrapper
        theCase={{
          ...mockCase(CaseType.CUSTODY),
          appealState: CaseAppealState.COMPLETED,
        }}
      >
        <MockedProvider addTypename={false}>
          <IntlProviderWrapper>
            <RequestAppealRulingNotToBePublishedCheckbox />
          </IntlProviderWrapper>
        </MockedProvider>
      </FormContextWrapper>,
    )

    expect(screen.getByRole('checkbox')).toBeDisabled()
  })
})
