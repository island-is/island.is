import { ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { BankTransferPayment, CompanyPayer } from './BankTransferPayment'

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({
    lang: 'is',
    formatMessage: (message: { defaultMessage?: string; id: string }) =>
      message.defaultMessage ?? message.id,
  }),
}))

// Same form setup as the payment page, with its submit button disabled until the form is valid.
const Form = ({ children }: { children: ReactNode }) => {
  const methods = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: { bank: '', ledger: '', account: '', actorNationalId: '' },
  })
  return (
    <FormProvider {...methods}>
      <form>
        {children}
        <button type="submit" disabled={!methods.formState.isValid}>
          Hefja millifærslu
        </button>
      </form>
    </FormProvider>
  )
}

const renderInputs = (companyPayer?: CompanyPayer) => {
  const { container } = render(
    <Form>
      <BankTransferPayment companyPayer={companyPayer} />
    </Form>,
  )
  const input = (part: string) =>
    container.querySelector<HTMLInputElement>(
      `#bank-account-${part}`,
    ) as HTMLInputElement

  return {
    bank: input('bank'),
    ledger: input('ledger'),
    account: input('account'),
    submit: container.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement,
  }
}

const paste = (target: HTMLInputElement, text: string) =>
  fireEvent.paste(target, { clipboardData: { getData: () => text } })

describe('BankTransferPayment', () => {
  describe('pasting an account number', () => {
    it.each([
      ['separated and short', '1-12-1234'],
      ['separated and full', '0001-12-001234'],
      ['bare digits', '000112001234'],
      ['bare digits and short', '0001121234'],
    ])(
      'splits %s across the inputs, padded, and moves on to the submit button',
      async (_, text) => {
        const { bank, ledger, account, submit } = renderInputs()
        bank.focus()

        paste(bank, text)

        // The bank part must survive the focus moving off it: `onBlur` pads whatever the input
        // holds at that moment, so focusing before the pasted value had rendered wiped it.
        await waitFor(() => expect(submit).toBe(document.activeElement))
        expect(bank.value).toBe('0001')
        expect(ledger.value).toBe('12')
        expect(account.value).toBe('001234')
      },
    )

    it.each(['ledger', 'account'] as const)(
      'splits a whole number pasted into the %s input from the bank onwards',
      async (part) => {
        const inputs = renderInputs()
        inputs[part].focus()

        paste(inputs[part], '0001-12-001234')

        await waitFor(() => expect(inputs.submit).toBe(document.activeElement))
        expect(inputs.bank.value).toBe('0001')
        expect(inputs.ledger.value).toBe('12')
        expect(inputs.account.value).toBe('001234')
      },
    )

    it('fills from the ledger input onwards and focuses the part left empty', async () => {
      const { bank, ledger, account } = renderInputs()
      ledger.focus()

      paste(ledger, '12-1234')

      await waitFor(() => expect(bank).toBe(document.activeElement))
      expect(bank.value).toBe('')
      expect(ledger.value).toBe('12')
      expect(account.value).toBe('001234')
      // Only the pasted parts are validated, so the empty bank is not flagged yet.
      expect(
        screen.queryByText('Úttektarreikningur er nauðsynlegur'),
      ).toBeNull()
    })

    it('moves on to the submit button when a paste completes a typed bank', async () => {
      const { bank, ledger, account, submit } = renderInputs()
      fireEvent.change(bank, { target: { value: '0001' } })
      ledger.focus()

      paste(ledger, '12-1234')

      await waitFor(() => expect(submit).toBe(document.activeElement))
      expect(bank.value).toBe('0001')
      expect(ledger.value).toBe('12')
      expect(account.value).toBe('001234')
    })

    it('focuses the approver national id a company payer still has to fill', async () => {
      const { bank, ledger, account, submit } = renderInputs({
        nationalId: '6010100890',
        name: 'Aranja ehf.',
      })
      bank.focus()

      paste(bank, '0001-12-001234')

      const actor = document.querySelector<HTMLInputElement>(
        'input[name="actorNationalId"]',
      ) as HTMLInputElement
      await waitFor(() => expect(actor).toBe(document.activeElement))
      expect(bank.value).toBe('0001')
      expect(ledger.value).toBe('12')
      expect(account.value).toBe('001234')
      expect(submit.disabled).toBe(true)
      // Not flagged before the payer has had a chance to fill it in.
      expect(
        screen.queryByText('Kennitala samþykktaraðila er nauðsynleg.'),
      ).toBeNull()
    })

    it('leaves a short paste to the browser', () => {
      const { bank, ledger, account } = renderInputs()
      bank.focus()

      const event = paste(bank, '0001')

      // Not prevented: the browser inserts the text and `onChange` handles it as typing.
      expect(event).toBe(true)
      expect(bank.value).toBe('')
      expect(ledger.value).toBe('')
      expect(account.value).toBe('')
      expect(bank).toBe(document.activeElement)
    })
  })
})
