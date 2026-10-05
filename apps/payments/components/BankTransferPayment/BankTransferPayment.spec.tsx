import { ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { fireEvent, render, waitFor } from '@testing-library/react'

import { BankTransferPayment } from './BankTransferPayment'

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({
    lang: 'is',
    formatMessage: (message: { defaultMessage?: string; id: string }) =>
      message.defaultMessage ?? message.id,
  }),
}))

// Same form setup as the payment page.
const Form = ({ children }: { children: ReactNode }) => {
  const methods = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: { bank: '', ledger: '', account: '', actorNationalId: '' },
  })
  return <FormProvider {...methods}>{children}</FormProvider>
}

const renderInputs = () => {
  const { container } = render(
    <Form>
      <BankTransferPayment />
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
    ])('splits %s across the inputs from the bank input', async (_, text) => {
      const { bank, ledger, account } = renderInputs()
      bank.focus()

      paste(bank, text)

      // The bank part must survive the focus moving off it: `onBlur` pads whatever the input holds
      // at that moment, so focusing before the pasted value has rendered wiped it.
      await waitFor(() => expect(account).toBe(document.activeElement))
      expect(bank.value).toBe('0001')
      expect(ledger.value).toBe('12')
      expect(account.value).toBe('001234')
    })

    it('fills from the ledger input onwards', async () => {
      const { bank, ledger, account } = renderInputs()
      ledger.focus()

      paste(ledger, '12-1234')

      await waitFor(() => expect(account).toBe(document.activeElement))
      expect(bank.value).toBe('')
      expect(ledger.value).toBe('12')
      expect(account.value).toBe('001234')
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
