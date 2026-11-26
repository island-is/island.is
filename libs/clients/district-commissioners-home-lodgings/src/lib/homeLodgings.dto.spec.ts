import { HeimagistingarKTSetjaModelToJSON } from '../../gen/fetch'
import {
  mapHomeLodgingDto,
  mapHomeLodgingSubmission,
  mapHomeLodgingSubmissionResponse,
} from './homeLodgings.dto'

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

describe('mapHomeLodgingSubmission', () => {
  it('maps the submission to the IslandISHeimagistingar POST body', () => {
    const model = mapHomeLodgingSubmission({
      homeLodgingId: 'HG00016707',
      year: 2024,
      advertisementUrls: ['https://booking.com/gervistadir'],
      hasActiveAdvertisement: true,
      nights: [
        {
          month: 7,
          dateRanges: [{ from: '2024-07-30', to: '2024-08-01', amount: 20000 }],
          numberOfNights: 2,
          rentalIncome: 20000,
        },
        {
          month: 8,
          dateRanges: [{ from: '2024-08-01', to: '2024-08-02' }],
          numberOfNights: 1,
          rentalIncome: 10000,
        },
      ],
      comments: 'Athugasemd',
    })

    expect(HeimagistingarKTSetjaModelToJSON(model)).toEqual({
      id: 'HG00016707',
      year: '2024',
      urls: [{ url: 'https://booking.com/gervistadir', active: true }],
      nights: [
        {
          month: '7',
          dates: [
            {
              from: '2024-07-30T00:00:00.000Z',
              to: '2024-08-01T00:00:00.000Z',
              amount: 20000,
            },
          ],
          numberOfNights: 2,
          rentalIncome: 20000,
        },
        {
          month: '8',
          dates: [
            {
              from: '2024-08-01T00:00:00.000Z',
              to: '2024-08-02T00:00:00.000Z',
              amount: undefined,
            },
          ],
          numberOfNights: 1,
          rentalIncome: 10000,
        },
      ],
      comments: 'Athugasemd',
    })
  })

  it('sends empty lists when there are no advertisements or nights', () => {
    expect(
      mapHomeLodgingSubmission({
        homeLodgingId: 'HG1',
        year: 2025,
        advertisementUrls: [],
        hasActiveAdvertisement: false,
        nights: [],
      }),
    ).toEqual({
      id: 'HG1',
      year: '2025',
      urls: [],
      nights: [],
      comments: undefined,
    })
  })
})

describe('mapHomeLodgingSubmissionResponse', () => {
  it('maps a successful response', () => {
    expect(
      mapHomeLodgingSubmissionResponse({
        id: 'abc-123',
        submittedAt: new Date('2026-11-26T10:00:00Z'),
        error: null,
      }),
    ).toEqual({
      id: 'abc-123',
      submittedAt: '2026-11-26T10:00:00.000Z',
      error: undefined,
    })
  })

  it('keeps the error and ignores blank or invalid values', () => {
    expect(
      mapHomeLodgingSubmissionResponse({
        id: ' ',
        submittedAt: new Date('not a date'),
        error: ' Ár hefur þegar verið skilað ',
      }),
    ).toEqual({
      id: undefined,
      submittedAt: undefined,
      error: 'Ár hefur þegar verið skilað',
    })
  })
})
