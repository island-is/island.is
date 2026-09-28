import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { FileUploadStatus } from '@island.is/island-ui/core'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import {
  CaseFileCategory,
  CaseType,
  EventType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { mockCase } from '@island.is/judicial-system-web/src/utils/mocks'
import {
  FormContextWrapper,
  IntlProviderWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import { CriminalRecordUpdate } from './CriminalRecordUpdate'

const mockHandleUpload = jest.fn()
const mockCreateEventLog = jest.fn()

jest.mock('../../../../utils/hooks/useS3Upload/useS3Upload', () => ({
  ...jest.requireActual('../../../../utils/hooks/useS3Upload/useS3Upload'),
  __esModule: true,
  default: () => ({ handleUpload: mockHandleUpload, handleRemove: jest.fn() }),
}))

jest.mock('../../../../utils/hooks/useFileList', () => ({
  ...jest.requireActual('../../../../utils/hooks/useFileList'),
  __esModule: true,
  default: () => ({ onOpenFile: jest.fn() }),
}))

jest.mock('../../../../utils/hooks/useEventLog', () => ({
  __esModule: true,
  default: () => ({ createEventLog: mockCreateEventLog }),
}))

const completedDate = '2024-01-01T10:00:00.000Z'

const sentCase = {
  ...mockCase(CaseType.INDICTMENT),
  indictmentCompletedDate: completedDate,
  indictmentSentToPublicProsecutorDate: '2024-01-02T10:00:00.000Z',
} as WorkingCase

const notSentCase = {
  ...mockCase(CaseType.INDICTMENT),
  indictmentCompletedDate: completedDate,
} as WorkingCase

// Sent to the public prosecutor, then reopened and completed again: the new
// completion has not been sent yet
const reopenedCase = {
  ...mockCase(CaseType.INDICTMENT),
  indictmentSentToPublicProsecutorDate: completedDate,
  indictmentCompletedDate: '2024-01-03T10:00:00.000Z',
} as WorkingCase

const pdf = (name: string) =>
  new File(['%PDF-1.4'], name, { type: 'application/pdf' })

const renderComponent = (theCase: WorkingCase) => {
  const addUploadFiles = jest.fn(
    (files: File[], overRides?: Record<string, unknown>) =>
      files.map((file) => ({ id: file.name, name: file.name, ...overRides })),
  )

  const { container } = render(
    <IntlProviderWrapper>
      <FormContextWrapper theCase={theCase}>
        <CriminalRecordUpdate
          uploadFiles={[]}
          addUploadFiles={addUploadFiles}
          updateUploadFile={jest.fn()}
          removeUploadFile={jest.fn()}
        />
      </FormContextWrapper>
    </IntlProviderWrapper>,
  )

  const input = container.querySelector('input[type="file"]')

  if (!(input instanceof HTMLInputElement)) {
    throw new Error('File input not rendered')
  }

  return { input, addUploadFiles }
}

describe('CriminalRecordUpdate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCreateEventLog.mockResolvedValue(true)
  })

  describe('when the case has been sent to the public prosecutor', () => {
    it('uploads the files and logs the criminal record event', async () => {
      mockHandleUpload.mockResolvedValue('ALL_SUCCEEDED')
      const { input, addUploadFiles } = renderComponent(sentCase)

      await userEvent.upload(input, [pdf('a.pdf'), pdf('b.pdf')])

      await waitFor(() => expect(mockHandleUpload).toHaveBeenCalledTimes(1))
      expect(addUploadFiles).toHaveBeenCalledWith(expect.any(Array), {
        category: CaseFileCategory.CRIMINAL_RECORD_UPDATE,
      })
      await waitFor(() =>
        expect(mockCreateEventLog).toHaveBeenCalledWith({
          caseId: sentCase.id,
          eventType: EventType.INDICTMENT_CRIMINAL_RECORD_UPDATED_BY_COURT,
        }),
      )
    })

    it('logs the event when only some of the files were uploaded', async () => {
      mockHandleUpload.mockResolvedValue('SOME_SUCCEEDED')
      const { input } = renderComponent(sentCase)

      await userEvent.upload(input, [pdf('a.pdf'), pdf('b.pdf')])

      await waitFor(() => expect(mockCreateEventLog).toHaveBeenCalledTimes(1))
    })

    it('does not log the event when no file was uploaded', async () => {
      mockHandleUpload.mockResolvedValue('NONE_SUCCEEDED')
      const { input } = renderComponent(sentCase)

      await userEvent.upload(input, pdf('a.pdf'))

      await waitFor(() => expect(mockHandleUpload).toHaveBeenCalledTimes(1))
      expect(mockCreateEventLog).not.toHaveBeenCalled()
    })
  })

  describe('when the case has not been sent to the public prosecutor', () => {
    it.each([
      ['never sent', notSentCase],
      ['sent before it was reopened', reopenedCase],
    ])(
      'stages the files for the next send without uploading or logging (%s)',
      async (_, theCase) => {
        const { input, addUploadFiles } = renderComponent(theCase)

        await userEvent.upload(input, pdf('a.pdf'))

        await waitFor(() =>
          expect(addUploadFiles).toHaveBeenCalledWith(expect.any(Array), {
            category: CaseFileCategory.CRIMINAL_RECORD_UPDATE,
            status: FileUploadStatus.done,
          }),
        )
        expect(mockHandleUpload).not.toHaveBeenCalled()
        expect(mockCreateEventLog).not.toHaveBeenCalled()
      },
    )
  })
})
