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
}

const secondWithoutEmail: Lawyer = {
  id: 'row-second-without-email',
  name: 'Þórður Prufuson',
  practice: 'Prufustofa',
  email: '',
  phoneNr: '0000002',
  nationalId: '0000000002',
  isLitigator: false,
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
}

const newName: Lawyer = {
  id: 'row-new-name',
  name: 'Prufa Nýjadóttir',
  practice: 'Stofa B',
  email: 'shared@dummy.dd',
  phoneNr: '0000003',
  nationalId: '0000000003',
  isLitigator: true,
}

const lawyers = [firstWithoutEmail, secondWithoutEmail, oldName, newName]

const renderPicker = (
  onAdvocateChange: jest.Mock,
  selected?: Pick<Lawyer, 'name' | 'nationalId' | 'email' | 'phoneNr'>,
) =>
  render(
    <IntlProviderWrapper>
      <LawyerRegistryContext.Provider value={{ lawyers }}>
        <InputAdvocate
          advocateType="litigator"
          name={selected?.name}
          nationalId={selected?.nationalId}
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

  it('highlights the entry whose name matches when a national id is listed twice', () => {
    renderPicker(jest.fn(), newName)

    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' })

    const option = screen
      .getByText(`${newName.name} (${newName.practice})`)
      .closest('[role="option"]')
    const otherOption = screen
      .getByText(`${oldName.name} (${oldName.practice})`)
      .closest('[role="option"]')

    expect(option).toHaveAttribute('aria-selected', 'true')
    expect(otherOption).toHaveAttribute('aria-selected', 'false')
  })

  it('clears the advocate when the selection is cleared', () => {
    const onAdvocateChange = jest.fn()
    renderPicker(onAdvocateChange, secondWithoutEmail)

    const input = screen.getByRole('combobox')
    fireEvent.keyDown(input, { key: 'Backspace' })

    expect(onAdvocateChange).toHaveBeenCalledWith(null, null, null, null)
  })
})
