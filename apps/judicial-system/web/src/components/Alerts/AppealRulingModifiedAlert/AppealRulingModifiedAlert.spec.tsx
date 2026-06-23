import { render, screen } from '@testing-library/react'

import { Case } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  FormContextWrapper,
  IntlProviderWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import AppealRulingModifiedAlert from './AppealRulingModifiedAlert'

const renderAlert = (theCase: Partial<Case>) =>
  render(
    <IntlProviderWrapper>
      <FormContextWrapper theCase={theCase as Case}>
        <AppealRulingModifiedAlert />
      </FormContextWrapper>
    </IntlProviderWrapper>,
  )

describe('AppealRulingModifiedAlert', () => {
  it('renders nothing when there are no corrected appeals', () => {
    const { container } = renderAlert({ id: 'case-1' })

    expect(container).toBeEmptyDOMElement()
  })

  it('renders the case-level correction box', () => {
    renderAlert({
      id: 'case-1',
      appealCase: {
        id: 'appeal-1',
        appealRulingModifiedHistory: 'Leiðrétting á máli',
      },
    })

    expect(
      screen.getByText('Úrskurður Landsréttar leiðréttur'),
    ).toBeInTheDocument()
    expect(screen.getByText('Leiðrétting á máli')).toBeInTheDocument()
  })

  it('renders one box per corrected ruling-order appeal with the file name', () => {
    renderAlert({
      id: 'case-1',
      caseFiles: [
        { id: 'file-1', userGeneratedFilename: 'Úrskurður 15-2026' },
        { id: 'file-2', userGeneratedFilename: 'Úrskurður 16-2026' },
      ],
      rulingOrderAppealCases: [
        {
          id: 'ro-1',
          rulingFileId: 'file-1',
          appealRulingModifiedHistory: 'Leiðrétting eitt',
        },
        {
          id: 'ro-2',
          rulingFileId: 'file-2',
          appealRulingModifiedHistory: 'Leiðrétting tvö',
        },
      ],
    })

    expect(
      screen.getByText('Úrskurður Landsréttar leiðréttur — Úrskurður 15-2026'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Úrskurður Landsréttar leiðréttur — Úrskurður 16-2026'),
    ).toBeInTheDocument()
    expect(screen.getByText('Leiðrétting eitt')).toBeInTheDocument()
    expect(screen.getByText('Leiðrétting tvö')).toBeInTheDocument()
  })

  it('falls back to the plain title when the file name is missing', () => {
    renderAlert({
      id: 'case-1',
      caseFiles: [],
      rulingOrderAppealCases: [
        {
          id: 'ro-1',
          rulingFileId: 'missing-file',
          appealRulingModifiedHistory: 'Leiðrétting án skráarnafns',
        },
      ],
    })

    expect(
      screen.getByText('Úrskurður Landsréttar leiðréttur'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Leiðrétting án skráarnafns'),
    ).toBeInTheDocument()
  })
})
