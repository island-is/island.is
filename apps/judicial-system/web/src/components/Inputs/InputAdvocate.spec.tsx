import { fireEvent, render, screen } from '@testing-library/react'

import type { Lawyer } from '@island.is/judicial-system/types'
import { LawyerRegistryContext } from '@island.is/judicial-system-web/src/components/LawyerRegistryProvider/LawyerRegistryProvider'
import { IntlProviderWrapper } from '@island.is/judicial-system-web/src/utils/testHelpers'

import InputAdvocate from './InputAdvocate'

// LMFÍ does not list an email for every lawyer, two entries can share one, and
// the same national id can appear twice (e.g. under an old and a new name), so
// the picker identifies entries by their registry row id.
const firstWithoutEmail: Lawyer = {
  id: 'row-first-without-email',
  name: 'Aðalsteinn Prufuson',
  practice: '',
  email: '',
  phoneNr: '0000001',
  nationalId: '0000000001',
  isLitigator: false,
  hasCourtOfAppealsRights: false,
}

const secondWithoutEmail: Lawyer = {
  id: 'row-second-without-email',
  name: 'Þórður Prufuson',
  practice: 'Prufustofa',
  email: '',
  phoneNr: '0000002',
  nationalId: '0000000002',
  isLitigator: false,
  hasCourtOfAppealsRights: false,
}

// The same person listed under an old and a new name: same national id, same
// email, same phone number.
const oldName: Lawyer = {
  id: 'row-old-name',
  name: 'Prufa Gamladóttir',
  practice: 'Stofa A',
  email: 'shared@dummy.dd',
  phoneNr: '0000003',
  nationalId: '0000000003',
  isLitigator: true,
  hasCourtOfAppealsRights: true,
}

const newName: Lawyer = {
  id: 'row-new-name',
  name: 'Prufa Nýjadóttir',
  practice: 'Stofa B',
  email: 'shared@dummy.dd',
  phoneNr: '0000003',
  nationalId: '0000000003',
  isLitigator: true,
  hasCourtOfAppealsRights: true,
}

const paddedEmail: Lawyer = {
  id: 'row-padded-email',
  name: 'Bil Prufuson',
  practice: 'Stofa C',
  email: ' padded@dummy.dd ',
  phoneNr: '0000004',
  nationalId: '0000000004',
  isLitigator: true,
  hasCourtOfAppealsRights: false,
}

const lawyers = [
  firstWithoutEmail,
  secondWithoutEmail,
  oldName,
  newName,
  paddedEmail,
]

const renderContactFields = (contact: {
  email?: string
  phoneNumber?: string
}) => {
  const handlers = {
    onEmailChange: jest.fn(),
    onEmailSave: jest.fn(),
    onPhoneNumberChange: jest.fn(),
    onPhoneNumberSave: jest.fn(),
  }

  render(
    <IntlProviderWrapper>
      <LawyerRegistryContext.Provider value={{ lawyers }}>
        <InputAdvocate
          advocateType="litigator"
          name="Test Verjandi"
          email={contact.email}
          phoneNumber={contact.phoneNumber}
          onAdvocateChange={jest.fn()}
          {...handlers}
        />
      </LawyerRegistryContext.Provider>
    </IntlProviderWrapper>,
  )

  return handlers
}

const renderPicker = (
  onAdvocateChange: jest.Mock,
  selected?: Pick<Lawyer, 'name' | 'email' | 'phoneNr'>,
) =>
  render(
    <IntlProviderWrapper>
      <LawyerRegistryContext.Provider value={{ lawyers }}>
        <InputAdvocate
          advocateType="litigator"
          name={selected?.name}
          email={selected?.email}
          phoneNumber={selected?.phoneNr}
          onAdvocateChange={onAdvocateChange}
          onEmailChange={jest.fn()}
          onEmailSave={jest.fn()}
          onPhoneNumberChange={jest.fn()}
          onPhoneNumberSave={jest.fn()}
        />
      </LawyerRegistryContext.Provider>
    </IntlProviderWrapper>,
  )

const pickLawyer = (lawyer: Lawyer) => {
  const input = screen.getByRole('combobox')

  fireEvent.change(input, { target: { value: lawyer.name } })
  fireEvent.click(screen.getByText(`${lawyer.name} (${lawyer.practice})`))
}

