import {
  assignChildKeys,
  findChildBySelection,
  getChildKey,
  isSameChild,
  isSamePregnancy,
  toDay,
} from './childIdentity'

describe('toDay', () => {
  it.each([
    ['2027-03-04', '2027-03-04'],
    ['2027-03-04T00:00:00', '2027-03-04'],
    ['N/A', ''],
    ['', ''],
    [null, ''],
    [undefined, ''],
  ])('should turn %p into %p', (input, expected) => {
    expect(toDay(input)).toBe(expected)
  })
})

describe('isSameChild', () => {
  it('should match on any shared date regardless of time part', () => {
    expect(
      isSameChild(
        { expectedDateOfBirth: '2027-03-04' },
        { expectedDateOfBirth: '2027-03-04T00:00:00' },
      ),
    ).toBe(true)
    expect(
      isSameChild({ dateOfBirth: '2027-03-01' }, { dateOfBirth: '2027-03-01' }),
    ).toBe(true)
    expect(
      isSameChild(
        { adoptionDate: '2026-11-15' },
        { adoptionDate: '2026-11-15' },
      ),
    ).toBe(true)
  })

  it('should not match on empty or placeholder dates', () => {
    expect(
      isSameChild({ expectedDateOfBirth: '' }, { expectedDateOfBirth: '' }),
    ).toBe(false)
    expect(
      isSameChild(
        { expectedDateOfBirth: 'N/A' },
        { expectedDateOfBirth: 'N/A' },
      ),
    ).toBe(false)
  })
})

describe('isSamePregnancy', () => {
  it('should match an unborn child whose due date moved within the window', () => {
    expect(
      isSamePregnancy('2027-04-20', { expectedDateOfBirth: '2027-03-04' }),
    ).toBe(true)
  })

  it('should not match beyond the window', () => {
    expect(
      isSamePregnancy('2027-06-01', { expectedDateOfBirth: '2027-03-04' }),
    ).toBe(false)
  })

  it('should not match a child that is already born or adopted', () => {
    expect(
      isSamePregnancy('2027-03-10', {
        expectedDateOfBirth: '2027-03-04',
        dateOfBirth: '2027-03-02',
      }),
    ).toBe(false)
    expect(
      isSamePregnancy('2027-03-10', {
        expectedDateOfBirth: '',
        adoptionDate: '2027-03-04',
      }),
    ).toBe(false)
  })
})

describe('getChildKey', () => {
  it('should prefer the VMST application id over any date', () => {
    expect(
      getChildKey({
        vmstApplicationId: 'leave-1',
        expectedDateOfBirth: '2027-03-04',
      }),
    ).toBe('vmst:leave-1')
  })

  it('should fall back to adoption date, date of birth, then due date', () => {
    expect(
      getChildKey({ adoptionDate: '2026-11-15', expectedDateOfBirth: '' }),
    ).toBe('adoption:2026-11-15')
    expect(
      getChildKey({
        dateOfBirth: '2027-03-02',
        expectedDateOfBirth: '2027-03-04',
      }),
    ).toBe('dob:2027-03-02')
    expect(getChildKey({ expectedDateOfBirth: '2027-03-04' })).toBe(
      'edd:2027-03-04',
    )
  })

  it('should keep a key the provider already assigned', () => {
    expect(
      getChildKey({
        key: 'edd:2027-03-04#2',
        expectedDateOfBirth: '2027-03-04',
      }),
    ).toBe('edd:2027-03-04#2')
  })

  it('should have no key for a child without dates', () => {
    expect(getChildKey({ expectedDateOfBirth: 'N/A' })).toBeUndefined()
  })
})

describe('assignChildKeys', () => {
  it('should keep keys unique and give dateless children one too', () => {
    expect(
      assignChildKeys([
        { expectedDateOfBirth: '2027-03-04' },
        { expectedDateOfBirth: '2027-03-04' },
        { expectedDateOfBirth: 'N/A' },
      ]).map((child) => child.key),
    ).toEqual(['edd:2027-03-04', 'edd:2027-03-04#2', 'child:2'])
  })

  it('should replace a stale key copied from an earlier snapshot', () => {
    expect(
      assignChildKeys([
        { key: 'vmst:gone', expectedDateOfBirth: '2027-03-04' },
      ])[0].key,
    ).toBe('edd:2027-03-04')
  })
})

describe('findChildBySelection', () => {
  const children = [
    { key: 'vmst:leave-1', expectedDateOfBirth: '2026-01-01' },
    { key: 'edd:2027-03-04', expectedDateOfBirth: '2027-03-04' },
  ]

  it('should find a child by key', () => {
    expect(findChildBySelection(children, 'edd:2027-03-04')).toBe(children[1])
  })

  it('should honour a legacy index, as string or number', () => {
    expect(findChildBySelection(children, '1')).toBe(children[1])
    expect(findChildBySelection(children, 0)).toBe(children[0])
  })

  it('should return null for nothing selected or an unknown key', () => {
    expect(findChildBySelection(children, undefined)).toBeNull()
    expect(findChildBySelection(children, '')).toBeNull()
    expect(findChildBySelection(children, 'new')).toBeNull()
    expect(findChildBySelection(children, 'edd:2030-01-01')).toBeNull()
  })
})
