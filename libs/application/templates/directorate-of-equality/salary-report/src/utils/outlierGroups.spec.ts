import {
  foldGroupDirection,
  isOutlierGroupComplete,
  unassignedOutlierOrdinals,
  withFallbackOutlierGroupNames,
} from './outlierGroups'

describe('foldGroupDirection', () => {
  it('reads a group of underpaid employees as below', () => {
    expect(foldGroupDirection(['UNDERPAID', 'UNDERPAID'])).toBe('below')
  })

  // An employee can be listed for being paid ABOVE what their stig imply — this
  // is the direction the old single-prompt UI could not express.
  it('reads a group of overpaid employees as above', () => {
    expect(foldGroupDirection(['OVERPAID'])).toBe('above')
  })

  it('reads a group holding both directions as mixed', () => {
    expect(foldGroupDirection(['UNDERPAID', 'OVERPAID'])).toBe('mixed')
  })

  it('lets a real direction win over ON_LINE members', () => {
    expect(foldGroupDirection(['ON_LINE', 'UNDERPAID'])).toBe('below')
    expect(foldGroupDirection(['ON_LINE', 'OVERPAID'])).toBe('above')
  })

  // Not folded into 'mixed': that prompt asserts both directions are present.
  it('reads an all-ON_LINE group as onLine, not mixed', () => {
    expect(foldGroupDirection(['ON_LINE', 'ON_LINE'])).toBe('onLine')
  })

  it('reads an empty group as onLine rather than asserting a direction', () => {
    expect(foldGroupDirection([])).toBe('onLine')
  })
})

describe('isOutlierGroupComplete', () => {
  const complete = {
    reason: 'Ástæða',
    action: 'Aðgerð',
    signatureName: 'Nafn',
    signatureRole: 'Starfstitill',
    employeeOrdinals: [1],
  }

  it('accepts a fully filled group', () => {
    expect(isOutlierGroupComplete(complete)).toBe(true)
  })

  it('treats an empty group as vacuously complete', () => {
    expect(isOutlierGroupComplete({ employeeOrdinals: [] })).toBe(true)
  })

  it('rejects a whitespace-only reason', () => {
    expect(isOutlierGroupComplete({ ...complete, reason: '   ' })).toBe(false)
  })

  it('rejects a group missing its signature', () => {
    expect(isOutlierGroupComplete({ ...complete, signatureRole: '' })).toBe(
      false,
    )
  })
})

describe('unassignedOutlierOrdinals', () => {
  it('returns only outliers missing from every group', () => {
    expect(
      unassignedOutlierOrdinals(
        [
          { employeeOrdinal: 1 },
          { employeeOrdinal: 2 },
          { employeeOrdinal: 3 },
        ],
        [{ employeeOrdinals: [2] }, { employeeOrdinals: [3, 99] }],
      ),
    ).toEqual([1])
  })

  it('returns an empty list when every outlier is assigned', () => {
    expect(
      unassignedOutlierOrdinals(
        [{ employeeOrdinal: 1 }, { employeeOrdinal: 2 }],
        [{ employeeOrdinals: [1, 2] }],
      ),
    ).toEqual([])
  })
})

describe('withFallbackOutlierGroupNames', () => {
  it('fills only blank group names', () => {
    expect(
      withFallbackOutlierGroupNames(
        [
          { name: 'Skrifstofa', employeeOrdinals: [1] },
          { name: '   ', employeeOrdinals: [2] },
        ],
        (index) => `Hópur ${index + 1}`,
      ),
    ).toEqual([
      { name: 'Skrifstofa', employeeOrdinals: [1] },
      { name: 'Hópur 2', employeeOrdinals: [2] },
    ])
  })
})
