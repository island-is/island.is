import { syslumennEmailFromPostalCode } from './utils'

describe('ChildrenResidenceChangeService utils', () => {
  describe('syslumennEmailFromPostalCode', () => {
    it('should return Reykjavik email address for Reykjavik prefix postal code', () => {
      const email = 'fjolskylda@syslumenn.is'

      expect(syslumennEmailFromPostalCode('101')).toBe(email)
      expect(syslumennEmailFromPostalCode('200')).toBe(email)
      expect(syslumennEmailFromPostalCode('210')).toBe(email)
      expect(syslumennEmailFromPostalCode('221')).toBe(email)
      expect(syslumennEmailFromPostalCode('270')).toBe(email)
    })

    it('should return Sudurnes email address for Sudurnes prefix postal code', () => {
      const email = 'sudurnes.fjolskylda@syslumenn.is'

      expect(syslumennEmailFromPostalCode('230')).toBe(email)
      expect(syslumennEmailFromPostalCode('240')).toBe(email)
      expect(syslumennEmailFromPostalCode('250')).toBe(email)
      expect(syslumennEmailFromPostalCode('260')).toBe(email)
    })

    it('should return Vesturland email address for Vesturland prefix postal code', () => {
      const email = 'vesturland.sifjamal@syslumenn.is'

      expect(syslumennEmailFromPostalCode('300')).toBe(email)
    })

    it('should return Vestfirdir email address for Vestfirdir prefix postal code', () => {
      const email = 'vestfirdir.fjolskylda@syslumenn.is'

      expect(syslumennEmailFromPostalCode('400')).toBe(email)
    })

    it('should return Nordurland Vestra email address for Nordurland Vestra prefix postal code', () => {
      const email = 'nordurlandvestra.fjolskylda@syslumenn.is'

      expect(syslumennEmailFromPostalCode('500')).toBe(email)
    })

    it('should return Nordurland Eystra email address for Nordurland Eystra prefix postal code', () => {
      const email = 'nordurlandeystra.fjolskylda@syslumenn.is'

      expect(syslumennEmailFromPostalCode('600')).toBe(email)
    })

    it('should return Austurland email address for Austurland prefix postal code', () => {
      const email = 'austurland.fjolskylda@syslumenn.is'

      expect(syslumennEmailFromPostalCode('700')).toBe(email)
    })

    it('should return Sudurland email address for Sudurland prefix postal code', () => {
      const email = 'sudurland.fjolskylda@syslumenn.is'

      expect(syslumennEmailFromPostalCode('800')).toBe(email)
    })

    it('should return Vestmannaeyjar email address for Vestmannaeyjar prefix postal code', () => {
      const email = 'vestmannaeyjar.fjolskylda@syslumenn.is'

      expect(syslumennEmailFromPostalCode('900')).toBe(email)
    })

    it('should return Reykjavik email address for unknown postal code', () => {
      const email = 'fjolskylda@syslumenn.is'

      expect(syslumennEmailFromPostalCode('$#!@')).toBe(email)
    })
  })
})
