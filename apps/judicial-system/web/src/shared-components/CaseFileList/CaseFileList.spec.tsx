import React from 'react'
import { render, screen } from '@testing-library/react'

import CaseFileList from './CaseFileList'
import { MockedProvider } from '@apollo/client/testing'
import { LocaleProvider } from '@island.is/localization'

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
