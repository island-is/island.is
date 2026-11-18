import { applicationResponseFromJson } from './applicationApi'

const vmstApplication = {
  applicationId: '3044a099-76dc-4430-96c6-bfa7ece9e2c7',
  applicationFundId: '2017-05170',
  applicantId: '0101302399',
  email: 'umsaekjandi@island.is',
  phoneNumber: '8663887',
  status: '',
  expectedDateOfBirth: '2027-06-27',
  paymentInfo: { bankAccount: '283412830129' },
  employers: [],
  periods: [
    {
      from: '2027-06-27',
      to: '2027-07-11',
      ratio: '100',
      approved: false,
      paid: false,
      rightsCodePeriod: 'M-S-GR',
      firstPeriodStart: 'date_of_birth',
    },
  ],
  applicationRights: [{ rightsUnit: 'M-S-GR', days: '180' }],
}

describe('applicationResponseFromJson', () => {
  it('should read the application VMST returns on its own', () => {
    const { application } = applicationResponseFromJson(vmstApplication)

    expect(application).toMatchObject({
      applicationId: '3044a099-76dc-4430-96c6-bfa7ece9e2c7',
      applicationFundId: '2017-05170',
      periods: [{ from: '2027-06-27', rightsCodePeriod: 'M-S-GR' }],
    })
  })

  it('should still read the wrapped response the client describes', () => {
    const { application } = applicationResponseFromJson({
      application: vmstApplication,
    })

    expect(application?.applicationFundId).toBe('2017-05170')
  })

  it('should give no application for an unexpected body', () => {
    expect(applicationResponseFromJson(null)).toEqual({})
    expect(applicationResponseFromJson('')).toEqual({})
  })
})
