import { fireEvent, render, screen, within } from '@testing-library/react'
import { ButtonHTMLAttributes, ReactNode } from 'react'
import { MainContentColumn } from './MainColumns'

jest.mock('./MainColumn.css', () => ({}))
jest.mock('@apollo/client', () => ({
  useMutation: () => [jest.fn()],
}))
jest.mock('@island.is/form-system/graphql', () => ({
  DELETE_FIELD: 'DELETE_FIELD',
  DELETE_SCREEN: 'DELETE_SCREEN',
  DELETE_SECTION: 'DELETE_SECTION',
}))
jest.mock('../../../context/ControlContext', () => ({
  ControlContext: jest.requireActual('react').createContext({
    control: {
      activeItem: {
        type: 'Section',
        data: { id: 'premises', sectionType: 'PREMISES' },
      },
      form: {},
      isReadOnly: true,
    },
    inSettings: true,
  }),
}))
jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: (message: { defaultMessage: string }) =>
      message.defaultMessage,
  }),
}))
jest.mock('@island.is/form-system/ui', () => ({
  m: {
    preview: { defaultMessage: 'Skoða skjá' },
    previewWithRestrictions: { defaultMessage: 'Skoða með tengingum' },
  },
}))
jest.mock('@island.is/island-ui/core', () => {
  const Container = ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  )
  return {
    Box: Container,
    Text: Container,
    Stack: Container,
    GridRow: Container,
    GridColumn: Container,
    Button: ({
      children,
      onClick,
    }: ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button onClick={onClick}>{children}</button>
    ),
  }
})
jest.mock('./DeleteButton', () => ({ DeleteButton: () => null }))
jest.mock('../../MainContent/MainContent', () => ({
  MainContent: ({
    openPreview,
    enforcePreviewRestrictions,
    onPreviewScreen,
  }: {
    openPreview: boolean
    enforcePreviewRestrictions: boolean
    onPreviewScreen: () => void
  }) => {
    const { Premises } = jest.requireActual(
      '../../MainContent/components/Premises/Premises',
    )
    return openPreview ? (
      <div role="dialog" data-restricted={enforcePreviewRestrictions}>
        Gagnaöflun
      </div>
    ) : (
      <Premises onPreview={onPreviewScreen} />
    )
  },
}))

it('only offers the unrestricted data-collection preview in read-only settings', () => {
  render(<MainContentColumn />)

  expect(
    screen.queryByRole('button', { name: 'Skoða með tengingum' }),
  ).toBeNull()

  const headingRow = screen.getByText('Gagnaöflun').parentElement
  if (!headingRow) {
    throw new Error('Missing data-collection heading row')
  }
  expect(
    within(headingRow).getByRole('button', { name: 'Skoða skjá' }),
  ).toBeTruthy()

  fireEvent.click(screen.getByRole('button', { name: 'Skoða skjá' }))

  expect(screen.getByRole('dialog').getAttribute('data-restricted')).toBe(
    'false',
  )
  expect(screen.queryByRole('button', { name: 'Skoða skjá' })).toBeNull()
})
