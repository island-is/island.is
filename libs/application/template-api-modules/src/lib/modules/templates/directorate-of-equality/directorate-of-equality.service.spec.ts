import { Test, TestingModule } from '@nestjs/testing'
import { createApplication } from '@island.is/application/testing'
import { createCurrentUser } from '@island.is/testing/fixtures'
import type { FormValue } from '@island.is/application/types'
import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import { CompanyRegistryClientService } from '@island.is/clients/rsk/company-registry'
import { DirectorateOfEqualityClientService } from '@island.is/clients/directorate-of-equality'
import { ApplicationService as ApplicationApiService } from '@island.is/application/api/core'
import { DirectorateOfEqualityService } from './directorate-of-equality.service'

// Inside the window dataSchema enforces (tomorrow through three years out),
// derived from today so the spec doesn't expire. A year out leaves enough slack
// that a runner in any timezone stays in range.
const inWindowRemedyDate = () => {
  const date = new Date()
  date.setFullYear(date.getFullYear() + 1)
  return date.toISOString().slice(0, 10)
}

const group = (overrides: FormValue = {}) => ({
  name: 'Hópur 1',
  reason: 'Skýring',
  action: 'Aðgerð',
  signatureName: 'Nafn',
  signatureRole: 'Starfsheiti',
  employeeOrdinals: [1, 2],
  ...overrides,
})

describe('DirectorateOfEqualityService', () => {
  let service: DirectorateOfEqualityService
  let editOutliers: jest.Mock

  beforeEach(async () => {
    editOutliers = jest.fn().mockResolvedValue({})

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DirectorateOfEqualityService,
        { provide: LOGGER_PROVIDER, useValue: logger },
        { provide: CompanyRegistryClientService, useValue: {} },
        { provide: ApplicationApiService, useValue: {} },
        {
          provide: DirectorateOfEqualityClientService,
          useValue: { editOutliers },
        },
      ],
    }).compile()

    service = module.get<DirectorateOfEqualityService>(
      DirectorateOfEqualityService,
    )
  })

  describe('editOutliers', () => {
    const run = async (salaryAnalysis: FormValue) => {
      const auth = createCurrentUser()
      const application = createApplication({
        answers: { approveExternalData: true, salaryAnalysis },
      })

      await service.editOutliers({
        auth,
        application,
        currentUserLocale: 'is',
      } as Parameters<typeof service.editOutliers>[0])

      return editOutliers.mock.calls[0][2]
    }

    // DMR validates remedyDate against /^\d{4}-\d{2}-\d{2}$/ and rejects
    // anything else, so what matters is the serialised form, not the value the
    // payload holds — a `Date` would satisfy an equality check on the object
    // and still go over the wire as an ISO instant.
    it('sends the remedy date as the stored yyyy-MM-dd string', async () => {
      const remedyDate = inWindowRemedyDate()

      const body = await run({ outlierGroups: [group({ remedyDate })] })

      expect(body.groups[0].remedyDate).toBe(remedyDate)
      expect(JSON.parse(JSON.stringify(body)).groups[0].remedyDate).toBe(
        remedyDate,
      )
      expect(JSON.stringify(body)).not.toContain('T00:00:00')
    })

    // A postponed draft is the one path a blank reaches here on: it short-
    // circuits dataSchema's per-group checks. `null` on a required field is the
    // intended 400 rather than a date the applicant never committed to.
    it('sends null when the remedy date is blank', async () => {
      const body = await run({
        postponed: ['yes'],
        outlierGroups: [group({ remedyDate: '' })],
      })

      expect(body.groups[0].remedyDate).toBeNull()
    })

    it('drops groups that hold no members', async () => {
      const remedyDate = inWindowRemedyDate()

      const body = await run({
        outlierGroups: [
          group({ remedyDate }),
          group({ remedyDate, name: 'Tómur', employeeOrdinals: [] }),
        ],
      })

      expect(body.groups).toHaveLength(1)
      expect(body.groups[0].name).toBe('Hópur 1')
    })
  })
})
