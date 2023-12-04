import React from 'react'
import faker from 'faker'
import { MockedProvider } from '@apollo/client/testing'
import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { CaseState } from '@island.is/judicial-system/types'
import {
  CaseOrigin,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { mockTransitonCaseMutation } from '@island.is/judicial-system-web/src/utils/mocks'
import * as stepHelper from '@island.is/judicial-system-web/src/utils/stepHelper'
import {
  FormContextWrapper,
  IntlProviderWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import Summary from './Summary'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '',
    }
  },
}))

window.scrollTo = jest.fn()

describe('Summary', () => {
  it('should show a modal window when the appeal is completed', async () => {
    const caseId = faker.datatype.uuid()

    render(
      <MockedProvider
        mocks={mockTransitonCaseMutation(caseId)}
        addTypename={false}
      >
        <IntlProviderWrapper>
          <FormContextWrapper
            theCase={{
              id: caseId,
              origin: CaseOrigin.RVG,
              type: CaseType.OTHER,
              created: '',
              modified: '',
              state: CaseState.ACCEPTED,
              policeCaseNumbers: [],
            }}
          >
            <Summary />
          </FormContextWrapper>
        </IntlProviderWrapper>
      </MockedProvider>,
    )

    const continueButton = screen.getByRole('button', { name: 'Ljúka máli' })

    await act(async () => {
      await userEvent.click(continueButton)
    })

    const { getByRole } = within(screen.getByRole('dialog'))

    expect(
      getByRole('heading', { name: 'Máli hefur verið lokið' }),
    ).toBeInTheDocument()
  })

  it('should show a modal window when the appeal ruling is modified', async () => {
    const caseId = faker.datatype.uuid()
    jest.spyOn(stepHelper, 'hasSentNotification').mockReturnValue(true)

    render(
      <MockedProvider
        mocks={mockTransitonCaseMutation(caseId)}
        addTypename={false}
      >
        <IntlProviderWrapper>
          <FormContextWrapper
            theCase={{
              id: caseId,
              origin: CaseOrigin.RVG,
              type: CaseType.OTHER,
              created: '',
              modified: '',
              state: CaseState.ACCEPTED,
              policeCaseNumbers: [],
            }}
          >
            <Summary />
          </FormContextWrapper>
        </IntlProviderWrapper>
      </MockedProvider>,
    )

    const continueButton = screen.getByRole('button', { name: 'Ljúka máli' })

    await act(async () => {
      await userEvent.click(continueButton)
    })

    const { getByRole } = within(screen.getByRole('dialog'))

    expect(
      getByRole('heading', { name: 'Hverju var breytt?' }),
    ).toBeInTheDocument()
  })
})
