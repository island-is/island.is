import {
  buildOutlierClearCommands,
  buildOutlierSyncCommands,
  foldGroupDirection,
  outlierGroupsWithMembers,
  isOutlierGroupComplete,
  isOutlierGroupSubmittable,
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
    remedyDate: '2027-03-01',
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

  // Required alongside the rest of the explanation on DMR's side, so it has to
  // gate Continue exactly as the reason and the action do.
  it('rejects a group with no remedy date', () => {
    expect(isOutlierGroupComplete({ ...complete, remedyDate: '' })).toBe(false)
    const { remedyDate: _omitted, ...withoutDate } = complete
    expect(isOutlierGroupComplete(withoutDate)).toBe(false)
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

describe('isOutlierGroupSubmittable', () => {
  // Fixed clock: the window moves with the date, and a literal fixture would
  // start failing once it fell out of range.
  const now = new Date(2026, 7, 31)
  const complete = {
    reason: 'Ástæða',
    action: 'Aðgerð',
    remedyDate: '2027-03-01',
    signatureRole: 'Starfstitill',
    employeeOrdinals: [1],
  }

  it('accepts a complete group whose remedy date is still ahead', () => {
    expect(isOutlierGroupSubmittable(complete, now)).toBe(true)
  })

  // The whole reason this is separate from isOutlierGroupComplete: the date is
  // filled in, so nothing is missing — it has simply gone stale in POSTPONED's
  // 90-day window.
  it('refuses a group whose remedy date has passed', () => {
    expect(
      isOutlierGroupSubmittable({ ...complete, remedyDate: '2020-01-01' }, now),
    ).toBe(false)
  })

  it('refuses a remedy date past the far end of the window', () => {
    expect(
      isOutlierGroupSubmittable({ ...complete, remedyDate: '2031-01-01' }, now),
    ).toBe(false)
  })

  // Vacuously submittable for the same reason it is vacuously complete: a group
  // with no members is dropped before submission.
  it('ignores the window for a group with no members', () => {
    expect(
      isOutlierGroupSubmittable(
        { ...complete, remedyDate: '2020-01-01', employeeOrdinals: [] },
        now,
      ),
    ).toBe(true)
  })

  it('still refuses a group that is merely incomplete', () => {
    expect(isOutlierGroupSubmittable({ ...complete, action: '' }, now)).toBe(
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
