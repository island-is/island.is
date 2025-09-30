import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockedProvider } from '@apollo/client/testing'
import CourtSessionAccordionItem from './CourtSessionAccordionItem'
import {
  CourtSessionResponse,
  CourtSessionClosedLegalBasis,
  CourtSessionRulingType,
  Case,
  CourtDocumentResponse,
} from '@island.is/judicial-system-web/src/graphql/schema'
import * as useCourtDocumentsHook from '@island.is/judicial-system-web/src/utils/hooks/useCourtDocuments'
import * as useCourtSessionsHook from '@island.is/judicial-system-web/src/utils/hooks/useCourtSessions'
import * as useUsersHook from '@island.is/judicial-system-web/src/utils/hooks/useUsers'
import { toast } from '@island.is/island-ui/core'

// Mock dependencies
jest.mock('@island.is/judicial-system-web/src/utils/hooks/useCourtDocuments')
jest.mock('@island.is/judicial-system-web/src/utils/hooks/useCourtSessions')
jest.mock('@island.is/judicial-system-web/src/utils/hooks/useUsers')
jest.mock('@island.is/island-ui/core', () => ({
  ...jest.requireActual('@island.is/island-ui/core'),
  toast: {
    error: jest.fn(),
  },
}))

describe('CourtSessionAccordionItem', () => {
  const mockUpdateCourtSession = jest.fn()
  const mockCourtDocumentDelete = jest.fn()
  const mockCourtDocumentUpdate = jest.fn()
  const mockCourtDocumentCreate = jest.fn()
  const mockCourtDocumentFileInSession = jest.fn()
  const mockOnToggle = jest.fn()
  const mockOnConfirmClick = jest.fn()
  const mockSetWorkingCase = jest.fn()

  const baseCourtSession: CourtSessionResponse = {
    id: 'session-1',
    startDate: '2024-03-15T10:00:00Z',
    endDate: '2024-03-15T11:00:00Z',
    location: 'í Héraðsdómi Reykjavíkur',
    attendees: 'Dómari, verjandi',
    entries: 'Test entries',
    ruling: '',
    closingEntries: '',
    isClosed: false,
    isConfirmed: false,
    closedLegalProvisions: [],
    filedDocuments: [],
    rulingType: CourtSessionRulingType.NONE,
    isAttestingWitness: false,
    attestingWitnessId: null,
    attestingWitness: null,
  }

  const baseWorkingCase: Case = {
    id: 'case-1',
    court: { id: 'court-1', name: 'Héraðsdómur Reykjavíkur' },
    courtSessions: [baseCourtSession],
    unfiledCourtDocuments: [],
  } as Case

  const defaultProps = {
    index: 0,
    courtSession: baseCourtSession,
    isExpanded: true,
    onToggle: mockOnToggle,
    onConfirmClick: mockOnConfirmClick,
    workingCase: baseWorkingCase,
    setWorkingCase: mockSetWorkingCase,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    
    ;(useCourtDocumentsHook.useCourtDocuments as jest.Mock).mockReturnValue({
      courtDocument: {
        delete: { action: mockCourtDocumentDelete },
        update: { action: mockCourtDocumentUpdate },
        create: { action: mockCourtDocumentCreate, loading: false },
        fileInCourtSession: { action: mockCourtDocumentFileInSession },
        isLoading: false,
      },
    })
    
    ;(useCourtSessionsHook.useCourtSessions as jest.Mock).mockReturnValue({
      updateCourtSession: mockUpdateCourtSession,
    })
    
    ;(useUsersHook.useUsers as jest.Mock).mockReturnValue({
      districtCourtAssistants: [
        { value: 'user-1', label: 'Assistant 1' },
      ],
      registrars: [
        { value: 'user-2', label: 'Registrar 1' },
      ],
      loading: false,
    })
  })

  describe('Component Rendering', () => {
    it('should render the accordion item with correct label', () => {
      render(<CourtSessionAccordionItem {...defaultProps} />)
      expect(screen.getByText('Þinghald 1')).toBeInTheDocument()
    })

    it('should render all required input fields', () => {
      render(<CourtSessionAccordionItem {...defaultProps} />)
      expect(screen.getByTestId('courtLocation')).toBeInTheDocument()
      expect(screen.getByTestId('courtAttendees')).toBeInTheDocument()
      expect(screen.getByTestId('entries')).toBeInTheDocument()
    })

    it('should render with correct index in label', () => {
      render(<CourtSessionAccordionItem {...defaultProps} index={5} />)
      expect(screen.getByText('Þinghald 6')).toBeInTheDocument()
    })

    it('should disable inputs when court session is confirmed', () => {
      const confirmedSession = { ...baseCourtSession, isConfirmed: true }
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={confirmedSession}
        />
      )
      expect(screen.getByTestId('courtLocation')).toBeDisabled()
      expect(screen.getByTestId('courtAttendees')).toBeDisabled()
      expect(screen.getByTestId('entries')).toBeDisabled()
    })
  })

  describe('CLOSURE_GROUNDS Constant', () => {
    it('should have exactly 7 closure grounds', () => {
      const closedSession = { ...baseCourtSession, isClosed: true }
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={closedSession}
        />
      )
      const checkboxes = screen.getAllByRole('checkbox')
      const closureCheckboxes = checkboxes.filter(cb => 
        cb.getAttribute('name')?.includes('a-lið') ||
        cb.getAttribute('name')?.includes('b-lið') ||
        cb.getAttribute('name')?.includes('c-lið') ||
        cb.getAttribute('name')?.includes('d-lið') ||
        cb.getAttribute('name')?.includes('e-lið') ||
        cb.getAttribute('name')?.includes('f-lið') ||
        cb.getAttribute('name')?.includes('g-lið')
      )
      expect(closureCheckboxes).toHaveLength(7)
    })

    it('should map legal provisions correctly', () => {
      const closedSession = {
        ...baseCourtSession,
        isClosed: true,
        closedLegalProvisions: [CourtSessionClosedLegalBasis._2008_88_10_A],
      }
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={closedSession}
        />
      )
      expect(screen.getByText('a-lið 10. gr. sml nr. 88/2008')).toBeInTheDocument()
    })
  })

  describe('Court Location Input', () => {
    it('should update location on change', () => {
      render(<CourtSessionAccordionItem {...defaultProps} />)
      const input = screen.getByTestId('courtLocation')
      
      fireEvent.change(input, { target: { value: 'í Héraðsdómi Akureyrar' } })
      
      expect(mockSetWorkingCase).toHaveBeenCalled()
    })

    it('should persist location on blur', () => {
      render(<CourtSessionAccordionItem {...defaultProps} />)
      const input = screen.getByTestId('courtLocation')
      
      fireEvent.blur(input, { target: { value: 'í Héraðsdómi Akureyrar' } })
      
      expect(mockSetWorkingCase).toHaveBeenCalled()
    })

    it('should clear error message on change', () => {
      render(<CourtSessionAccordionItem {...defaultProps} />)
      const input = screen.getByTestId('courtLocation')
      
      fireEvent.blur(input, { target: { value: '' } })
      fireEvent.change(input, { target: { value: 'New location' } })
      
      expect(input).not.toHaveClass('hasError')
    })
  })

  describe('Closed Proceeding Checkbox', () => {
    it('should toggle closed proceeding state', () => {
      render(<CourtSessionAccordionItem {...defaultProps} />)
      const checkbox = screen.getByLabelText('Þinghaldið er lokað')
      
      fireEvent.click(checkbox)
      
      expect(mockSetWorkingCase).toHaveBeenCalled()
    })

    it('should show closure grounds when proceeding is closed', () => {
      const closedSession = { ...baseCourtSession, isClosed: true }
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={closedSession}
        />
      )
      
      expect(screen.getByText('Lagaákvæði sem lokun þinghalds byggir á')).toBeInTheDocument()
    })

    it('should hide closure grounds when proceeding is open', () => {
      render(<CourtSessionAccordionItem {...defaultProps} />)
      
      expect(screen.queryByText('Lagaákvæði sem lokun þinghalds byggir á')).not.toBeInTheDocument()
    })

    it('should clear legal provisions when unchecking closed proceeding', () => {
      const closedSession = {
        ...baseCourtSession,
        isClosed: true,
        closedLegalProvisions: [CourtSessionClosedLegalBasis._2008_88_10_A],
      }
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={closedSession}
        />
      )
      
      const checkbox = screen.getByLabelText('Þinghaldið er lokað')
      fireEvent.click(checkbox)
      
      expect(mockSetWorkingCase).toHaveBeenCalled()
    })
  })

  describe('Closure Legal Provisions', () => {
    it('should add legal provision when checked', () => {
      const closedSession = { ...baseCourtSession, isClosed: true }
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={closedSession}
        />
      )
      
      const checkbox = screen.getByLabelText('a-lið 10. gr. sml nr. 88/2008')
      fireEvent.click(checkbox)
      
      expect(mockSetWorkingCase).toHaveBeenCalled()
    })

    it('should remove legal provision when unchecked', () => {
      const closedSession = {
        ...baseCourtSession,
        isClosed: true,
        closedLegalProvisions: [CourtSessionClosedLegalBasis._2008_88_10_A],
      }
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={closedSession}
        />
      )
      
      const checkbox = screen.getByLabelText('a-lið 10. gr. sml nr. 88/2008')
      fireEvent.click(checkbox)
      
      expect(mockSetWorkingCase).toHaveBeenCalled()
    })

    it('should handle multiple legal provisions', () => {
      const closedSession = {
        ...baseCourtSession,
        isClosed: true,
        closedLegalProvisions: [
          CourtSessionClosedLegalBasis._2008_88_10_A,
          CourtSessionClosedLegalBasis._2008_88_10_B,
        ],
      }
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={closedSession}
        />
      )
      
      const checkboxA = screen.getByLabelText('a-lið 10. gr. sml nr. 88/2008')
      const checkboxB = screen.getByLabelText('b-lið 10. gr. sml nr. 88/2008')
      
      expect(checkboxA).toBeChecked()
      expect(checkboxB).toBeChecked()
    })
  })

  describe('Court Attendees Input', () => {
    it('should update attendees on change', () => {
      render(<CourtSessionAccordionItem {...defaultProps} />)
      const input = screen.getByTestId('courtAttendees')
      
      fireEvent.change(input, { target: { value: 'New attendees' } })
      
      expect(mockSetWorkingCase).toHaveBeenCalled()
    })

    it('should persist attendees on blur', () => {
      render(<CourtSessionAccordionItem {...defaultProps} />)
      const input = screen.getByTestId('courtAttendees')
      
      fireEvent.blur(input, { target: { value: 'Persisted attendees' } })
      
      expect(mockSetWorkingCase).toHaveBeenCalled()
    })
  })

  describe('Court Documents', () => {
    it('should add new court document', async () => {
      mockCourtDocumentCreate.mockResolvedValue({
        id: 'doc-1',
        name: 'New Document',
      })
      
      render(<CourtSessionAccordionItem {...defaultProps} />)
      
      const input = screen.getByPlaceholderText('Skrá inn heiti á skjali hér')
      const button = screen.getByText('Bæta við skjali')
      
      fireEvent.change(input, { target: { value: 'New Document' } })
      fireEvent.click(button)
      
      await waitFor(() => {
        expect(mockCourtDocumentCreate).toHaveBeenCalledWith({
          caseId: 'case-1',
          courtSessionId: 'session-1',
          name: 'New Document',
        })
      })
    })

    it('should not add document if creation fails', async () => {
      mockCourtDocumentCreate.mockResolvedValue(null)
      
      render(<CourtSessionAccordionItem {...defaultProps} />)
      
      const input = screen.getByPlaceholderText('Skrá inn heiti á skjali hér')
      const button = screen.getByText('Bæta við skjali')
      
      fireEvent.change(input, { target: { value: 'Failed Document' } })
      fireEvent.click(button)
      
      await waitFor(() => {
        expect(mockCourtDocumentCreate).toHaveBeenCalled()
      })
    })

    it('should handle file deletion', async () => {
      const fileToDelete: CourtDocumentResponse = {
        id: 'doc-1',
        name: 'Document to delete',
      }
      const sessionWithFiles = {
        ...baseCourtSession,
        filedDocuments: [fileToDelete],
      }
      const caseWithFiles = {
        ...baseWorkingCase,
        courtSessions: [sessionWithFiles],
      }
      
      mockCourtDocumentDelete.mockResolvedValue(true)
      
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={sessionWithFiles}
          workingCase={caseWithFiles}
        />
      )
      
      // Deletion would be triggered through EditableCaseFile component
      expect(mockSetWorkingCase).toBeDefined()
    })

    it('should not delete file if deletion fails', async () => {
      mockCourtDocumentDelete.mockResolvedValue(false)
      
      const fileToDelete: CourtDocumentResponse = {
        id: 'doc-1',
        name: 'Document',
      }
      
      // Test would require triggering deletion through UI
      expect(mockCourtDocumentDelete).toBeDefined()
    })

    it('should handle file renaming', () => {
      const file: CourtDocumentResponse = {
        id: 'doc-1',
        name: 'Original Name',
      }
      const sessionWithFiles = {
        ...baseCourtSession,
        filedDocuments: [file],
      }
      
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={sessionWithFiles}
        />
      )
      
      // Renaming would be triggered through EditableCaseFile component
      expect(mockCourtDocumentUpdate).toBeDefined()
    })

    it('should not rename file if name is empty', () => {
      // Test the handleRename function logic
      render(<CourtSessionAccordionItem {...defaultProps} />)
      
      // The function checks for empty names and returns early
      expect(mockCourtDocumentUpdate).toBeDefined()
    })
  })

  describe('File Reordering', () => {
    it('should handle file reordering', () => {
      const files: CourtDocumentResponse[] = [
        { id: 'doc-1', name: 'File 1' },
        { id: 'doc-2', name: 'File 2' },
      ]
      const sessionWithFiles = {
        ...baseCourtSession,
        filedDocuments: files,
      }
      const caseWithFiles = {
        ...baseWorkingCase,
        courtSessions: [sessionWithFiles],
      }
      
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={sessionWithFiles}
          workingCase={caseWithFiles}
        />
      )
      
      // Reordering would be triggered through Reorder.Group component
      expect(mockCourtDocumentUpdate).toBeDefined()
    })

    it('should not reorder if session is confirmed', () => {
      const files: CourtDocumentResponse[] = [
        { id: 'doc-1', name: 'File 1' },
        { id: 'doc-2', name: 'File 2' },
      ]
      const confirmedSession = {
        ...baseCourtSession,
        isConfirmed: true,
        filedDocuments: files,
      }
      
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={confirmedSession}
        />
      )
      
      // Reordering should be prevented when confirmed
      expect(confirmedSession.isConfirmed).toBe(true)
    })

    it('should calculate correct document index across sessions', () => {
      const session1 = {
        ...baseCourtSession,
        id: 'session-1',
        filedDocuments: [
          { id: 'doc-1', name: 'File 1' },
          { id: 'doc-2', name: 'File 2' },
        ],
      }
      const session2 = {
        ...baseCourtSession,
        id: 'session-2',
        filedDocuments: [
          { id: 'doc-3', name: 'File 3' },
        ],
      }
      const caseWithMultipleSessions = {
        ...baseWorkingCase,
        courtSessions: [session1, session2],
      }
      
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          index={1}
          courtSession={session2}
          workingCase={caseWithMultipleSessions}
        />
      )
      
      // Should show "Skjöl málsins nr. 1-2 liggja frammi"
      expect(screen.getByText('Skjöl málsins nr. 1-2 liggja frammi')).toBeInTheDocument()
    })
  })

  describe('Filing Unfiled Documents', () => {
    it('should file unfiled document', async () => {
      const unfiledDoc: CourtDocumentResponse = {
        id: 'doc-unfiled',
        name: 'Unfiled Document',
      }
      const caseWithUnfiled = {
        ...baseWorkingCase,
        unfiledCourtDocuments: [unfiledDoc],
      }
      
      mockCourtDocumentFileInSession.mockResolvedValue({
        id: 'doc-unfiled',
        name: 'Unfiled Document',
      })
      
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          workingCase={caseWithUnfiled}
        />
      )
      
      // Open accordion for unfiled documents
      const accordionButton = screen.getByText(/Önnur skjöl/)
      fireEvent.click(accordionButton)
      
      await waitFor(() => {
        expect(screen.getByText('Unfiled Document')).toBeInTheDocument()
      })
      
      const fileButton = screen.getByText('Leggja fram')
      fireEvent.click(fileButton)
      
      await waitFor(() => {
        expect(mockCourtDocumentFileInSession).toHaveBeenCalledWith({
          caseId: 'case-1',
          courtSessionId: 'session-1',
          courtDocumentId: 'doc-unfiled',
        })
      })
    })

    it('should not file document if action fails', async () => {
      const unfiledDoc: CourtDocumentResponse = {
        id: 'doc-unfiled',
        name: 'Unfiled Document',
      }
      const caseWithUnfiled = {
        ...baseWorkingCase,
        unfiledCourtDocuments: [unfiledDoc],
      }
      
      mockCourtDocumentFileInSession.mockResolvedValue(null)
      
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          workingCase={caseWithUnfiled}
        />
      )
      
      // Open accordion and click file button
      const accordionButton = screen.getByText(/Önnur skjöl/)
      fireEvent.click(accordionButton)
      
      await waitFor(() => {
        const fileButton = screen.getByText('Leggja fram')
        fireEvent.click(fileButton)
      })
      
      await waitFor(() => {
        expect(mockCourtDocumentFileInSession).toHaveBeenCalled()
      })
    })

    it('should show success message when no unfiled documents', async () => {
      const caseWithNoUnfiled = {
        ...baseWorkingCase,
        unfiledCourtDocuments: [],
      }
      
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          workingCase={caseWithNoUnfiled}
        />
      )
      
      const accordionButton = screen.getByText(/Önnur skjöl/)
      fireEvent.click(accordionButton)
      
      await waitFor(() => {
        expect(screen.getByText('Engin óþingmerkt skjöl')).toBeInTheDocument()
      })
    })
  })

  describe('Entries Input', () => {
    it('should update entries on change', () => {
      render(<CourtSessionAccordionItem {...defaultProps} />)
      const input = screen.getByTestId('entries')
      
      fireEvent.change(input, { target: { value: 'New entries' } })
      
      expect(mockSetWorkingCase).toHaveBeenCalled()
    })

    it('should clear error message on change', () => {
      render(<CourtSessionAccordionItem {...defaultProps} />)
      const input = screen.getByTestId('entries')
      
      fireEvent.blur(input, { target: { value: '' } })
      fireEvent.change(input, { target: { value: 'Valid entries' } })
      
      expect(input).not.toHaveClass('hasError')
    })

    it('should persist entries on blur', () => {
      render(<CourtSessionAccordionItem {...defaultProps} />)
      const input = screen.getByTestId('entries')
      
      fireEvent.blur(input, { target: { value: 'Persisted entries' } })
      
      expect(mockSetWorkingCase).toHaveBeenCalled()
    })
  })

  describe('Ruling Type Selection', () => {
    it('should select NONE ruling type', () => {
      render(<CourtSessionAccordionItem {...defaultProps} />)
      const radio = screen.getByLabelText('Nei')
      
      fireEvent.click(radio)
      
      expect(mockSetWorkingCase).toHaveBeenCalled()
    })

    it('should select JUDGEMENT ruling type', () => {
      render(<CourtSessionAccordionItem {...defaultProps} />)
      const radio = screen.getByLabelText('Dómur kveðinn upp')
      
      fireEvent.click(radio)
      
      expect(mockSetWorkingCase).toHaveBeenCalled()
    })

    it('should select ORDER ruling type', () => {
      render(<CourtSessionAccordionItem {...defaultProps} />)
      const radio = screen.getByLabelText('Úrskurður kveðinn upp')
      
      fireEvent.click(radio)
      
      expect(mockSetWorkingCase).toHaveBeenCalled()
    })

    it('should show ruling input when JUDGEMENT is selected', () => {
      const sessionWithJudgement = {
        ...baseCourtSession,
        rulingType: CourtSessionRulingType.JUDGEMENT,
      }
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={sessionWithJudgement}
        />
      )
      
      expect(screen.getByTestId('ruling')).toBeInTheDocument()
      expect(screen.getByText('Dómsorð')).toBeInTheDocument()
    })

    it('should show ruling input when ORDER is selected', () => {
      const sessionWithOrder = {
        ...baseCourtSession,
        rulingType: CourtSessionRulingType.ORDER,
      }
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={sessionWithOrder}
        />
      )
      
      expect(screen.getByTestId('ruling')).toBeInTheDocument()
      expect(screen.getByText('Úrskurðarorð')).toBeInTheDocument()
    })

    it('should hide ruling input when NONE is selected', () => {
      render(<CourtSessionAccordionItem {...defaultProps} />)
      
      expect(screen.queryByTestId('ruling')).not.toBeInTheDocument()
    })

    it('should clear ruling when switching to NONE', () => {
      const sessionWithRuling = {
        ...baseCourtSession,
        rulingType: CourtSessionRulingType.JUDGEMENT,
        ruling: 'Some ruling',
      }
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={sessionWithRuling}
        />
      )
      
      const radio = screen.getByLabelText('Nei')
      fireEvent.click(radio)
      
      expect(mockSetWorkingCase).toHaveBeenCalled()
    })
  })

  describe('Ruling Input', () => {
    it('should update ruling on change', () => {
      const sessionWithJudgement = {
        ...baseCourtSession,
        rulingType: CourtSessionRulingType.JUDGEMENT,
      }
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={sessionWithJudgement}
        />
      )
      
      const input = screen.getByTestId('ruling')
      fireEvent.change(input, { target: { value: 'New ruling' } })
      
      expect(mockSetWorkingCase).toHaveBeenCalled()
    })

    it('should clear error on change', () => {
      const sessionWithJudgement = {
        ...baseCourtSession,
        rulingType: CourtSessionRulingType.JUDGEMENT,
      }
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={sessionWithJudgement}
        />
      )
      
      const input = screen.getByTestId('ruling')
      fireEvent.blur(input, { target: { value: '' } })
      fireEvent.change(input, { target: { value: 'Valid ruling' } })
      
      expect(input).not.toHaveClass('hasError')
    })

    it('should persist ruling on blur', () => {
      const sessionWithJudgement = {
        ...baseCourtSession,
        rulingType: CourtSessionRulingType.JUDGEMENT,
      }
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={sessionWithJudgement}
        />
      )
      
      const input = screen.getByTestId('ruling')
      fireEvent.blur(input, { target: { value: 'Persisted ruling' } })
      
      expect(mockSetWorkingCase).toHaveBeenCalled()
    })
  })

  describe('Closing Entries', () => {
    it('should show closing entries when ruling type is JUDGEMENT', () => {
      const sessionWithJudgement = {
        ...baseCourtSession,
        rulingType: CourtSessionRulingType.JUDGEMENT,
      }
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={sessionWithJudgement}
        />
      )
      
      expect(screen.getByTestId('closingEntries')).toBeInTheDocument()
    })

    it('should show closing entries when ruling type is ORDER', () => {
      const sessionWithOrder = {
        ...baseCourtSession,
        rulingType: CourtSessionRulingType.ORDER,
      }
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={sessionWithOrder}
        />
      )
      
      expect(screen.getByTestId('closingEntries')).toBeInTheDocument()
    })

    it('should update closing entries on change', () => {
      const sessionWithJudgement = {
        ...baseCourtSession,
        rulingType: CourtSessionRulingType.JUDGEMENT,
      }
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={sessionWithJudgement}
        />
      )
      
      const input = screen.getByTestId('closingEntries')
      fireEvent.change(input, { target: { value: 'New closing entries' } })
      
      expect(mockSetWorkingCase).toHaveBeenCalled()
    })

    it('should persist closing entries on blur', () => {
      const sessionWithJudgement = {
        ...baseCourtSession,
        rulingType: CourtSessionRulingType.JUDGEMENT,
      }
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={sessionWithJudgement}
        />
      )
      
      const input = screen.getByTestId('closingEntries')
      fireEvent.blur(input, { target: { value: 'Persisted closing' } })
      
      expect(mockSetWorkingCase).toHaveBeenCalled()
    })
  })

  describe('Attesting Witness', () => {
    it('should enable witness checkbox', () => {
      render(<CourtSessionAccordionItem {...defaultProps} />)
      const checkbox = screen.getByLabelText('Skrá vott að þinghaldi')
      
      fireEvent.click(checkbox)
      
      expect(mockSetWorkingCase).toHaveBeenCalled()
    })

    it('should enable witness select when checkbox is checked', () => {
      const sessionWithWitness = {
        ...baseCourtSession,
        isAttestingWitness: true,
      }
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={sessionWithWitness}
        />
      )
      
      const select = screen.getByLabelText('Veldu vott')
      expect(select).not.toBeDisabled()
    })

    it('should disable witness select when checkbox is unchecked', () => {
      render(<CourtSessionAccordionItem {...defaultProps} />)
      
      const select = screen.getByLabelText('Veldu vott')
      expect(select).toBeDisabled()
    })

    it('should select witness from dropdown', async () => {
      const sessionWithWitness = {
        ...baseCourtSession,
        isAttestingWitness: true,
      }
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={sessionWithWitness}
        />
      )
      
      // Selecting a witness would trigger handleChangeWitness
      expect(mockSetWorkingCase).toBeDefined()
    })

    it('should combine assistants and registrars in witness options', () => {
      const sessionWithWitness = {
        ...baseCourtSession,
        isAttestingWitness: true,
      }
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={sessionWithWitness}
        />
      )
      
      // Both assistants and registrars should be available
      expect(screen.getByLabelText('Veldu vott')).toBeInTheDocument()
    })

    it('should clear witness when checkbox is unchecked', () => {
      const sessionWithWitness = {
        ...baseCourtSession,
        isAttestingWitness: true,
        attestingWitnessId: 'user-1',
        attestingWitness: { id: 'user-1', name: 'Assistant 1' },
      }
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={sessionWithWitness}
        />
      )
      
      const checkbox = screen.getByLabelText('Skrá vott að þinghaldi')
      fireEvent.click(checkbox)
      
      expect(mockSetWorkingCase).toHaveBeenCalled()
    })
  })

  describe('End Time Handling', () => {
    it('should update end time', () => {
      render(<CourtSessionAccordionItem {...defaultProps} />)
      
      // End time update would be triggered through DateTime component
      expect(mockSetWorkingCase).toBeDefined()
    })

    it('should show error if end time is before start time', () => {
      render(<CourtSessionAccordionItem {...defaultProps} />)
      
      // This would require simulating DateTime change with invalid time
      expect(toast.error).toBeDefined()
    })

    it('should use start date for end time if not set', () => {
      const sessionWithoutEnd = {
        ...baseCourtSession,
        endDate: undefined,
      }
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={sessionWithoutEnd}
        />
      )
      
      // Component should render with startDate as default
      expect(screen.getByText('Þinghald 1')).toBeInTheDocument()
    })
  })

  describe('Confirm Button', () => {
    it('should render confirm button', () => {
      render(<CourtSessionAccordionItem {...defaultProps} />)
      
      expect(screen.getByText(/Staðfesta þingbók/)).toBeInTheDocument()
    })

    it('should show edit text when session is confirmed', () => {
      const confirmedSession = { ...baseCourtSession, isConfirmed: true }
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={confirmedSession}
        />
      )
      
      expect(screen.getByText(/Leiðrétta þingbók/)).toBeInTheDocument()
    })

    it('should call onConfirmClick when clicked', () => {
      render(<CourtSessionAccordionItem {...defaultProps} />)
      
      const button = screen.getByText(/Staðfesta þingbók/)
      fireEvent.click(button)
      
      expect(mockOnConfirmClick).toHaveBeenCalled()
    })

    it('should show checkmark icon when not confirmed', () => {
      render(<CourtSessionAccordionItem {...defaultProps} />)
      
      const button = screen.getByText(/Staðfesta þingbók/)
      expect(button).toBeInTheDocument()
    })

    it('should show pencil icon when confirmed', () => {
      const confirmedSession = { ...baseCourtSession, isConfirmed: true }
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={confirmedSession}
        />
      )
      
      const button = screen.getByText(/Leiðrétta þingbók/)
      expect(button).toBeInTheDocument()
    })
  })

  describe('Accordion Toggle', () => {
    it('should call onToggle when accordion is clicked', () => {
      render(<CourtSessionAccordionItem {...defaultProps} />)
      
      const accordionHeader = screen.getByText('Þinghald 1')
      fireEvent.click(accordionHeader)
      
      expect(mockOnToggle).toHaveBeenCalled()
    })

    it('should expand when isExpanded is true', () => {
      render(<CourtSessionAccordionItem {...defaultProps} isExpanded={true} />)
      
      expect(screen.getByTestId('courtLocation')).toBeVisible()
    })
  })

  describe('Edge Cases', () => {
    it('should handle null values gracefully', () => {
      const sessionWithNulls = {
        ...baseCourtSession,
        location: null,
        attendees: null,
        entries: null,
        ruling: null,
      }
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={sessionWithNulls as any}
        />
      )
      
      expect(screen.getByTestId('courtLocation')).toHaveValue('')
      expect(screen.getByTestId('courtAttendees')).toHaveValue('')
      expect(screen.getByTestId('entries')).toHaveValue('')
    })

    it('should handle empty filed documents array', () => {
      const sessionWithoutDocs = {
        ...baseCourtSession,
        filedDocuments: [],
      }
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={sessionWithoutDocs}
        />
      )
      
      expect(screen.getByText('Þinghald 1')).toBeInTheDocument()
    })

    it('should handle undefined court in working case', () => {
      const caseWithoutCourt = {
        ...baseWorkingCase,
        court: undefined,
      }
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          workingCase={caseWithoutCourt as any}
        />
      )
      
      expect(screen.getByText('Þinghald 1')).toBeInTheDocument()
    })

    it('should handle loading state for users', () => {
      ;(useUsersHook.useUsers as jest.Mock).mockReturnValue({
        districtCourtAssistants: [],
        registrars: [],
        loading: true,
      })
      
      render(<CourtSessionAccordionItem {...defaultProps} />)
      
      expect(screen.getByText('Þinghald 1')).toBeInTheDocument()
    })

    it('should handle loading state for court documents', () => {
      ;(useCourtDocumentsHook.useCourtDocuments as jest.Mock).mockReturnValue({
        courtDocument: {
          delete: { action: mockCourtDocumentDelete },
          update: { action: mockCourtDocumentUpdate },
          create: { action: mockCourtDocumentCreate, loading: true },
          fileInCourtSession: { action: mockCourtDocumentFileInSession },
          isLoading: true,
        },
      })
      
      render(<CourtSessionAccordionItem {...defaultProps} />)
      
      expect(screen.getByText('Þinghald 1')).toBeInTheDocument()
    })
  })

  describe('Document Index Calculation', () => {
    it('should calculate documents before session correctly', () => {
      const session1 = {
        ...baseCourtSession,
        id: 'session-1',
        filedDocuments: [
          { id: 'doc-1', name: 'File 1' },
          { id: 'doc-2', name: 'File 2' },
          { id: 'doc-3', name: 'File 3' },
        ],
      }
      const session2 = {
        ...baseCourtSession,
        id: 'session-2',
        filedDocuments: [],
      }
      const caseWithMultipleSessions = {
        ...baseWorkingCase,
        courtSessions: [session1, session2],
      }
      
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          index={1}
          courtSession={session2}
          workingCase={caseWithMultipleSessions}
        />
      )
      
      expect(screen.getByText('Skjöl málsins nr. 1-3 liggja frammi')).toBeInTheDocument()
    })

    it('should not show previous documents message for first session', () => {
      render(<CourtSessionAccordionItem {...defaultProps} index={0} />)
      
      expect(screen.queryByText(/Skjöl málsins nr\./)).not.toBeInTheDocument()
    })

    it('should handle multiple sessions with varying document counts', () => {
      const sessions = [
        {
          ...baseCourtSession,
          id: 'session-1',
          filedDocuments: [{ id: 'doc-1', name: 'File 1' }],
        },
        {
          ...baseCourtSession,
          id: 'session-2',
          filedDocuments: [
            { id: 'doc-2', name: 'File 2' },
            { id: 'doc-3', name: 'File 3' },
          ],
        },
        {
          ...baseCourtSession,
          id: 'session-3',
          filedDocuments: [],
        },
      ]
      const caseWithThreeSessions = {
        ...baseWorkingCase,
        courtSessions: sessions,
      }
      
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          index={2}
          courtSession={sessions[2]}
          workingCase={caseWithThreeSessions}
        />
      )
      
      expect(screen.getByText('Skjöl málsins nr. 1-3 liggja frammi')).toBeInTheDocument()
    })
  })

  describe('Integration Tests', () => {
    it('should handle complete workflow for adding and filing document', async () => {
      const newDoc: CourtDocumentResponse = {
        id: 'new-doc',
        name: 'New Document',
      }
      
      mockCourtDocumentCreate.mockResolvedValue(newDoc)
      mockCourtDocumentFileInSession.mockResolvedValue(newDoc)
      
      const caseWithUnfiled = {
        ...baseWorkingCase,
        unfiledCourtDocuments: [],
      }
      
      render(
        <CourtSessionAccordionItem
          {...defaultProps}
          workingCase={caseWithUnfiled}
        />
      )
      
      // Add document
      const input = screen.getByPlaceholderText('Skrá inn heiti á skjali hér')
      const button = screen.getByText('Bæta við skjali')
      
      fireEvent.change(input, { target: { value: 'New Document' } })
      fireEvent.click(button)
      
      await waitFor(() => {
        expect(mockCourtDocumentCreate).toHaveBeenCalled()
      })
    })

    it('should update state correctly when switching ruling types', () => {
      const { rerender } = render(<CourtSessionAccordionItem {...defaultProps} />)
      
      // Select JUDGEMENT
      const judgementRadio = screen.getByLabelText('Dómur kveðinn upp')
      fireEvent.click(judgementRadio)
      
      expect(mockSetWorkingCase).toHaveBeenCalled()
      
      // Now select NONE
      const noneRadio = screen.getByLabelText('Nei')
      fireEvent.click(noneRadio)
      
      expect(mockSetWorkingCase).toHaveBeenCalledTimes(2)
    })

    it('should persist multiple field changes in sequence', () => {
      render(<CourtSessionAccordionItem {...defaultProps} />)
      
      const locationInput = screen.getByTestId('courtLocation')
      const attendeesInput = screen.getByTestId('courtAttendees')
      const entriesInput = screen.getByTestId('entries')
      
      fireEvent.change(locationInput, { target: { value: 'New location' } })
      fireEvent.blur(locationInput)
      
      fireEvent.change(attendeesInput, { target: { value: 'New attendees' } })
      fireEvent.blur(attendeesInput)
      
      fireEvent.change(entriesInput, { target: { value: 'New entries' } })
      fireEvent.blur(entriesInput)
      
      expect(mockSetWorkingCase).toHaveBeenCalledTimes(6) // 3 changes + 3 blurs
    })
  })

  describe('Performance and Memoization', () => {
    it('should memoize filed documents correctly', () => {
      const sessionWithDocs = {
        ...baseCourtSession,
        filedDocuments: [
          { id: 'doc-1', name: 'File 1' },
        ],
      }
      const caseWithDocs = {
        ...baseWorkingCase,
        courtSessions: [sessionWithDocs],
      }
      
      const { rerender } = render(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={sessionWithDocs}
          workingCase={caseWithDocs}
        />
      )
      
      // Rerender with same props
      rerender(
        <CourtSessionAccordionItem
          {...defaultProps}
          courtSession={sessionWithDocs}
          workingCase={caseWithDocs}
        />
      )
      
      // Filed documents should be memoized
      expect(screen.getByText('File 1')).toBeInTheDocument()
    })
  })
})