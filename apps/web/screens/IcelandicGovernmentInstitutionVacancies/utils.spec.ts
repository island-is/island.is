import { getDeadlineVariant, getExcerpt } from './utils'

describe('getExcerpt', () => {
  it('should return text as-is when shorter than maxLength', () => {
    const text = 'Short text'
    expect(getExcerpt(text, 100)).toEqual('Short text')
  })

  it('should return text as-is when equal to maxLength', () => {
    const text = 'Exactly 20 chars ok!'
    expect(getExcerpt(text, 20)).toEqual('Exactly 20 chars ok!')
  })

  it('should truncate at sentence ending within limit', () => {
    const text = 'First sentence. Second sentence. Third sentence.'
    expect(getExcerpt(text, 20)).toEqual('First sentence.')
  })

  it('should truncate at last complete word when no punctuation', () => {
    const text = 'This is a long text without punctuation'
    expect(getExcerpt(text, 20)).toEqual('This is a long text...')
  })

  it('should handle text with no spaces', () => {
    const text = 'verylongtextwithoutanyspaces'
    expect(getExcerpt(text, 10)).toEqual('verylongte...')
  })

  it('should handle empty string', () => {
    expect(getExcerpt('', 100)).toEqual('')
  })

  it('should use default maxLength of 240', () => {
    const text = 'a'.repeat(250)
    const result = getExcerpt(text)
    expect(result.length).toBeLessThanOrEqual(243) // 240 + '...'
  })
})

describe('getDeadlineVariant', () => {
  // Mock current date to avoid test flakiness
  const mockToday = new Date(2025, 10, 21) // Nov 21, 2025

  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(mockToday)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe('valid dates', () => {
    it('should return "red" for past date', () => {
      expect(getDeadlineVariant('24.08.2023')).toEqual('red')
    })

    it('should return "red" for yesterday', () => {
      expect(getDeadlineVariant('20.11.2025')).toEqual('red')
    })

    it('should return "mint" for today (can still apply)', () => {
      expect(getDeadlineVariant('21.11.2025')).toEqual('mint')
    })

    it('should return "mint" for tomorrow', () => {
      expect(getDeadlineVariant('22.11.2025')).toEqual('mint')
    })

    it('should return "mint" for future date', () => {
      expect(getDeadlineVariant('15.12.2025')).toEqual('mint')
    })

    it('should handle leap year correctly', () => {
      expect(getDeadlineVariant('29.02.2024')).toEqual('red') // Valid leap year date in the past
    })
  })

  describe('invalid date formats', () => {
    it('should return "mint" for wrong number of parts', () => {
      expect(getDeadlineVariant('24.08')).toEqual('mint')
      expect(getDeadlineVariant('24.08.2023.extra')).toEqual('mint')
    })

    it('should return "mint" for non-numeric values', () => {
      expect(getDeadlineVariant('abc.def.ghij')).toEqual('mint')
      expect(getDeadlineVariant('24.abc.2023')).toEqual('mint')
    })

    it('should return "mint" for invalid separators', () => {
      expect(getDeadlineVariant('24-08-2023')).toEqual('mint')
      expect(getDeadlineVariant('24/08/2023')).toEqual('mint')
    })

    it('should return "mint" for empty string', () => {
      expect(getDeadlineVariant('')).toEqual('mint')
    })
  })

  describe('invalid date values', () => {
    it('should return "mint" for invalid month', () => {
      expect(getDeadlineVariant('12.13.2024')).toEqual('mint')
      expect(getDeadlineVariant('15.00.2024')).toEqual('mint')
    })

    it('should return "mint" for invalid day', () => {
      expect(getDeadlineVariant('00.08.2024')).toEqual('mint')
      expect(getDeadlineVariant('32.08.2024')).toEqual('mint')
    })

    it('should return "mint" for invalid year', () => {
      expect(getDeadlineVariant('15.08.1899')).toEqual('mint')
      expect(getDeadlineVariant('15.08.2101')).toEqual('mint')
    })

    it('should return "mint" for date rollover (Feb 31)', () => {
      expect(getDeadlineVariant('31.02.2024')).toEqual('mint')
    })

    it('should return "mint" for Feb 30', () => {
      expect(getDeadlineVariant('30.02.2024')).toEqual('mint')
    })

    it('should return "mint" for invalid leap year Feb 29', () => {
      expect(getDeadlineVariant('29.02.2023')).toEqual('mint') // Not a leap year
    })

    it('should return "mint" for April 31', () => {
      expect(getDeadlineVariant('31.04.2024')).toEqual('mint') // April has 30 days
    })
  })
})
