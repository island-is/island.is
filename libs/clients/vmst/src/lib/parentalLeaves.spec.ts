import {
  fetchParentalLeaves,
  toIsoDate,
  toParentalLeaves,
} from './parentalLeaves'

// Body of VMST's GET /users/{nationalRegistryId}/parental-leaves, as documented now
const response = {
  parentalLeaves: [
    {
      nationalRegistryId: '0101302399',
      email: 'umsaekjandi@island.is',
      phoneNumber: '8663887',
      paymentInfo: { bankAccount: '283412830129' },
      personalAllowance: '50',
      union: { id: 'F000', name: 'Greiðir ekki félagsgjald' },
      pensionFund: { id: 'L030', name: 'Lífeyrissjóður' },
      privatePensionFund: {
        id: 'X000',
        name: 'Greiðir ekki í séreignarsjóð',
        privatePensionFundPercentage: '2',
      },
      employers: [{ employerId: 'employer-1' }],
      applications: [
        {
          applicationId: '2017-05170',
          children: [
            {
              expectedDateOfBirth: '20270627',
              dateOfBirth: '',
              nationalRegistryId: null,
              name: '',
            },
          ],
          otherParentId: '0101303019',
          otherParentBlocked: '',
          language: '',
          status: 'In Process',
          applicationRights: [{ rightsUnit: 'M-S-GR', days: '180' }],
          periods: [
            {
              from: '2027-06-27',
              to: '2027-07-11',
              ratio: '100',
              approved: false,
              paid: false,
              rightsCodePeriod: null,
              rightUnt: 'M-S-GR',
              rightDescription: 'Grunnréttur móður sjálfst.',
              days: ['15'],
            },
          ],
        },
        {
          applicationId: '2017-04407',
          children: [
            { expectedDateOfBirth: '20240211', dateOfBirth: '' },
            { expectedDateOfBirth: '20240211', dateOfBirth: '' },
          ],
          otherParentBlocked: 'true',
          status: 'In Process',
          // As VMST lists rights: the code is not in `rightsUnit`
          applicationRights: [
            {
              rightsUnit: null,
              applicationRigthUnitCode: 'FO-FL-L-GR',
              applicationRigthQuantity: '180',
            },
          ],
          periods: [],
        },
      ],
    },
  ],
}

describe('toParentalLeaves', () => {
  it("should give one leave per item of the applicant's applications", () => {
    const leaves = toParentalLeaves(response)

    expect(leaves).toHaveLength(2)
    expect(leaves[0]).toMatchObject({
      applicationId: '2017-05170',
      applicationFundId: '2017-05170',
      applicant: '0101302399',
      expectedDateOfBirth: '2027-06-27',
      dateOfBirth: null,
      otherParentId: '0101303019',
      otherParentBlocked: false,
      status: 'In Process',
      rightsCode: 'M-S-GR',
      email: 'umsaekjandi@island.is',
      paymentInfo: {
        bankAccount: '283412830129',
        personalAllowance: 50,
        union: { id: 'F000' },
        pensionFund: { id: 'L030' },
        privatePensionFundRatio: 2,
      },
      periods: [
        {
          from: '2027-06-27',
          to: '2027-07-11',
          ratio: '100',
          rightsCodePeriod: 'M-S-GR',
        },
      ],
      employers: [],
    })
    expect(leaves[1]).toMatchObject({
      applicationId: '2017-04407',
      expectedDateOfBirth: '2024-02-11',
      noOfChildren: '2',
      otherParentBlocked: true,
      rightsCode: 'FO-FL-L-GR',
      periods: [],
    })
  })

  it('should give no leaves when VMST lists none', () => {
    expect(toParentalLeaves({})).toEqual([])
    expect(toParentalLeaves({ parentalLeaves: [] })).toEqual([])
    expect(
      toParentalLeaves({ parentalLeaves: [{ applications: [] }] }),
    ).toEqual([])
    expect(
      toParentalLeaves({
        parentalLeaves: [
          { nationalRegistryId: '0101302399', applications: null },
        ],
      }),
    ).toEqual([])
  })

  it('should read the older shape, one item per leave', () => {
    const leaves = toParentalLeaves({
      parentalLeaves: [
        {
          applicationId: '6b44e738-a278-44a6-8ac8-ff24e9d6e956',
          applicationFundId: '2017-05168',
          applicant: '0101302399',
          otherParentId: '0101303019',
          expectedDateOfBirth: '2027-06-05',
          dateOfBirth: '',
          adoptionDate: '20270301',
          email: 'umsaekjandi@island.is',
          phoneNumber: '8663887',
          paymentInfo: { bankAccount: '283412830129' },
          status: 'In Process',
          rightsCode: 'M-L-GR,FSAL-GR',
          noOfChildren: '2',
          language: 'IS',
          otherParentBlocked: true,
          periods: [{ from: '2027-06-05', to: '2027-06-19', ratio: '100' }],
        },
      ],
    })

    expect(leaves).toEqual([
      expect.objectContaining({
        applicationId: '6b44e738-a278-44a6-8ac8-ff24e9d6e956',
        applicationFundId: '2017-05168',
        expectedDateOfBirth: '2027-06-05',
        dateOfBirth: null,
        adoptionDate: '2027-03-01',
        rightsCode: 'M-L-GR,FSAL-GR',
        noOfChildren: '2',
        otherParentBlocked: true,
        periods: [
          expect.objectContaining({ from: '2027-06-05', to: '2027-06-19' }),
        ],
      }),
    ])
  })

  it('should refuse an item in neither shape rather than read it as no leaves', () => {
    expect(() =>
      toParentalLeaves({ parentalLeaves: [{ applicant: '0101302399' }] }),
    ).toThrow()
    expect(() => toParentalLeaves('not a list')).toThrow()
  })
})

describe('fetchParentalLeaves', () => {
  it("should read VMST's body before the generated client parses it", async () => {
    const api = {
      parentalLeaveGetParentalLeavesRaw: jest.fn(async () => ({
        raw: { json: async () => response },
      })),
    }

    const leaves = await fetchParentalLeaves(api as never, '0101302399')

    expect(api.parentalLeaveGetParentalLeavesRaw).toHaveBeenCalledWith({
      nationalRegistryId: '0101302399',
    })
    expect(leaves.map(({ applicationId }) => applicationId)).toEqual([
      '2017-05170',
      '2017-04407',
    ])
  })
})

describe('toIsoDate', () => {
  it('should turn YYYYMMDD into YYYY-MM-DD and leave other dates alone', () => {
    expect(toIsoDate('20270627')).toBe('2027-06-27')
    expect(toIsoDate('2027-06-27')).toBe('2027-06-27')
    expect(toIsoDate('')).toBe('')
    expect(toIsoDate(null)).toBe('')
  })
})
