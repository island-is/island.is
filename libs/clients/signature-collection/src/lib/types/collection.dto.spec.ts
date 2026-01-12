import {
  CollectionType,
  getCollectionTypeFromNumber,
  getNumberFromCollectionType,
} from './collection.dto'

describe('Signature Collection DTO - getCollectionTypeFromNumber', () => {
  it('Should correctly translate numbers into collection types', () => {
    expect(getCollectionTypeFromNumber(4)).toBe(
      CollectionType.OtherSameRulesAsParliamentary,
    )
    expect(getCollectionTypeFromNumber(9)).toBe(CollectionType.ResidentPoll)
    expect(getCollectionTypeFromNumber(2)).toBe(CollectionType.Presidential)
  })

  it('Should fallback to OtherUnknown when given an invalid integer', () => {
    expect(getCollectionTypeFromNumber(-14)).toBe(CollectionType.OtherUnknown)
    expect(getCollectionTypeFromNumber(20)).toBe(CollectionType.OtherUnknown)
    expect(getCollectionTypeFromNumber(7)).toBe(CollectionType.OtherUnknown)
  })
})

describe('Signature Collection DTO - getNumberFromCollectionType', () => {
  it('Should correctly translate CollectionTypes into numbers', () => {
    expect(getNumberFromCollectionType(CollectionType.LocalGovernmental)).toBe(
      5,
    )
    expect(
      getNumberFromCollectionType(CollectionType.OtherSameRulesAsParliamentary),
    ).toBe(4)
  })
})
