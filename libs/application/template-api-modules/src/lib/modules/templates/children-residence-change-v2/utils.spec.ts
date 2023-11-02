import { syslumennDataFromPostalCode } from './utils'

describe('ChildrenResidenceChangeServiceV2 utils', () => {
  describe('syslumennDataFromPostalCode', () => {
    it('should return Reykjavik email address for Reykjavik prefix postal code', () => {
      const email = 'fjolskylda@syslumenn.is'

      expect(syslumennDataFromPostalCode('101').email).toBe(email)
      expect(syslumennDataFromPostalCode('200').email).toBe(email)
      expect(syslumennDataFromPostalCode('210').email).toBe(email)
      expect(syslumennDataFromPostalCode('221').email).toBe(email)
      expect(syslumennDataFromPostalCode('270').email).toBe(email)
    })

    it('should return Sudurnes email address for Sudurnes prefix postal code', () => {
      const email = 'sudurnes.fjolskylda@syslumenn.is'

      expect(syslumennDataFromPostalCode('230').email).toBe(email)
      expect(syslumennDataFromPostalCode('240').email).toBe(email)
      expect(syslumennDataFromPostalCode('250').email).toBe(email)
      expect(syslumennDataFromPostalCode('260').email).toBe(email)
    })

    it('should return Vesturland email address for Vesturland prefix postal code', () => {
      const email = 'vesturland.sifjamal@syslumenn.is'

      expect(syslumennDataFromPostalCode('300').email).toBe(email)
    })

    it('should return Vestfirdir email address for Vestfirdir prefix postal code', () => {
      const email = 'vestfirdir.fjolskylda@syslumenn.is'

      expect(syslumennDataFromPostalCode('400').email).toBe(email)
    })

    it('should return Nordurland Vestra email address for Nordurland Vestra prefix postal code', () => {
      const email = 'nordurlandvestra@syslumenn.is'

      expect(syslumennDataFromPostalCode('500').email).toBe(email)
    })

    it('should return Nordurland Eystra email address for Nordurland Eystra prefix postal code', () => {
      const email = 'nordurlandeystra.fjolskylda@syslumenn.is'

      expect(syslumennDataFromPostalCode('600').email).toBe(email)
    })

    it('should return Austurland email address for Austurland prefix postal code', () => {
      const email = 'austurland.fjolskylda@syslumenn.is'

      expect(syslumennDataFromPostalCode('700').email).toBe(email)
    })

    it('should return Sudurland email address for Sudurland prefix postal code', () => {
      const email = 'sudurland.fjolskylda@syslumenn.is'

      expect(syslumennDataFromPostalCode('800').email).toBe(email)
    })

    it('should return Vestmannaeyjar email address for Vestmannaeyjar prefix postal code', () => {
      const email = 'arndis@syslumenn.is'

      expect(syslumennDataFromPostalCode('900').email).toBe(email)
    })

    it('should return Reykjavik email address for unknown postal code', () => {
      const email = 'fjolskylda@syslumenn.is'

      expect(syslumennDataFromPostalCode('$#!@').email).toBe(email)
    })
  })
})
