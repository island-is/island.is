import { mapHomeLodgingDto } from './homeLodgings.dto'

describe('mapHomeLodgingDto', () => {
  it('maps the IslandISHeimagistingar response', () => {
    expect(
      mapHomeLodgingDto({
        id: 'HG00016707',
        years: [
          { year: '2024', returned: false },
          { year: '2023', returned: true },
        ],
        address: 'Gervistaðir',
        postalCode: '101 Reykjavík',
        apartmentNumber: '010101',
        guests: '3',
        rooms: '1',
      }),
    ).toEqual({
      id: 'HG00016707',
      address: 'Gervistaðir',
      postalCode: '101 Reykjavík',
      apartmentNumber: '010101',
      guests: 3,
      rooms: 1,
      years: [
        { year: 2024, returned: false },
        { year: 2023, returned: true },
      ],
    })
  })

  it('tolerates missing and malformed values', () => {
    expect(
      mapHomeLodgingDto({
        id: 'HG1',
        years: [{ year: 'abc' }, { year: '2025' }],
        postalCode: 'Reykjavík',
        guests: '',
        rooms: null,
      }),
    ).toEqual({
      id: 'HG1',
      address: '',
      postalCode: 'Reykjavík',
      apartmentNumber: undefined,
      guests: undefined,
      rooms: undefined,
      years: [{ year: 2025, returned: false }],
    })
  })

  it('drops items without an id', () => {
    expect(mapHomeLodgingDto({ address: 'Gervistaðir' })).toBeNull()
  })
})
