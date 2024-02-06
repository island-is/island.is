import { mapFullAddress } from '../mapper'

describe('Mapper', () => {
  describe('mapFullAddress', () => {
    describe('should concatenate addresses', () => {
      it('should map if only city is provided', () => {
        expect(mapFullAddress([undefined, undefined, 'Reykjavík'])).toMatch(
          'Reykjavík',
        )
      })
      it('should map if only postal code is provided', () => {
        expect(mapFullAddress([undefined, '101', undefined])).toMatch('101')
      })
      it('should map if only address is provided', () => {
        expect(
          mapFullAddress(['Hraunhólar 10090', undefined, undefined]),
        ).toMatch('Hraunhólar 10090')
      })
      it('should map if postal code and city is provided', () => {
        expect(mapFullAddress([undefined, '101', 'Reykjavík'])).toMatch(
          '101, Reykjavík',
        )
      })
      it('should map if address and postal code is provided', () => {
        expect(mapFullAddress(['Hraunhólar 10090', '101', undefined])).toMatch(
          'Hraunhólar 10090, 101',
        )
      })
      it('should map if address and city is provided', () => {
        expect(
          mapFullAddress(['Hraunhólar 10090', undefined, 'Reykjavík']),
        ).toMatch('Hraunhólar 10090, Reykjavík')
      })

      it('should map on all arguments', () => {
        expect(
          mapFullAddress(['Hraunhólar 10090', '101', 'Reykjavík']),
        ).toMatch('Hraunhólar 10090, 101, Reykjavík')
      })
      it('should abort if no arguments', () => {
        expect(
          mapFullAddress([undefined, undefined, undefined]),
        ).toBeUndefined()
      })
    })
  })
})
