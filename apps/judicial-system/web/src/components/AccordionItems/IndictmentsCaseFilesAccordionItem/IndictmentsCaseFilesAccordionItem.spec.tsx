import faker from 'faker'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { FileUploadStatus } from '@island.is/island-ui/core'
import {
  CaseFileState,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { mockCase } from '@island.is/judicial-system-web/src/utils/mocks'
import {
  FormContextWrapper,
  IntlProviderWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'
import { toast } from '@island.is/judicial-system-web/src/utils/toast'

import type { ReorderableItem } from './IndictmentsCaseFilesAccordionItem'
import IndictmentsCaseFilesAccordionItem, {
  getFilesToUpdate,
  sortedFilesInChapter,
} from './IndictmentsCaseFilesAccordionItem'

const caseFiles = [
  {
    id: faker.datatype.uuid(),
    created: faker.date.past().toISOString(),
    modified: faker.date.past().toISOString(),
    caseId: faker.datatype.uuid(),
    name: faker.lorem.word(),
    type: faker.lorem.word(),
    state: CaseFileState.STORED_IN_RVG,
    size: 1,
    chapter: 0,
    orderWithinChapter: 1,
  },
  {
    id: faker.datatype.uuid(),
    created: faker.date.past().toISOString(),
    modified: faker.date.past().toISOString(),
    caseId: faker.datatype.uuid(),
    name: faker.lorem.word(),
    type: faker.lorem.word(),
    state: CaseFileState.STORED_IN_RVG,
    size: 1,
    chapter: 0,
    orderWithinChapter: 0,
  },
  {
    id: faker.datatype.uuid(),
    created: faker.date.past().toISOString(),
    modified: faker.date.past().toISOString(),
    caseId: faker.datatype.uuid(),
    name: faker.lorem.word(),
    type: faker.lorem.word(),
    state: CaseFileState.STORED_IN_RVG,
    size: 1,
    chapter: 0,
    orderWithinChapter: 2,
  },
  {
    id: faker.datatype.uuid(),
    created: faker.date.past().toISOString(),
    modified: faker.date.past().toISOString(),
    caseId: faker.datatype.uuid(),
    name: faker.lorem.word(),
    type: faker.lorem.word(),
    state: CaseFileState.STORED_IN_RVG,
    size: 1,
    chapter: 2,
    orderWithinChapter: 0,
  },
]

describe('getFilesToUpdate', () => {
  it('should return no items when file is not found in files', () => {
    expect(getFilesToUpdate('123', [])).toEqual([null, null, []])
  })

  it('should return the item if a file is reordered but not put under a chapter', () => {
    const items: ReorderableItem[] = [
      {
        id: faker.datatype.uuid(),
        displayText: faker.lorem.words(2),
        isDivider: false,
        isHeading: false,
        chapter: 0,
        orderWithinChapter: 0,
      },
      {
        id: faker.datatype.uuid(),
        displayText: faker.lorem.words(2),
        isDivider: false,
        isHeading: false,
        chapter: 0,
        orderWithinChapter: 1,
      },
      {
        id: faker.datatype.uuid(),
        displayText: faker.lorem.words(2),
        isDivider: false,
        isHeading: true,
        chapter: 1,
      },
      {
        id: faker.datatype.uuid(),
        displayText: faker.lorem.words(2),
        isDivider: false,
        isHeading: false,
        chapter: 1,
        orderWithinChapter: 0,
      },
      {
        id: faker.datatype.uuid(),
        displayText: faker.lorem.words(2),
        isDivider: true,
        isHeading: false,
      },
      {
        id: faker.datatype.uuid(),
        displayText: faker.lorem.words(2),
        isDivider: false,
        isHeading: false,
      },
      {
        id: faker.datatype.uuid(),
        displayText: faker.lorem.words(2),
        isDivider: false,
        isHeading: false,
        chapter: 2,
        orderWithinChapter: 0,
      },
    ]

    expect(getFilesToUpdate(items[items.length - 1].id, items)).toEqual([
      null,
      null,
      [items[items.length - 1]],
    ])
  })

  it('should return the correct chapter, orderWithinChapter and items if a file is reordered as the first item in a chapter', () => {
    const items: ReorderableItem[] = [
      {
        id: faker.datatype.uuid(),
        displayText: faker.lorem.words(2),
        isDivider: false,
        isHeading: false,
      },
      {
        id: faker.datatype.uuid(),
        displayText: faker.lorem.words(2),
        isDivider: false,
        isHeading: false,
        chapter: 0,
        orderWithinChapter: 1,
      },
      {
        id: faker.datatype.uuid(),
        displayText: faker.lorem.words(2),
        isDivider: false,
        isHeading: true,
        chapter: 1,
      },
      {
        id: faker.datatype.uuid(),
        displayText: faker.lorem.words(2),
        isDivider: false,
        isHeading: false,
        chapter: 1,
        orderWithinChapter: 0,
      },
      {
        id: faker.datatype.uuid(),
        displayText: faker.lorem.words(2),
        isDivider: true,
        isHeading: false,
      },
      {
        id: faker.datatype.uuid(),
        displayText: faker.lorem.words(2),
        isDivider: false,
        isHeading: false,
      },
      {
        id: faker.datatype.uuid(),
        displayText: faker.lorem.words(2),
        isDivider: false,
        isHeading: false,
      },
    ]

    expect(getFilesToUpdate(items[0].id, items)).toEqual([
      0,
      0,
      [items[0], items[1]],
    ])
  })

  it('should return the correct chapter, orderWithinChapter and items if a file is reordered as the last item in a chapter', () => {
    const items: ReorderableItem[] = [
      {
        id: faker.datatype.uuid(),
        displayText: faker.lorem.words(2),
        isDivider: false,
        isHeading: false,
        chapter: 0,
        orderWithinChapter: 0,
      },
      {
        id: faker.datatype.uuid(),
        displayText: faker.lorem.words(2),
        isDivider: false,
        isHeading: false,
      },
      {
        id: faker.datatype.uuid(),
        displayText: faker.lorem.words(2),
        isDivider: false,
        isHeading: true,
        chapter: 1,
      },
      {
        id: faker.datatype.uuid(),
        displayText: faker.lorem.words(2),
        isDivider: false,
        isHeading: false,
        chapter: 1,
        orderWithinChapter: 0,
      },
      {
        id: faker.datatype.uuid(),
        displayText: faker.lorem.words(2),
        isDivider: true,
        isHeading: false,
      },
      {
        id: faker.datatype.uuid(),
        displayText: faker.lorem.words(2),
        isDivider: false,
        isHeading: false,
      },
      {
        id: faker.datatype.uuid(),
        displayText: faker.lorem.words(2),
        isDivider: false,
        isHeading: false,
      },
    ]

    expect(getFilesToUpdate(items[1].id, items)).toEqual([0, 1, [items[1]]])
  })

  it('should return the correct chapter, orderWithinChapter and items if a file is reordered under a previously empty chapter', () => {
    const items: ReorderableItem[] = [
      {
        id: faker.datatype.uuid(),
        displayText: faker.lorem.words(2),
        isDivider: false,
        isHeading: false,
        chapter: 0,
        orderWithinChapter: 0,
      },
      {
        id: faker.datatype.uuid(),
        displayText: faker.lorem.words(2),
        isDivider: false,
        isHeading: false,
        chapter: 0,
        orderWithinChapter: 1,
      },
      {
        id: faker.datatype.uuid(),
        displayText: faker.lorem.words(2),
        isDivider: false,
        isHeading: true,
        chapter: 1,
      },
      {
        id: faker.datatype.uuid(),
        displayText: faker.lorem.words(2),
        isDivider: false,
        isHeading: false,
        chapter: 4,
        orderWithinChapter: 4,
      },
      {
        id: faker.datatype.uuid(),
        displayText: faker.lorem.words(2),
        isDivider: true,
        isHeading: false,
      },
      {
        id: faker.datatype.uuid(),
        displayText: faker.lorem.words(2),
        isDivider: false,
        isHeading: false,
      },
      {
        id: faker.datatype.uuid(),
        displayText: faker.lorem.words(2),
        isDivider: false,
        isHeading: false,
      },
    ]

    expect(getFilesToUpdate(items[3].id, items)).toEqual([1, 0, [items[3]]])
  })
})

describe('sortedFilesInChapter', () => {
  it('should return an empty array if there are no files in chapter', () => {
    expect(sortedFilesInChapter(1, caseFiles)).toEqual([])
  })

  it('should return an array of files in chapter sorted by orderWithinChapter', () => {
    expect(sortedFilesInChapter(0, caseFiles)).toEqual([
      {
        canEdit: ['fileName', 'displayDate'],
        category: undefined,
        displayDate: undefined,
        status: FileUploadStatus.done,
        size: 1,
        userGeneratedFilename: undefined,
        displayText: caseFiles[1].name,
        isDivider: false,
        isHeading: false,
        chapter: 0,
        id: caseFiles[1].id,
        created: caseFiles[1].created,
        orderWithinChapter: caseFiles[1].orderWithinChapter,
        canOpen: false,
      },
      {
        canEdit: ['fileName', 'displayDate'],
        category: undefined,
        displayDate: undefined,
        status: FileUploadStatus.done,
        size: 1,
        userGeneratedFilename: undefined,
        displayText: caseFiles[0].name,
        isDivider: false,
        isHeading: false,
        chapter: 0,
        id: caseFiles[0].id,
        created: caseFiles[0].created,
        orderWithinChapter: caseFiles[0].orderWithinChapter,
        canOpen: false,
      },
      {
        canEdit: ['fileName', 'displayDate'],
        category: undefined,
        displayDate: undefined,
        status: FileUploadStatus.done,
        size: 1,
        userGeneratedFilename: undefined,
        displayText: caseFiles[2].name,
        isDivider: false,
        isHeading: false,
        chapter: 0,
        id: caseFiles[2].id,
        created: caseFiles[2].created,
        orderWithinChapter: caseFiles[2].orderWithinChapter,
        canOpen: false,
      },
    ] as ReorderableItem[])
  })

  it('should only return an array of files in a given chapter', () => {
    expect(sortedFilesInChapter(0, caseFiles).length).toEqual(3)
  })
})

// The update mutations run with Apollo's default errorPolicy, so a failed
// request rejects instead of populating `errors` on the result. The handlers
// have to catch to report anything at all.
const mockUpdateFiles = jest.fn()

jest.mock('./updateFiles.generated', () => ({
  useUpdateFilesMutation: () => [mockUpdateFiles],
}))

jest.mock('./updatePoliceDigitalCaseFiles.generated', () => ({
  useUpdatePoliceDigitalCaseFilesMutation: () => [jest.fn()],
}))

jest.mock('@island.is/judicial-system-web/src/utils/toast', () => ({
  toast: { error: jest.fn(), success: jest.fn(), warning: jest.fn() },
}))

describe('IndictmentsCaseFilesAccordionItem - renaming a file', () => {
  const caseId = faker.datatype.uuid()
  const file = {
    id: faker.datatype.uuid(),
    created: '2026-01-05T10:00:00.000Z',
    modified: '2026-01-05T10:00:00.000Z',
    caseId,
    name: 'skyrsla.pdf',
    type: 'application/pdf',
    state: CaseFileState.STORED_IN_RVG,
    size: 1,
    chapter: 0,
    orderWithinChapter: 0,
  }

  const renderItem = () =>
    render(
      <MockedProvider mocks={[]}>
        <IntlProviderWrapper>
          <FormContextWrapper theCase={mockCase(CaseType.INDICTMENT)}>
            <IndictmentsCaseFilesAccordionItem
              policeCaseNumber="007-2026-1"
              caseFiles={[file]}
              policeDigitalCaseFiles={[]}
              caseId={caseId}
              shouldStartExpanded
              setEditCount={jest.fn()}
            />
          </FormContextWrapper>
        </IntlProviderWrapper>
      </MockedProvider>,
    )

  const saveRename = async () => {
    await userEvent.click(
      await screen.findByRole('button', { name: 'Breyta skrá' }),
    )
    await userEvent.click(
      await screen.findByRole('button', { name: 'Vista breytingar' }),
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('reports a failed rename once', async () => {
    mockUpdateFiles.mockRejectedValueOnce(new Error('network down'))

    renderItem()
    await saveRename()

    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1))
    expect(toast.error).toHaveBeenCalledWith('Ekki tókst að endurnefna skjal')
  })

  it('does not toast when the rename succeeds', async () => {
    mockUpdateFiles.mockResolvedValueOnce({
      data: { updateFiles: { caseFiles: [{ id: file.id }] } },
    })

    renderItem()
    await saveRename()

    await waitFor(() => expect(mockUpdateFiles).toHaveBeenCalledTimes(1))
    expect(toast.error).not.toHaveBeenCalled()
  })
})
