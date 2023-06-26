import { getBirthday } from './getBirthday'

describe('getBirthday', () => {
  it('should return date of birth from kennitala born before 2000', () => {
    const date = new Date('1980-01-01T00:00')
    expect(getBirthday('010180-0009')).toEqual(date)
  })

  it('should return date of birth from kennitala born after 2000', () => {
    const date = new Date('2020-02-02T00:00')
    expect(getBirthday('020220-0000')).toEqual(date)
  })

  it('should return date of creation from kennitala for company', () => {
    const date = new Date('2020-02-02T00:00')
    expect(getBirthday('420220-0000')).toEqual(date)
  })

  it('should return undefined on bad string input', () => {
    expect(getBirthday('NOT A NAT-ID!')).toEqual(undefined)
  })

  it('should return undefined on bad string input 2', () => {
    expect(getBirthday('134')).toEqual(undefined)
  })
})
