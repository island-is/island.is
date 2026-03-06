import { BankInfo, PaymentInfo } from '../types'
import { BankAccountType } from './constants'
import {
  formatBankAccount,
  formatBank,
  formatBankInfo,
  friendlyFormatIBAN,
  friendlyFormatSWIFT,
  getBankIsk,
  getCategoriesOptions,
  getCurrencies,
  getOneInstanceOfCategory,
  getTypesOptions,
  shouldNotUpdateBankAccount,
  typeOfBankInfo,
  validIBAN,
  validSWIFT,
} from './socialInsuranceAdministrationUtils'

describe('formatBankInfo', () => {
  it('format bank info', () => {
    const bankInfo = '2222-00-123456'
    const formattedBank = formatBankInfo(bankInfo)

    expect('222200123456').toEqual(formattedBank)
  })
})

describe('formatBankAccount', () => {
  it('format bank account to string', () => {
    const bankInfo: PaymentInfo = {
      bankNumber: '2222',
      ledger: '00',
      accountNumber: '123456',
      bankAccountType: BankAccountType.ICELANDIC,
    }
    const bankInfoString = formatBankAccount(bankInfo)
    expect('2222-00-123456').toEqual(bankInfoString)
  })
})

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

describe('formatBank', () => {
  it('format bank', () => {
    const bankInfo = '222200123456'
    const formattedBank = formatBank(bankInfo)

    expect('2222-00-123456').toEqual(formattedBank)
  })
})

describe('shouldNotUpdateBankAccount', () => {
  it('should return true if bank account returned from TR is not changed', () => {
    const bankInfo: BankInfo = {
      bank: '2222',
      ledger: '00',
      accountNumber: '123456',
    }
    const paymentInfo: PaymentInfo = {
      bankAccountType: BankAccountType.ICELANDIC,
      bank: '222200123456',
    }
    const res = shouldNotUpdateBankAccount(bankInfo, paymentInfo)

    expect(true).toEqual(res)
  })

  it('should return false if bank account returned from TR is changed', () => {
    const bankInfo: BankInfo = {
      bank: '2222',
      ledger: '00',
      accountNumber: '123456',
    }
    const paymentInfo: PaymentInfo = {
      bankAccountType: BankAccountType.ICELANDIC,
      bank: '222200000000',
    }
    const res = shouldNotUpdateBankAccount(bankInfo, paymentInfo)

    expect(false).toEqual(res)
  })

  it('should return true if foreign bank account returned from TR is not changed', () => {
    const bankInfo: BankInfo = {
      iban: 'NL91ABNA0417164300',
      swift: 'NEDSZAJJXXX',
      foreignBankName: 'Heiti banka',
      foreignBankAddress: 'Heimili banka',
      currency: 'EUR',
    }
    const paymentInfo: PaymentInfo = {
      bankAccountType: BankAccountType.FOREIGN,
      iban: 'NL91ABNA0417164300',
      swift: 'NEDSZAJJXXX',
      bankName: 'Heiti banka',
      bankAddress: 'Heimili banka',
      currency: 'EUR',
    }
    const res = shouldNotUpdateBankAccount(bankInfo, paymentInfo)

    expect(true).toEqual(res)
  })

  it('should return false if foreign bank account returned from TR is changed', () => {
    const bankInfo: BankInfo = {
      iban: 'NLLLABNA0417164300',
      swift: 'NEDSZAJJXXX',
      foreignBankName: 'Heiti banka',
      foreignBankAddress: 'Heimili banka',
      currency: 'EUR',
    }
    const paymentInfo: PaymentInfo = {
      bankAccountType: BankAccountType.FOREIGN,
      iban: 'NL91ABNA0417164300',
      swift: 'NEDSZAJJXXX',
      bankName: 'Heiti banka',
      bankAddress: 'Heimili banka',
      currency: 'EUR',
    }
    const res = shouldNotUpdateBankAccount(bankInfo, paymentInfo)

    expect(false).toEqual(res)
  })

  it('should return true if bank account returned from TR is not changed (BankAccountFormField)', () => {
    const bankInfo: BankInfo = {
      bank: '2222',
      ledger: '00',
      accountNumber: '123456',
    }
    const paymentInfo: PaymentInfo = {
      bankNumber: '2222',
      ledger: '00',
      accountNumber: '123456',
      bankAccountType: BankAccountType.ICELANDIC,
    }
    const res = shouldNotUpdateBankAccount(bankInfo, paymentInfo)

    expect(true).toEqual(res)
  })

  it('should return false if bank account returned from TR is changed (BankAccountFormField)', () => {
    const bankInfo: BankInfo = {
      bank: '2222',
      ledger: '00',
      accountNumber: '123456',
    }
    const paymentInfo: PaymentInfo = {
      bankNumber: '2222',
      ledger: '00',
      accountNumber: '000000',
      bankAccountType: BankAccountType.ICELANDIC,
    }
    const res = shouldNotUpdateBankAccount(bankInfo, paymentInfo)

    expect(false).toEqual(res)
  })
})

