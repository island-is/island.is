import { UserRole } from '@island.is/judicial-system-web/src/graphql/schema'

import { downloadUsersCsv, USERS_CSV_FILENAME, usersToCsv } from './usersCsv'

const anna = {
  id: '1',
  name: 'Anna',
  email: 'anna@example.com',
  mobileNumber: '7770000',
  nationalId: '0101302989',
  role: UserRole.PROSECUTOR,
  institution: { id: 'inst-c', name: 'C-stofnun' },
  active: true,
  canConfirmIndictment: false,
  latestLogin: '2026-01-15T12:30:00.000Z',
  loginCount: 4,
}

const bjorn = {
  id: '2',
  name: 'Björn, "dómari"',
  role: UserRole.DISTRICT_COURT_JUDGE,
  institution: { id: 'inst-a', name: 'A-stofnun' },
  active: false,
  canConfirmIndictment: true,
}

describe('usersToCsv', () => {
  it('starts with a UTF-8 BOM and Icelandic headers in a fixed order', () => {
    const csv = usersToCsv([])

    expect(csv.startsWith('\uFEFF')).toBe(true)
    expect(csv.slice(1).split('\n')[0]).toBe(
      [
        'Nafn',
        'Netfang',
        'Sími',
        'Kennitala',
        'Hlutverk',
        'Stofnun',
        'Virkur',
        'Getur staðfest ákærur',
        'Síðasta innskráning',
        'Fjöldi innskráninga',
      ].join(','),
    )
  })

  it('maps visible table values, using Icelandic role labels and Já/Nei', () => {
    const [header, row] = usersToCsv([anna]).slice(1).split('\n')

    expect(header).toContain('Hlutverk')
    expect(row).toBe(
      [
        'Anna',
        'anna@example.com',
        '7770000',
        '010130-2989',
        'Saksóknari',
        'C-stofnun',
        'Já',
        'Nei',
        '15.01.2026 12:30',
        '4',
      ].join(','),
    )
  })

  it('quotes values that contain commas or double quotes', () => {
    const row = usersToCsv([bjorn]).slice(1).split('\n')[1]

    expect(row.startsWith('"Björn, ""dómari""",')).toBe(true)
  })

  it('keeps row order and uses empty cells for missing optional fields', () => {
    const rows = usersToCsv([bjorn, anna]).slice(1).split('\n').slice(1)

    expect(rows[0]).toContain('Dómari')
    expect(rows[1]).toContain('Saksóknari')
    expect(rows[0]).toMatch(/^"Björn, ""dómari""",,,,/)
  })
})

describe('downloadUsersCsv', () => {
  const originalCreateObjectURL = URL.createObjectURL
  const originalRevokeObjectURL = URL.revokeObjectURL

  afterEach(() => {
    URL.createObjectURL = originalCreateObjectURL
    URL.revokeObjectURL = originalRevokeObjectURL
    jest.restoreAllMocks()
  })

  it('does nothing when there are no users', () => {
    const createObjectURL = jest.fn()
    URL.createObjectURL = createObjectURL

    downloadUsersCsv([])

    expect(createObjectURL).not.toHaveBeenCalled()
  })

  it('downloads a CSV blob named notendur.csv', () => {
    const blobs: Blob[] = []
    URL.createObjectURL = jest.fn((blob: Blob) => {
      blobs.push(blob)
      return 'blob:mock'
    }) as typeof URL.createObjectURL
    URL.revokeObjectURL = jest.fn()

    const click = jest.fn()
    const link = {
      href: '',
      setAttribute: jest.fn(),
      click,
    } as unknown as HTMLAnchorElement
    jest.spyOn(document, 'createElement').mockReturnValue(link)
    jest.spyOn(document.body, 'appendChild').mockImplementation((node) => node)
    jest.spyOn(document.body, 'removeChild').mockImplementation((node) => node)

    downloadUsersCsv([anna])
    const expectedBlob = new Blob([usersToCsv([anna])])

    expect(link.setAttribute).toHaveBeenCalledWith(
      'download',
      USERS_CSV_FILENAME,
    )
    expect(click).toHaveBeenCalled()
    expect(blobs[0].type).toBe('text/csv;charset=utf-8;')
    expect(blobs[0].size).toBe(expectedBlob.size)
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock')
  })
})
