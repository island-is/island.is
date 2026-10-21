import { ExternalData } from '@island.is/application/types'
import {
  isExemptionCase,
  shouldShowCertificateForSicknessAndRehabilitation,
  shouldShowConfirmationOfIllHealth,
  shouldShowConfirmationOfJobSearch,
  shouldShowConfirmationOfPendingResolution,
  shouldShowConfirmedTreatment,
  shouldShowRehabilitationPlan,
} from './conditionUtils'
import {
  MedicalAndRehabilitationPaymentsApplicationType,
  MedicalAndRehabilitationPaymentsConfirmationType,
} from './constants'

const buildExternalData = ({
  applicationType,
  confirmationType,
  hasActiveExemption,
}: {
  applicationType?: string
  confirmationType?: string
  hasActiveExemption?: boolean
}): ExternalData =>
  ({
    socialInsuranceAdministrationMARPApplicationType: {
      data: applicationType ? { applicationType, confirmationType } : null,
    },
    socialInsuranceAdministrationMARPExemption: {
      data: hasActiveExemption === undefined ? null : { hasActiveExemption },
    },
  } as unknown as ExternalData)

describe('exemption case (jaðartilvik)', () => {
  it('is not an exemption case without exemption data', () => {
    expect(isExemptionCase(buildExternalData({}))).toBe(false)
    expect(
      isExemptionCase(buildExternalData({ hasActiveExemption: false })),
    ).toBe(false)
  })

  it('is an exemption case when the exemption is active', () => {
    expect(
      isExemptionCase(buildExternalData({ hasActiveExemption: true })),
    ).toBe(true)
  })

  it('hides the certificate and confirmation sections', () => {
    const cases: Array<[string, string, (e: ExternalData) => boolean]> = [
      [
        MedicalAndRehabilitationPaymentsApplicationType.EH1,
        MedicalAndRehabilitationPaymentsConfirmationType.ENDURHAEFING,
        shouldShowRehabilitationPlan,
      ],
      [
        MedicalAndRehabilitationPaymentsApplicationType.SG1,
        MedicalAndRehabilitationPaymentsConfirmationType.VIDURKENND_MEDFERD,
        shouldShowConfirmedTreatment,
      ],
      [
        MedicalAndRehabilitationPaymentsApplicationType.SG1,
        MedicalAndRehabilitationPaymentsConfirmationType.BID_EFTIR_URRAEDI,
        shouldShowConfirmationOfPendingResolution,
      ],
      [
        MedicalAndRehabilitationPaymentsApplicationType.SG1,
        MedicalAndRehabilitationPaymentsConfirmationType.HEILSUBRESTUR,
        shouldShowConfirmationOfIllHealth,
      ],
      [
        MedicalAndRehabilitationPaymentsApplicationType.EH1,
        MedicalAndRehabilitationPaymentsConfirmationType.ATVINNULEIT,
        shouldShowConfirmationOfJobSearch,
      ],
    ]

    for (const [applicationType, confirmationType, shouldShow] of cases) {
      expect(
        shouldShow(buildExternalData({ applicationType, confirmationType })),
      ).toBe(true)
      expect(
        shouldShow(
          buildExternalData({
            applicationType,
            confirmationType,
            hasActiveExemption: true,
          }),
        ),
      ).toBe(false)
    }

    expect(
      shouldShowCertificateForSicknessAndRehabilitation(buildExternalData({})),
    ).toBe(true)
    expect(
      shouldShowCertificateForSicknessAndRehabilitation(
        buildExternalData({ hasActiveExemption: true }),
      ),
    ).toBe(false)
  })
})
