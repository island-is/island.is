import {
  friendlyFormatSWIFT,
  getBankIsk,
  friendlyFormatIBAN,
  validIBAN,
  validSWIFT,
} from './socialInsuranceAdministrationUtils'
import { BankInfo } from './types'

describe('getBankIsk', () => {
  it('should return icelandic bank number if bank, ledger and account number is returned', () => {
    const bankInfo: BankInfo = {
      bank: '2222',
      ledger: '00',
      accountNumber: '123456',
    }
    const bankNumer = getBankIsk(bankInfo)

    expect('222200123456').toEqual(bankNumer)
  })
})

describe('friendlyFormat & valid', () => {
  it('format swift', () => {
    const bankInfo: BankInfo = {
      iban: 'NL91ABNA0417164300',
      swift: 'NEDSZAJJXXX',
      foreignBankName: 'Heiti banka',
      foreignBankAddress: 'Heimili banka',
      currency: 'EUR',
    }
    const formattedSWIFT = friendlyFormatSWIFT(bankInfo.swift)

    expect('NEDS ZA JJ XXX').toEqual(formattedSWIFT)
  })

  it('format iban', () => {
    const bankInfo: BankInfo = {
      iban: 'NL91ABNA0417164300',
      swift: 'NEDSZAJJXXX',
      foreignBankName: 'Heiti banka',
      foreignBankAddress: 'Heimili banka',
      currency: 'EUR',
    }
    const formattedIBAN = friendlyFormatIBAN(bankInfo.iban)

    expect('NL91 ABNA 0417 1643 00').toEqual(formattedIBAN)
  })

  it('valid iban - should return false because the check digits should be numbers', () => {
    const bankInfo: BankInfo = {
      iban: 'NLLLABNA0417164300',
      swift: 'NEDSZAJJXXX',
      foreignBankName: 'Heiti banka',
      foreignBankAddress: 'Heimili banka',
      currency: 'EUR',
    }
    const iban = validIBAN(bankInfo.iban)

    expect(false).toEqual(iban)
  })

  it('valid iban - should return true if the iban is right structured', () => {
    const bankInfo: BankInfo = {
      iban: 'NL91ABNA0417164300',
      swift: 'NEDSZAJJXXX',
      foreignBankName: 'Heiti banka',
      foreignBankAddress: 'Heimili banka',
      currency: 'EUR',
    }
    const iban = validIBAN(bankInfo.iban)

    expect(true).toEqual(iban)
  })

  it('valid swift - should return false because the country code should be letters', () => {
    const bankInfo: BankInfo = {
      iban: 'NLLLABNA0417164300',
      swift: 'NE32ZAJJXXX',
      foreignBankName: 'Heiti banka',
      foreignBankAddress: 'Heimili banka',
      currency: 'EUR',
    }
    const swift = validSWIFT(bankInfo.swift)

    expect(false).toEqual(swift)
  })

  it('valid swift - should return true if the swift is right structured', () => {
    const bankInfo: BankInfo = {
      iban: 'NL91ABNA0417164300',
      swift: 'NEDSZAJJXXX',
      foreignBankName: 'Heiti banka',
      foreignBankAddress: 'Heimili banka',
      currency: 'EUR',
    }
    const swift = validSWIFT(bankInfo.swift)

    expect(true).toEqual(swift)
  })
})
