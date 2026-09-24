import { fireEvent, render, screen } from '@testing-library/react'

import type { Lawyer } from '@island.is/judicial-system/types'
import { LawyerRegistryContext } from '@island.is/judicial-system-web/src/components/LawyerRegistryProvider/LawyerRegistryProvider'
import { IntlProviderWrapper } from '@island.is/judicial-system-web/src/utils/testHelpers'

import InputAdvocate from './InputAdvocate'

// LMFÍ does not list an email for every lawyer, and two entries can share one,
// so the picker must identify lawyers by national id and never by email.
const arni: Lawyer = {
  name: 'Árni Harðarson',
  practice: '',
  email: '',
  phoneNr: '0000001',
  nationalId: '0000000001',
  isLitigator: false,
}

const thorgeir: Lawyer = {
  name: 'Þorgeir Þorgeirsson',
  practice: 'Lagaskjól - lögmannsstofa',
  email: '',
  phoneNr: '0000002',
  nationalId: '0000000002',
  isLitigator: false,
}

const jonsdottir: Lawyer = {
  name: 'Þórunn Pálína Jónsdóttir',
  practice: 'Stofa A',
  email: 'shared@dummy.dd',
  phoneNr: '0000003',
  nationalId: '0000000003',
  isLitigator: true,
}

const sigurborgardottir: Lawyer = {
  name: 'Þórunn Pálína Sigurborgardóttir',
  practice: 'Stofa B',
  email: 'shared@dummy.dd',
  phoneNr: '0000004',
  nationalId: '0000000004',
  isLitigator: true,
}

const lawyers = [arni, thorgeir, jonsdottir, sigurborgardottir]

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

    pickLawyer(thorgeir)

    expect(onAdvocateChange).toHaveBeenCalledWith(
      thorgeir.name,
      thorgeir.nationalId,
      thorgeir.email,
      thorgeir.phoneNr,
    )
    expect(onAdvocateChange).not.toHaveBeenCalledWith(
      arni.name,
      expect.anything(),
      expect.anything(),
      expect.anything(),
    )
  })

  it('tells apart two lawyers who share an email', () => {
    const onAdvocateChange = jest.fn()
    renderPicker(onAdvocateChange)

    pickLawyer(sigurborgardottir)

    expect(onAdvocateChange).toHaveBeenCalledWith(
      sigurborgardottir.name,
      sigurborgardottir.nationalId,
      sigurborgardottir.email,
      sigurborgardottir.phoneNr,
    )
  })

  it('shows the selected lawyer', () => {
    renderPicker(jest.fn(), thorgeir)

    expect(screen.getByText(thorgeir.name)).toBeInTheDocument()
  })

  it('clears the advocate when the selection is cleared', () => {
    const onAdvocateChange = jest.fn()
    renderPicker(onAdvocateChange, thorgeir)

    const input = screen.getByRole('combobox')
    fireEvent.keyDown(input, { key: 'Backspace' })

    expect(onAdvocateChange).toHaveBeenCalledWith(null, null, null, null)
  })
})
