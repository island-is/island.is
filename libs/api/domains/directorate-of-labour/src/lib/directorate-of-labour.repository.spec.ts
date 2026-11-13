import type { Logger } from '@island.is/logging'
import type {
  ApplicationApi,
  NewApplication,
  ParentalLeaveApi,
  PensionApi,
  PregnancyApi,
  UnionApi,
} from '@island.is/clients/vmst'
import { DirectorateOfLabourRepository } from './directorate-of-labour.repository'

const period = (rightsCodePeriod?: string | null) => ({
  from: '2027-01-01',
  to: '2027-01-31',
  ratio: '100',
  approved: true,
  paid: false,
  rightsCodePeriod,
})

const repositoryReturning = (application: Partial<NewApplication>) =>
  new DirectorateOfLabourRepository(
    { debug: jest.fn(), warning: jest.fn() } as unknown as Logger,
    {} as ParentalLeaveApi,
    {} as UnionApi,
    {} as PensionApi,
    {} as PregnancyApi,
    {
      applicationGetApplication: jest.fn().mockResolvedValue({ application }),
    } as unknown as ApplicationApi,
  )

describe('DirectorateOfLabourRepository.getApplicationInfo', () => {
  it('should give V1 a string rights code when VMST leaves it out', async () => {
    const repository = repositoryReturning({
      periods: [period(null), period(undefined), period('M-L-GR,ORLOF-FBF')],
    })

    const application = await repository.getApplicationInfo('2026-00001')

    expect(application?.periods.map((p) => p.rightsCodePeriod)).toEqual([
      '',
      '',
      'M-L-GR,ORLOF-FBF',
    ])
  })
})
