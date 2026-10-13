import { fireEvent, render, screen } from '@testing-library/react'

import type { CourtDocumentResponse } from '@island.is/judicial-system-web/src/graphql/schema'

import { UnfiledCourtDocumentList } from './UnfiledCourtDocumentList'

describe('UnfiledCourtDocumentList', () => {
  const courtDocuments = [
    { id: 'document-1', name: 'Reikningur' },
    { id: 'document-2', name: 'Greinargerð' },
  ] as CourtDocumentResponse[]

  const renderList = (isDisabled = false) => {
    const onOpen = jest.fn()
    const onFile = jest.fn()

    render(
      <UnfiledCourtDocumentList
        courtDocuments={courtDocuments}
        isDisabled={isDisabled}
        onOpen={onOpen}
        onFile={onFile}
      />,
    )

    return { onOpen, onFile }
  }

  it('should open the document that was clicked', () => {
    const { onOpen } = renderList()

    fireEvent.click(screen.getByText('Greinargerð'))

    expect(onOpen).toHaveBeenCalledWith('document-2')
  })

  it('should file the document the button belongs to', () => {
    const { onFile } = renderList()

    fireEvent.click(screen.getAllByText('Leggja fram')[0])

    expect(onFile).toHaveBeenCalledWith(courtDocuments[0])
  })

  it('should not file anything while the court record is closed to changes', () => {
    const { onFile } = renderList(true)

    fireEvent.click(screen.getAllByText('Leggja fram')[0])

    expect(onFile).not.toHaveBeenCalled()
  })
})