describe('getCurrencies', () => {
  it('format bank info', () => {
    const currencies = ['EUR', 'ISK']
    const currenciesOptions = getCurrencies(currencies)

    expect([
      { label: 'EUR', value: 'EUR' },
      { label: 'ISK', value: 'ISK' },
    ]).toEqual(currenciesOptions)
  })
})

describe('typeOfBankInfo', () => {
  it('should return icelandic bank account type', () => {
    const bankInfo: BankInfo = {
      bank: '2222',
      ledger: '00',
      accountNumber: '123456',
    }
    const bankAccountType = BankAccountType.ICELANDIC
    const res = typeOfBankInfo(bankInfo, bankAccountType)

    expect('icelandic').toEqual(res)
  })

  it('should return foreign bank account type', () => {
    const bankInfo: BankInfo = {
      bank: '2222',
      ledger: '00',
      accountNumber: '123456',
    }
    const bankAccountType = BankAccountType.FOREIGN
    const res = typeOfBankInfo(bankInfo, bankAccountType)

    expect('foreign').toEqual(res)
  })

  it('should return icelandic bank account type', () => {
    const bankInfo: BankInfo = {
      bank: '2222',
      ledger: '00',
      accountNumber: '123456',
    }
    const bankAccountType = undefined as unknown as BankAccountType
    const res = typeOfBankInfo(bankInfo, bankAccountType)

    expect('icelandic').toEqual(res)
  })

  it('should return foreign bank account type', () => {
    const bankInfo: BankInfo = {
      iban: 'NL91ABNA0417164300',
      swift: 'NEDSZAJJXXX',
      foreignBankName: 'Heiti banka',
      foreignBankAddress: 'Heimili banka',
      currency: 'EUR',
    }
    const bankAccountType = undefined as unknown as BankAccountType
    const res = typeOfBankInfo(bankInfo, bankAccountType)

    expect('foreign').toEqual(res)
  })
})

describe('getCategoriesOptions', () => {
  it('should return income type categories', () => {
    const categorizedIncomeTypes = [
      {
        categoryNumber: 1,
        categoryName: 'Atvinnutekjur',
        categoryCode: 'ATV01',
        incomeTypeNumber: 101,
        incomeTypeName: 'Laun',
        incomeTypeCode: 'IPC01',
      },
      {
        categoryNumber: 2,
        categoryName: 'Fjármagnstekjur',
        categoryCode: 'FJT01',
        incomeTypeNumber: 201,
        incomeTypeName: 'Atvinnuleysisbætur',
        incomeTypeCode: 'IPC02',
      },
    ]

    const categories = getOneInstanceOfCategory(categorizedIncomeTypes)

    const res = getCategoriesOptions(categorizedIncomeTypes)

    const expected =
      categories &&
      categories.map((item) => {
        return {
          value: item.categoryName || '',
          label: item.categoryName || '',
        }
      })

    expect(res).toEqual(expected)
  })
})

describe('getTypesOptions', () => {
  it('should return income type', () => {
    const categorizedIncomeTypes = [
      {
        categoryNumber: 1,
        categoryName: 'Atvinnutekjur',
        categoryCode: 'ATV01',
        incomeTypeNumber: 101,
        incomeTypeName: 'Laun',
        incomeTypeCode: 'IPC01',
      },
      {
        categoryNumber: 2,
        categoryName: 'Fjármagnstekjur',
        categoryCode: 'FJT01',
        incomeTypeNumber: 201,
        incomeTypeName: 'Atvinnuleysisbætur',
        incomeTypeCode: 'IPC02',
      },
    ]
    const categoryName = 'Atvinnutekjur'

    const res = getTypesOptions(categorizedIncomeTypes, categoryName)
    const expected = categorizedIncomeTypes
      .filter((item) => item.categoryName === categoryName)
      .map((item) => {
        return {
          value: item.incomeTypeName || '',
          label: item.incomeTypeName || '',
        }
      })

    expect(res).toEqual(expected)
  })
})
