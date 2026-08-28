import {
  buildOutlierClearCommands,
  buildOutlierSyncCommands,
  foldGroupDirection,
  outlierGroupsWithMembers,
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

  it('rejects a group missing its signature role', () => {
    expect(isOutlierGroupComplete({ ...complete, signatureRole: '' })).toBe(
      false,
    )
  })

  // The responsible party's name is optional, so it must not hold up the
  // Continue button the way the other fields do.
  it('accepts a group with no responsible party name', () => {
    expect(isOutlierGroupComplete({ ...complete, signatureName: '' })).toBe(
      true,
    )
    const { signatureName: _omitted, ...withoutName } = complete
    expect(isOutlierGroupComplete(withoutName)).toBe(true)
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

describe('buildOutlierClearCommands', () => {
  const content = {
    outlierGroups: [
      {
        id: 'group-1',
        reportId: 'report-1',
        name: 'Hópur 1',
        memberEmployeeIds: ['emp-1', 'emp-2'],
      },
      {
        id: 'group-2',
        reportId: 'report-1',
        name: 'Hópur 2',
        memberEmployeeIds: [],
      },
    ],
  }

  it('frees every member and removes every group', () => {
    const { employees, outlierGroups } = buildOutlierClearCommands(content)

    expect(employees).toEqual([
      { method: 'UPDATE', id: 'emp-1', data: { outlierGroupId: null } },
      { method: 'UPDATE', id: 'emp-2', data: { outlierGroupId: null } },
    ])
    expect(outlierGroups).toEqual([
      { method: 'REMOVE', id: 'group-1' },
      { method: 'REMOVE', id: 'group-2' },
    ])
  })

  it('returns nothing to send when the draft holds no groups', () => {
    expect(buildOutlierClearCommands({ outlierGroups: [] })).toEqual({
      employees: [],
      outlierGroups: [],
    })
  })
})

describe('outlierGroupsWithMembers', () => {
  it('drops groups whose members have all been freed', () => {
    expect(
      outlierGroupsWithMembers([
        { name: 'Hópur 1', employeeOrdinals: [1, 2] },
        { name: 'Tæmdur', reason: 'Skrifað en tómt', employeeOrdinals: [] },
      ]),
    ).toEqual([{ name: 'Hópur 1', employeeOrdinals: [1, 2] }])
  })
})

// The filter above runs on the way in, so what reaches DMR for a group the
// draft holds but the applicant has emptied is a removal plus the freeing of
// its recorded members — never a memberless group row.
describe('buildOutlierSyncCommands with an emptied group', () => {
  const content = {
    outlierGroups: [
      {
        id: 'group-1',
        reportId: 'report-1',
        name: 'Hópur 1',
        memberEmployeeIds: ['emp-1'],
      },
    ],
    employees: [
      { id: 'emp-1', ordinal: 1 },
      { id: 'emp-2', ordinal: 2 },
    ] as never,
  }

  it('removes the group and frees its members', () => {
    const { outlierGroups, employees } = buildOutlierSyncCommands(
      content,
      outlierGroupsWithMembers([
        { id: 'group-1', name: 'Hópur 1', employeeOrdinals: [] },
      ]),
    )

    expect(outlierGroups).toEqual([{ method: 'REMOVE', id: 'group-1' }])
    expect(employees).toEqual([
      { method: 'UPDATE', id: 'emp-1', data: { outlierGroupId: null } },
    ])
  })

  it('sends nothing at all for a group that was never synced', () => {
    const { outlierGroups, employees } = buildOutlierSyncCommands(
      { outlierGroups: [], employees: content.employees },
      outlierGroupsWithMembers([{ id: 'fresh-group', employeeOrdinals: [] }]),
    )

    expect(outlierGroups).toEqual([])
    expect(employees).toEqual([])
  })
})
