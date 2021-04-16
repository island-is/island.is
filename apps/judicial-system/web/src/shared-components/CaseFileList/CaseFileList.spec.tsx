import React from 'react'
import { render, screen } from '@testing-library/react'

import CaseFileList from './CaseFileList'
import { MockedProvider } from '@apollo/client/testing'

describe('CaseFileList', () => {
  it('should say that there are no files associated with a case if there are no files', async () => {
    render(
      <MockedProvider>
        <CaseFileList caseId="test" files={[]} />
      </MockedProvider>,
    )

    expect(
      await screen.findByText(
        'Engin rannsóknargögn fylgja kröfunni í Réttarvörslugátt.',
      ),
    ).toBeInTheDocument()
  })
})
