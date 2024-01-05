import React from 'react'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'

import { LocaleProvider } from '@island.is/localization'

import CaseFileList from './CaseFileList'

describe('CaseFileList', () => {
  it('should say that there are no files associated with a case if there are no files', async () => {
    render(
      <MockedProvider>
        <LocaleProvider locale="is" messages={{}}>
          <CaseFileList caseId="test" files={[]} />
        </LocaleProvider>
      </MockedProvider>,
    )

    expect(
      await screen.findByText(
        'Engin rannsóknargögn fylgja kröfunni í Réttarvörslugátt.',
      ),
    ).toBeInTheDocument()
  })
})
