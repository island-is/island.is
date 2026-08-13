import { Test } from '@nestjs/testing'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { createCurrentUser } from '@island.is/testing/fixtures'
import {
  ApplicationStatus,
  ApplicationTypes,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import { SharedTemplateApiService } from '../../../../shared'
import { AttachmentS3Service } from '../../../../shared/services'
import { DrivingLicenseSubmissionService } from '../driving-license-submission.service'
import {
  AdapterService,
  EmailService,
  emailModuleConfig,
} from '@island.is/email-service'
import { DrivingLicenseService } from '@island.is/api/domains/driving-license'
import { ConfigService } from '@nestjs/config'
import { ConfigModule } from '@island.is/nest/config'
import { createApplication } from '@island.is/application/testing'

/**
 * THROWAWAY equivalence harness for the `resolveSelectedPhotoBiometrics`
 * extraction.
 *
 * The biometric-resolution block is duplicated across all four submit branches
 * (65+, B-full, B-temp, BE). BE runs its copy UNFLAGGED in production, so the
 * refactor has no feature flag to hide behind — the only safety net is proving
 * the request payloads are unchanged.
 *
 * This captures the exact arguments handed to the RLS-facing service method for
 * a full matrix of product x flag x selection x externalData, and snapshots
 * them. Snapshot written against pre-refactor code; it must survive the
 * refactor byte-for-byte.
 *
 * Delete once the refactor has landed.
 */

const externalDataMatrix: Array<{ label: string; data: ExternalData }> = [
  { label: 'no external data', data: {} },
  {
    label: 'thjodskra FACIAL + SIGNATURE',
    data: {
      allPhotosFromThjodskra: {
        data: {
          images: [
            { biometricId: 'facial-1', contentSpecification: 'FACIAL' },
            { biometricId: 'sig-1', contentSpecification: 'SIGNATURE' },
          ],
        },
        status: 'success' as const,
        date: new Date(0),
      },
    },
  },
  {
    // The unpaired-signature gap: a valid FACIAL with no SIGNATURE entry.
    label: 'thjodskra FACIAL only (no SIGNATURE)',
    data: {
      allPhotosFromThjodskra: {
        data: {
          images: [{ biometricId: 'facial-1', contentSpecification: 'FACIAL' }],
        },
        status: 'success' as const,
        date: new Date(0),
      },
    },
  },
  {
    label: 'rls quality photo with binary',
    data: {
      qualityPhotoAndSignature: {
        data: { imageId: 7, pohto: 'b64' },
        status: 'success' as const,
        date: new Date(0),
      },
    },
  },
  {
    // The imageId gap: legacy record, valid imageId but no binary. Currently
    // logs a spurious "no quality photo exists" error.
    label: 'rls legacy record (imageId, null binary)',
    data: {
      qualityPhotoAndSignature: {
        data: { imageId: 7, pohto: null },
        status: 'success' as const,
        date: new Date(0),
      },
    },
  },
  {
    label: 'both thjodskra and rls',
    data: {
      allPhotosFromThjodskra: {
        data: {
          images: [
            { biometricId: 'facial-1', contentSpecification: 'FACIAL' },
            { biometricId: 'sig-1', contentSpecification: 'SIGNATURE' },
          ],
        },
        status: 'success' as const,
        date: new Date(0),
      },
      qualityPhotoAndSignature: {
        data: { imageId: 7, pohto: 'b64' },
        status: 'success' as const,
        date: new Date(0),
      },
    },
  },
]

const selections = [
  { label: 'no selection', value: undefined },
  { label: 'qualityPhoto', value: 'qualityPhoto' },
  { label: 'valid facial', value: 'facial-1' },
  { label: 'unmatched facial', value: 'facial-gone' },
]

const products: Array<{
  label: string
  applicationFor: string
  flagKey: string | null
  extraAnswers: FormValue
}> = [
  {
    label: 'B-full-renewal-65',
    applicationFor: 'B-full-renewal-65',
    flagKey: 'is65RenewalRedesignEnabled',
    extraAnswers: { certificate: 'yes' },
  },
  {
    label: 'B-full',
    applicationFor: 'B-full',
    flagKey: 'isBFullRedesignEnabled',
    extraAnswers: {},
  },
  {
    label: 'B-temp',
    applicationFor: 'B-temp',
    flagKey: 'isBTempRedesignEnabled',
    extraAnswers: {},
  },
  // BE has no redesign flag — its selector is unconditional and live in prod.
  { label: 'BE', applicationFor: 'BE', flagKey: null, extraAnswers: {} },
]

const flagStates = [
  { label: 'flag absent', value: undefined },
  { label: 'flag false', value: false },
  { label: 'flag true', value: true },
]

describe('biometric resolution — request-shape equivalence', () => {
  let service: DrivingLicenseSubmissionService
  let calls: Record<string, unknown[]>

  beforeEach(async () => {
    calls = {}
    const record =
      (name: string) =>
      async (...args: unknown[]) => {
        calls[name] = args
        return { success: true, errorMessage: null }
      }

    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [emailModuleConfig] }),
      ],
      providers: [
        DrivingLicenseSubmissionService,
        EmailService,
        AdapterService,
        {
          provide: DrivingLicenseService,
          useValue: {
            newDrivingLicense: jest.fn(record('newDrivingLicense')),
            newTemporaryDrivingLicense: jest.fn(
              record('newTemporaryDrivingLicense'),
            ),
            applyForBELicense: jest.fn(record('applyForBELicense')),
            applyForRenewal65: jest.fn(record('applyForRenewal65')),
            renewDrivingLicense65AndOver: jest.fn(
              record('renewDrivingLicense65AndOver'),
            ),
          },
        },
        { provide: LOGGER_PROVIDER, useValue: logger },
        {
          provide: ConfigService,
          useClass: jest.fn(() => ({ get: () => 'http://localhost' })),
        },
        {
          provide: AttachmentS3Service,
          useValue: { getFiles: jest.fn(async () => []) },
        },
        {
          provide: SharedTemplateApiService,
          useClass: jest.fn(() => ({
            async getPaymentStatus() {
              return { fulfilled: true }
            },
            async sendEmail() {
              return 'messageId'
            },
          })),
        },
      ],
    }).compile()

    service = module.get(DrivingLicenseSubmissionService)
  })

  it('produces identical RLS request payloads across the full matrix', async () => {
    const results: Record<string, unknown> = {}

    for (const product of products) {
      for (const flag of flagStates) {
        // BE has no flag — running three identical flag states would just
        // triplicate its rows for no coverage.
        if (!product.flagKey && flag.label !== 'flag absent') continue

        for (const selection of selections) {
          for (const ed of externalDataMatrix) {
            const key = `${product.label} | ${flag.label} | ${selection.label} | ${ed.label}`

            calls = {}
            const answers: FormValue = {
              applicationFor: product.applicationFor,
              email: 'mock@email.com',
              phone: '9999999',
              delivery: { deliveryMethod: 'post', jurisdiction: '37' },
              ...product.extraAnswers,
              ...(product.flagKey && flag.value !== undefined
                ? { [product.flagKey]: flag.value }
                : {}),
              ...(selection.value !== undefined
                ? { selectLicensePhoto: selection.value }
                : {}),
            }

            const application = createApplication({
              answers,
              externalData: ed.data,
              typeId: ApplicationTypes.DRIVING_LICENSE,
              status: ApplicationStatus.IN_PROGRESS,
            })

            try {
              await service.submitApplication({
                application,
                auth: createCurrentUser(),
                currentUserLocale: 'is',
              })
              // Record which method was hit and its exact arguments. Auth
              // objects carry generated values, so keep only the payloads.
              results[key] = Object.fromEntries(
                Object.entries(calls).map(([method, args]) => [
                  method,
                  args.filter(
                    (a) =>
                      typeof a === 'object' &&
                      a !== null &&
                      !('nationalId' in (a as object)),
                  ),
                ]),
              )
            } catch (e) {
              results[key] = { threw: (e as Error).message }
            }
          }
        }
      }
    }

    expect(Object.keys(results).length).toBeGreaterThan(100)
    expect(results).toMatchSnapshot()
  })
})
