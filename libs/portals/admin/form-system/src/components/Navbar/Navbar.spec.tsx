import { useMutation } from '@apollo/client'
import { CREATE_SECTION, DELETE_SECTION } from '@island.is/form-system/graphql'
import { SectionTypes } from '@island.is/form-system/enums'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ComponentProps, ReactNode } from 'react'
import { ControlContext } from '../../context/ControlContext'
import { Navbar } from './Navbar'

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useMutation: jest.fn(),
}))
jest.mock('@island.is/form-system/ui', () => ({ m: { addSection: {} } }))
jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: () => 'Add section' }),
}))
jest.mock('@island.is/island-ui/core', () => ({
  Box: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Button: ({ children, onClick, disabled }: ComponentProps<'button'>) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}))
jest.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DragOverlay: () => null,
}))
jest.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}))
jest.mock('react-animate-height', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))
jest.mock('../../lib/utils/useNavbarDnd', () => ({ useNavbarDnD: () => ({}) }))
jest.mock('../../lib/utils/customSections', () => ({}))
jest.mock('../../lib/utils/getBaseSettingsSection', () => ({}))
jest.mock('../NavComponent/NavComponent', () => ({ NavComponent: () => null }))
jest.mock('./Navbar.css', () => ({}))

const createSection = jest.fn()
const deleteSection = jest.fn()
const updateDisplayOrder = jest.fn()
const controlDispatch = jest.fn()
const newSection = { id: 'new-section', formId: 'form' }
const originalOrder = [{ id: 'input' }, { id: 'summary' }]

const renderNavbar = () =>
  render(
    <ControlContext.Provider
      value={
        {
          control: {
            activeItem: { type: 'Section', data: { id: 'input' } },
            form: {
              id: 'form',
              sections: [
                {
                  id: 'input',
                  sectionType: SectionTypes.INPUT,
                  displayOrder: 1,
                },
                {
                  id: 'summary',
                  sectionType: SectionTypes.SUMMARY,
                  displayOrder: 1000,
                },
              ],
              screens: [],
              fields: [],
            },
            isReadOnly: false,
          },
          controlDispatch,
          openComponents: { sections: [], screens: [] },
        } as unknown as React.ContextType<typeof ControlContext>
      }
    >
      <Navbar />
    </ControlContext.Provider>,
  )

beforeEach(() => {
  jest.clearAllMocks()
  createSection
    .mockReset()
    .mockResolvedValue({ data: { createFormSystemSection: newSection } })
  deleteSection.mockReset().mockResolvedValue({})
  updateDisplayOrder.mockReset().mockResolvedValue({})
  jest
    .mocked(useMutation)
    .mockImplementation(
      (mutation) =>
        [
          mutation === CREATE_SECTION
            ? createSection
            : mutation === DELETE_SECTION
            ? deleteSection
            : updateDisplayOrder,
          { loading: false },
        ] as unknown as ReturnType<typeof useMutation>,
    )
  jest.spyOn(console, 'error').mockImplementation(() => undefined)
})

afterEach(() => jest.restoreAllMocks())

it('creates at an unused order and waits for reordering before adding local state', async () => {
  let resolveReorder!: () => void
  updateDisplayOrder.mockReturnValue(
    new Promise<void>((resolve) => {
      resolveReorder = resolve
    }),
  )
  renderNavbar()
  fireEvent.click(screen.getByRole('button', { name: 'Add section' }))
  await waitFor(() => expect(updateDisplayOrder).toHaveBeenCalledTimes(1))

  expect(createSection).toHaveBeenCalledWith({
    variables: {
      input: { createSectionDto: { formId: 'form', displayOrder: 1001 } },
    },
  })
  expect(updateDisplayOrder).toHaveBeenCalledWith({
    variables: {
      input: {
        updateSectionsDisplayOrderDto: {
          sectionsDisplayOrderDto: [
            { id: 'input' },
            { id: 'new-section' },
            { id: 'summary' },
          ],
        },
      },
    },
  })
  expect(controlDispatch).not.toHaveBeenCalled()
  await act(async () => {
    resolveReorder()
  })
  expect(controlDispatch).toHaveBeenCalledWith({
    type: 'ADD_SECTION',
    payload: { section: newSection },
  })
  expect(deleteSection).not.toHaveBeenCalled()
})

it('deletes the new section and restores ordering when reorder rejects', async () => {
  updateDisplayOrder.mockRejectedValueOnce(new Error('Reorder failed'))
  renderNavbar()
  fireEvent.click(screen.getByRole('button', { name: 'Add section' }))
  await waitFor(() =>
    expect(console.error).toHaveBeenCalledWith(
      'Error creating section:',
      'Reorder failed',
    ),
  )

  expect(deleteSection).toHaveBeenCalledWith({
    variables: { input: { id: 'new-section' } },
  })
  expect(updateDisplayOrder).toHaveBeenCalledTimes(2)
  expect(updateDisplayOrder).toHaveBeenLastCalledWith({
    variables: {
      input: {
        updateSectionsDisplayOrderDto: {
          sectionsDisplayOrderDto: originalOrder,
        },
      },
    },
  })
  expect(controlDispatch).not.toHaveBeenCalled()
})

it('handles creation rejection without attempting reorder or recovery', async () => {
  createSection.mockRejectedValueOnce(new Error('Creation failed'))
  renderNavbar()
  fireEvent.click(screen.getByRole('button', { name: 'Add section' }))
  await waitFor(() =>
    expect(console.error).toHaveBeenCalledWith(
      'Error creating section:',
      'Creation failed',
    ),
  )
  expect(updateDisplayOrder).not.toHaveBeenCalled()
  expect(deleteSection).not.toHaveBeenCalled()
  expect(controlDispatch).not.toHaveBeenCalled()
})

it.each(['delete', 'restore'])(
  'handles rejected %s recovery in the existing catch',
  async (step) => {
    updateDisplayOrder.mockRejectedValueOnce(new Error('Reorder failed'))
    if (step === 'delete')
      deleteSection.mockRejectedValueOnce(new Error('Recovery failed'))
    else updateDisplayOrder.mockRejectedValueOnce(new Error('Recovery failed'))
    renderNavbar()
    fireEvent.click(screen.getByRole('button', { name: 'Add section' }))
    await waitFor(() =>
      expect(console.error).toHaveBeenCalledWith(
        'Error creating section:',
        'Recovery failed',
      ),
    )
    expect(controlDispatch).not.toHaveBeenCalled()
  },
)