describe('InputAdvocate', () => {
  it('selects the lawyer that was clicked when the lawyer has no email', () => {
    const onAdvocateChange = jest.fn()
    renderPicker(onAdvocateChange)

    pickLawyer(secondWithoutEmail)

    expect(onAdvocateChange).toHaveBeenCalledWith(
      secondWithoutEmail.name,
      secondWithoutEmail.nationalId,
      secondWithoutEmail.email,
      secondWithoutEmail.phoneNr,
    )
    expect(onAdvocateChange).not.toHaveBeenCalledWith(
      firstWithoutEmail.name,
      expect.anything(),
      expect.anything(),
      expect.anything(),
    )
  })

  it('selects either entry of a lawyer listed twice under one national id', () => {
    const onAdvocateChange = jest.fn()
    const { unmount } = renderPicker(onAdvocateChange)

    pickLawyer(newName)

    expect(onAdvocateChange).toHaveBeenLastCalledWith(
      newName.name,
      newName.nationalId,
      newName.email,
      newName.phoneNr,
    )

    unmount()
    renderPicker(onAdvocateChange)

    pickLawyer(oldName)

    expect(onAdvocateChange).toHaveBeenLastCalledWith(
      oldName.name,
      oldName.nationalId,
      oldName.email,
      oldName.phoneNr,
    )
  })

  it('shows the selected lawyer', () => {
    renderPicker(jest.fn(), secondWithoutEmail)

    expect(screen.getByText(secondWithoutEmail.name)).toBeInTheDocument()
  })

  it('clears the advocate when the selection is cleared', () => {
    const onAdvocateChange = jest.fn()
    renderPicker(onAdvocateChange, secondWithoutEmail)

    const input = screen.getByRole('combobox')
    fireEvent.keyDown(input, { key: 'Backspace' })

    expect(onAdvocateChange).toHaveBeenCalledWith(null, null, null, null)
  })

  it('trims the email of the selected lawyer', () => {
    const onAdvocateChange = jest.fn()
    renderPicker(onAdvocateChange)

    pickLawyer(paddedEmail)

    expect(onAdvocateChange).toHaveBeenCalledWith(
      paddedEmail.name,
      paddedEmail.nationalId,
      'padded@dummy.dd',
      paddedEmail.phoneNr,
    )
  })

  it('trims an email as it is entered', () => {
    const { onEmailChange } = renderContactFields({})

    fireEvent.change(screen.getByTestId('defenderEmail'), {
      target: { value: ' testverjandi@dummy.dd ' },
    })

    expect(onEmailChange).toHaveBeenCalledWith('testverjandi@dummy.dd')
  })

  it('saves an email without its surrounding whitespace', () => {
    const { onEmailSave } = renderContactFields({
      email: 'testverjandi@dummy.dd ',
    })

    fireEvent.blur(screen.getByTestId('defenderEmail'))

    expect(onEmailSave).toHaveBeenCalledWith('testverjandi@dummy.dd')
    expect(
      screen.queryByText('Netfang ekki á réttu formi'),
    ).not.toBeInTheDocument()
  })

  it('does not save an invalid email', () => {
    const { onEmailSave } = renderContactFields({ email: 'testverjandi' })

    fireEvent.blur(screen.getByTestId('defenderEmail'))

    expect(onEmailSave).not.toHaveBeenCalled()
    expect(screen.getByText('Netfang ekki á réttu formi')).toBeInTheDocument()
  })

  it('saves a cleared email', () => {
    const { onEmailSave } = renderContactFields({ email: '' })

    fireEvent.blur(screen.getByTestId('defenderEmail'))

    expect(onEmailSave).toHaveBeenCalledWith(null)
  })

  it('does not save an invalid phone number', () => {
    const { onPhoneNumberSave } = renderContactFields({ phoneNumber: '123' })

    fireEvent.blur(screen.getByTestId('defenderPhoneNumber'))

    expect(onPhoneNumberSave).not.toHaveBeenCalled()
    expect(screen.getByText('Dæmi: 555-5555')).toBeInTheDocument()
  })

  it('saves a valid phone number', () => {
    const { onPhoneNumberSave } = renderContactFields({
      phoneNumber: '0000000',
    })

    fireEvent.blur(screen.getByTestId('defenderPhoneNumber'))

    expect(onPhoneNumberSave).toHaveBeenCalledWith('000-0000')
  })
})
