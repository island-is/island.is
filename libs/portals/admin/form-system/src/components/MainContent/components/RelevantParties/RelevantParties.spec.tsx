import { fireEvent, render, screen, within } from '@testing-library/react'
import { ButtonHTMLAttributes, ReactNode } from 'react'
import { RelevantParties } from './RelevantParties'

jest.mock('@apollo/client', () => ({
  useMutation: () => [jest.fn()],
}))
jest.mock('@island.is/form-system/graphql', () => ({
  CREATE_APPLICANT: 'CREATE_APPLICANT',
  DELETE_APPLICANT: 'DELETE_APPLICANT',
}))
jest.mock('../../../../context/ControlContext', () => ({
  ControlContext: jest.requireActual('react').createContext({
    control: { form: { fields: [] }, isReadOnly: true },
  }),
}))
jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: (message?: { defaultMessage: string }) =>
      message?.defaultMessage ?? '',
  }),
}))
jest.mock('@island.is/form-system/ui', () => ({
  m: {
    selectIndividuals: {
      defaultMessage: 'Veldu þá einstaklinga sem mega opna þessa umsókn',
    },
    preview: { defaultMessage: 'Skoða skjá' },
  },
}))
jest.mock('./components/PartyType', () => ({ PartyType: () => null }))
jest.mock('@island.is/island-ui/core', () => {
  const Container = ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  )
  return {
    Box: Container,
    Stack: Container,
    Text: Container,
    Button: ({
      children,
      onClick,
    }: ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button onClick={onClick}>{children}</button>
    ),
  }
})

it('offers a screen preview before the applicants heading in read-only settings', () => {
  const onPreview = jest.fn()
  render(<RelevantParties onPreview={onPreview} />)

  const headingRow = screen.getByText(
    'Veldu þá einstaklinga sem mega opna þessa umsókn',
  ).parentElement
  if (!headingRow) {
    throw new Error('Missing applicants heading row')
  }
  expect(
    within(headingRow)
      .getByRole('button', { name: 'Skoða skjá' })
      .compareDocumentPosition(
        screen.getByText('Veldu þá einstaklinga sem mega opna þessa umsókn'),
      ) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy()

  fireEvent.click(
    within(headingRow).getByRole('button', { name: 'Skoða skjá' }),
  )

  expect(onPreview).toHaveBeenCalledTimes(1)
  expect(
    screen.queryByRole('button', { name: 'Skoða með tengingum' }),
  ).toBeNull()
})
