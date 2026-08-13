import { Inject, Injectable } from '@nestjs/common'
import {
  DrivingLicenseCategory,
  DrivingLicenseService,
  NewDrivingLicenseResult,
  Pickup,
} from '@island.is/api/domains/driving-license'

import { SharedTemplateApiService } from '../../../shared'
import { AttachmentS3Service } from '../../../shared/services'
import { TemplateApiModuleActionProps } from '../../../../types'
import {
  coreErrorMessages,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import {
  ApplicationTypes,
  ApplicationWithAttachments,
  FormValue,
  InstitutionNationalIds,
} from '@island.is/application/types'
import {
  generateDrivingLicenseSubmittedEmail,
  generateDrivingAssessmentApprovalEmail,
} from './emailGenerators'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { FetchError } from '@island.is/clients/middlewares'
import { TemplateApiError } from '@island.is/nest/problem'
import { User } from '@island.is/auth-nest-tools'
import type { Locale } from '@island.is/shared/types'
import { DriverLicenseWithoutImages } from '@island.is/clients/driving-license'
import { messages as drivingLicenseMessages } from '@island.is/application/templates/driving-license'
import {
  PostTemporaryLicenseWithHealthDeclarationMapper,
  DrivingLicenseSchema,
} from './utils/healthDeclarationMapper'
import { formatPhoneNumber } from './utils'

const calculateNeedsHealthCert = (healthDeclaration = {}) => {
  return !!Object.values(healthDeclaration).find((val) => val === 'yes')
}

const getContentType = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? ''
  switch (ext) {
    case 'pdf':
      return 'application/pdf'
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    default:
      return 'application/octet-stream'
  }
}

@Injectable()
export class DrivingLicenseSubmissionService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly drivingLicenseService: DrivingLicenseService,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly attachmentS3Service: AttachmentS3Service,
  ) {
    super(ApplicationTypes.DRIVING_LICENSE)
  }

  async createCharge({
    application: { id, answers },
    auth,
  }: TemplateApiModuleActionProps) {
    const applicationFor = getValueViaPath<
      'B-full' | 'B-temp' | 'BE' | 'B-full-renewal-65'
    >(answers, 'applicationFor', 'B-full')

    const chargeItemCode =
      applicationFor === 'B-full'
        ? 'AY110'
        : applicationFor === 'BE'
        ? 'AY148'
        : applicationFor === 'B-full-renewal-65'
        ? 'AY113'
        : 'AY114'

    const response = await this.sharedTemplateAPIService.createCharge(
      auth,
      id,
      InstitutionNationalIds.SYSLUMENN,
      [{ code: chargeItemCode }],
    )

    // last chance to validate before the user receives a dummy
    if (!response?.paymentUrl) {
      throw new Error('paymentUrl missing in response')
    }

    return response
  }

  async submitApplication({
    application,
    auth,
    currentUserLocale,
  }: TemplateApiModuleActionProps): Promise<{ success: boolean }> {
    const { answers } = application
    const nationalId = application.applicant

    const isPayment = await this.sharedTemplateAPIService.getPaymentStatus(
      application.id,
    )

    if (!isPayment?.fulfilled) {
      return {
        success: false,
      }
    }

    let result
    try {
      result = await this.createLicense(nationalId, answers, auth, application)
    } catch (e) {
      this.log('error', 'Creating license failed', {
        e,
        applicationFor: answers.applicationFor,
        jurisdiction: answers.jurisdictionId,
      })

      if (e instanceof Error && e.name === 'FetchError') {
        throw await this.toSubmissionError(
          e as unknown as FetchError,
          currentUserLocale,
        )
      }

      throw e
    }

    if (!result.success) {
      throw new Error(`Application submission failed (${result.errorMessage})`)
    }

    try {
      await this.sharedTemplateAPIService.sendEmail(
        generateDrivingLicenseSubmittedEmail,
        application,
      )
    } catch (e) {
      this.log(
        'error',
        'Could not send email to applicant after successful submission',
        { e },
      )
    }

    return {
      success: true,
    }
  }

  private log(lvl: 'error' | 'info', message: string, meta: unknown) {
    this.logger.log(lvl, `[driving-license-submission] ${message}`, meta)
  }

  /**
   * Turn a failed RLS submission into the error the applicant sees. RLS puts its
   * error code in `problem.title`; if that code exists in the RLS error-code
   * table we surface the table's own human-readable text in the user's language
   * instead of leaking the raw code. Anything we can't resolve (no code, code
   * not in the table, or a best-effort lookup failure) keeps the previous
   * behaviour: raw `problem.title` / generic message, with `problem.detail` as
   * the summary. `describeErrorCode` is best-effort and never throws.
   */
  private async toSubmissionError(
    err: FetchError,
    locale: Locale,
  ): Promise<TemplateApiError> {
    const code = err.problem?.title
    if (code) {
      try {
        const described = await this.drivingLicenseService.describeErrorCode(
          code,
        )
        // The table carries both languages for every code; pick the user's. For
        // an `en` user with no English text we fall through rather than show
        // Icelandic (mirrors the eligibility screen).
        const localized = locale === 'en' ? described?.en : described?.is
        if (localized) {
          // Generic header + the RLS text as the body. Both fields must be
          // non-empty: the payment screen's getErrorReasonIfPresent only treats
          // a reason as a real provider error (and renders our text) when title
          // AND summary are set — and RLS often sends a code with no
          // `problem.detail`, so the text must go in `summary`, not `title`.
          return new TemplateApiError(
            {
              title: coreErrorMessages.failedDataProviderSubmit,
              summary: localized,
            },
            err.status || 400,
          )
        }
      } catch (lookupError) {
        // describeErrorCode is best-effort; never let resolving the nicer copy
        // turn a handled submission error into an unhandled 500.
        this.log('error', 'Failed to resolve RLS error-code description', {
          lookupError,
          code,
        })
      }
    }

    // `problem.title` is RLS's raw error *code* (not human text), so it must
    // never become the user-facing title — always fall back to the generic
    // message. (An unresolved code with a non-empty `summary` would otherwise
    // leak the raw code into the opt-in submit-error toast.)
    return new TemplateApiError(
      {
        title: coreErrorMessages.failedDataProviderSubmit,
        summary: err.problem?.detail || '',
      },
      err.status || 400,
    )
  }

  /**
   * Resolves the applicant's redesign photo selection to the biometric IDs RLS
   * expects. Shared by all four submit branches (65+, B-full, B-temp, BE) —
   * this logic was previously copy-pasted four times, so a fix had to land in
   * every copy or one product would silently drift.
   *
   * Returns `undefined` when there is no selection at all, so each branch keeps
   * its OWN default: BE and 65+ initialise to `null`, while B-full and B-temp
   * initialise to `undefined` so the keys are omitted from the request entirely
   * and the flag-off call stays byte-identical to the pre-redesign flow. That
   * distinction is load-bearing — collapsing it to a single default here would
   * silently change two live request shapes.
   *
   * Defensive cases log and continue rather than throwing, deliberately:
   * `createLicense` runs on entry to `States.DONE`, which is reached from
   * `States.PAYMENT`, so throwing here would strand an application the
   * applicant has already PAID for.
   */
  private resolveSelectedPhotoBiometrics(
    answers: FormValue,
    application: ApplicationWithAttachments,
  ):
    | { photoBiometricsId: string | null; signatureBiometricsId: string | null }
    | undefined {
    const selectedPhoto = getValueViaPath<string>(answers, 'selectLicensePhoto')

    if (selectedPhoto === 'qualityPhoto') {
      // RLS already holds the quality photo, so no biometric IDs are sent —
      // only verify it is actually there, for logging.
      //
      // Gate on `imageId`, NOT on the `pohto` binary: legacy RLS records
      // routinely carry a valid imageId with a null binary, and applicants can
      // legitimately select those — the picker offers them and falls back to a
      // placeholder thumbnail (see `hasUsableRlsQualityPhoto`, which is what
      // the form itself gates on). Checking `pohto` logged an error for every
      // such applicant even though the submission was entirely correct.
      const qualityPhotoData = application.externalData
        ?.qualityPhotoAndSignature?.data as {
        imageId?: number | null
        pohto?: string | null
        imageTypeId?: number | null
      } | null

      if (qualityPhotoData?.imageId == null) {
        this.log(
          'error',
          'User selected qualityPhoto but no quality photo exists in externalData',
          {},
        )
      }

      return { photoBiometricsId: null, signatureBiometricsId: null }
    }

    if (!selectedPhoto) {
      return undefined
    }

    // A Þjóðskrá photo was selected — validate it against the FACIAL entries.
    const allThjodskraPhotos =
      getValueViaPath<
        Array<{ biometricId: string; contentSpecification: string }>
      >(application.externalData, 'allPhotosFromThjodskra.data.images') ?? []

    const facialPhotos = allThjodskraPhotos.filter(
      (p) => p.contentSpecification === 'FACIAL',
    )

    const isValidFacial = facialPhotos.some(
      (p) => p.biometricId === selectedPhoto,
    )

    if (!isValidFacial) {
      this.log(
        'error',
        'Selected photo biometricId does not match any FACIAL Thjodskra photo',
        { selectedPhoto },
      )
    }

    return {
      photoBiometricsId: isValidFacial ? selectedPhoto : null,
      signatureBiometricsId: isValidFacial
        ? allThjodskraPhotos.find((p) => p.contentSpecification === 'SIGNATURE')
            ?.biometricId ?? null
        : null,
    }
  }

  private async createLicense(
    nationalId: string,
    answers: FormValue,
    auth: User,
    application: ApplicationWithAttachments,
  ): Promise<NewDrivingLicenseResult> {
    // If using fake data, skip calling RLS and pretend submission succeeded.
    // Opt-in escape hatch: fakeData.submitToRLS = 'yes' bypasses this
    // short-circuit so devs can still exercise the real RLS submission path
    // (with whatever fake-derived biometric IDs etc. are in externalData) for
    // integration testing.
    const useFakeData = getValueViaPath<'yes' | 'no'>(
      answers,
      'fakeData.useFakeData',
    )
    const fakeDataSubmitToRLS = getValueViaPath<'yes' | 'no'>(
      answers,
      'fakeData.submitToRLS',
    )
    if (useFakeData === YES && fakeDataSubmitToRLS !== YES) {
      // Dev-only: simulate a failed RLS submission with a chosen error code so
      // the payment-step error UI can be exercised end-to-end without calling
      // RLS. The thrown shape matches a real RLS FetchError, so it flows through
      // the same `submitApplication` catch → `toSubmissionError` path (and the
      // code is still resolved against the real error-code table).
      const fakeSubmitErrorCode = getValueViaPath<string>(
        answers,
        'fakeData.submitErrorCode',
      )
      if (fakeSubmitErrorCode) {
        const fakeError = new Error(
          'Simulated RLS submission failure',
        ) as Error & { problem?: { title: string }; status?: number }
        fakeError.name = 'FetchError'
        fakeError.problem = { title: fakeSubmitErrorCode }
        fakeError.status = 400
        throw fakeError
      }
      return {
        success: true,
        errorMessage: null,
      }
    }

    const applicationFor =
      getValueViaPath<'B-full' | 'B-temp' | 'BE' | 'B-full-renewal-65'>(
        answers,
        'applicationFor',
      ) ?? 'B-full'

    const needsHealthCert = calculateNeedsHealthCert(answers.healthDeclaration)
    const remarks = answers.hasHealthRemarks === 'yes'
    const needsQualityPhoto = answers.willBringQualityPhoto === 'yes'
    const jurisdictionId = Number(
      getValueViaPath(answers, 'delivery.jurisdiction'),
    )
    const teacher = answers.drivingInstructor as string
    const email = answers.email as string
    const deliveryMethod = getValueViaPath(answers, 'delivery.deliveryMethod')
    const phone = formatPhoneNumber(answers.phone as string)
    const setJurisdictionToKopavogur = 37

    const postHealthDeclaration = async (
      nationalId: string,
      answers: FormValue,
      auth: User,
      photoBiometricsId?: string | null,
      signatureBiometricsId?: string | null,
    ) => {
      await this.drivingLicenseService
        .postHealthDeclaration(
          nationalId,
          {
            ...PostTemporaryLicenseWithHealthDeclarationMapper(
              answers as DrivingLicenseSchema,
            ),
            photoBiometricsId,
            signatureBiometricsId,
          },
          auth.authorization.split(' ')[1] ?? '',
        )
        .catch((e) => {
          throw new Error(
            `Unexpected error (creating driver's license with health declarations): '${e}'`,
          )
        })
    }

    if (applicationFor === 'B-full-renewal-65') {
      const is65RenewalRedesignEnabled = getValueViaPath<boolean>(
        answers,
        'is65RenewalRedesignEnabled',
      )

      if (!is65RenewalRedesignEnabled) {
        // Legacy 65+ submit path. Used while the redesign flag is OFF in
        // prod and during the post-deploy rollout window. Removed once the
        // flag has been ON in prod long enough that no flag-OFF submissions
        // reach this branch.
        return this.drivingLicenseService.renewDrivingLicense65AndOver(
          auth.authorization,
          {
            jurisdiction: jurisdictionId
              ? jurisdictionId
              : setJurisdictionToKopavogur,
            ...(deliveryMethod
              ? {
                  pickupPlasticAtDistrict: deliveryMethod === Pickup.DISTRICT,
                  sendPlasticToPerson: deliveryMethod === Pickup.POST,
                }
              : {}),
          },
        )
      }

      const renewalEmail = getValueViaPath<string>(answers, 'email')
      const renewalPhone = formatPhoneNumber(
        getValueViaPath<string>(answers, 'phone') ?? '',
      )
      // 65+ initialises to `null`, so an absent selection keeps `null`.
      let renewalPhotoBiometricsId: string | null = null
      let renewalSignatureBiometricsId: string | null = null

      const resolvedRenewalBiometrics = this.resolveSelectedPhotoBiometrics(
        answers,
        application,
      )

      if (resolvedRenewalBiometrics) {
        renewalPhotoBiometricsId = resolvedRenewalBiometrics.photoBiometricsId
        renewalSignatureBiometricsId =
          resolvedRenewalBiometrics.signatureBiometricsId
      }

      let renewalContentList:
        | Array<{
            fileName: string
            fileExtension: string
            contentType: string
            content: string
            description: string
          }>
        | undefined

      try {
        const files = await this.attachmentS3Service.getFiles(application, [
          'healthCertificate',
        ])

        renewalContentList = files
          .filter((f) => f.fileContent)
          .map((f) => {
            const rawExt = f.fileName.split('.').pop()?.toLowerCase() ?? ''
            const ext = rawExt === 'jpg' ? 'jpeg' : rawExt
            return {
              fileName: f.fileName,
              fileExtension: ext,
              contentType: getContentType(f.fileName),
              content: f.fileContent,
              description: 'Laeknisvottord',
            }
          })
      } catch (e) {
        this.log('error', 'Failed to read health certificate files from S3', {
          e,
        })
        throw e
      }

      if (!renewalContentList || renewalContentList.length === 0) {
        throw new TemplateApiError(
          {
            title: coreErrorMessages.failedDataProviderSubmit,
            summary: drivingLicenseMessages.healthCertificateRequired,
          },
          400,
        )
      }

      return this.drivingLicenseService.applyForRenewal65(auth.authorization, {
        jurisdiction: jurisdictionId
          ? jurisdictionId
          : setJurisdictionToKopavogur,
        primaryPhoneNumber: renewalPhone,
        studentEmail: renewalEmail ?? '',
        ...(deliveryMethod
          ? {
              pickupPlasticAtDistrict: deliveryMethod === Pickup.DISTRICT,
              sendPlasticToPerson: deliveryMethod === Pickup.POST,
            }
          : {}),
        contentList: renewalContentList,
        photoBiometricsId: renewalPhotoBiometricsId,
        signatureBiometricsId: renewalSignatureBiometricsId,
      })
    } else if (applicationFor === 'B-full') {
      // Photo selection only applies to the redesigned B-full flow. The
      // submission service cannot read the live feature-flag client, so it
      // branches on the flag value *frozen into answers* at prerequisites.
      // This is intentionally sticky: a draft keeps the flow it started with
      // even if the flag is flipped mid-lifecycle. A draft begun while the flag
      // was ON therefore keeps sending biometric IDs even after a global
      // rollback; only a NEW draft begun after rollback freezes the flag OFF.
      // Flag frozen OFF → both IDs stay `undefined`, so the keys are omitted
      // from the RLS request and the call is byte-identical to the pre-redesign
      // flow.
      // NOTE: the health-certificate upload is intentionally not wired here yet
      // — the full-license RLS endpoint has no `contentList`, so only the photo
      // is redesigned for now (same as B-temp).
      const isBFullRedesignEnabled =
        getValueViaPath<boolean>(answers, 'isBFullRedesignEnabled') === true

      let photoBiometricsId: string | null | undefined
      let signatureBiometricsId: string | null | undefined

      if (isBFullRedesignEnabled) {
        const resolved = this.resolveSelectedPhotoBiometrics(
          answers,
          application,
        )

        if (resolved) {
          photoBiometricsId = resolved.photoBiometricsId
          signatureBiometricsId = resolved.signatureBiometricsId
        }
      }

      return this.drivingLicenseService.newDrivingLicense(nationalId, {
        jurisdictionId: jurisdictionId
          ? jurisdictionId
          : setJurisdictionToKopavogur,
        sendLicenseInMail: deliveryMethod === Pickup.POST ? 1 : 0,
        needsToPresentHealthCertificate: needsHealthCert || remarks,
        needsToPresentQualityPhoto: needsQualityPhoto,
        licenseCategory: DrivingLicenseCategory.B,
        photoBiometricsId,
        signatureBiometricsId,
      })
    } else if (applicationFor === 'B-temp') {
      // Photo selection only applies to the redesigned B-temp flow. Gate on
      // the *persisted* flag (captured into answers by a hidden input during
      // prerequisites) — not on the mere presence of `selectLicensePhoto` —
      // so a draft created while the flag was on does not keep sending
      // biometric IDs after the flag is turned off. Flag off → both IDs stay
      // `undefined`, so the keys are omitted from the RLS request bodies
      // entirely and the calls are byte-identical to the pre-redesign flow.
      const isBTempRedesignEnabled =
        getValueViaPath<boolean>(answers, 'isBTempRedesignEnabled') === true

      let photoBiometricsId: string | null | undefined
      let signatureBiometricsId: string | null | undefined

      if (isBTempRedesignEnabled) {
        const resolved = this.resolveSelectedPhotoBiometrics(
          answers,
          application,
        )

        if (resolved) {
          photoBiometricsId = resolved.photoBiometricsId
          signatureBiometricsId = resolved.signatureBiometricsId
        }
      }

      if (needsHealthCert) {
        await postHealthDeclaration(
          nationalId,
          answers,
          auth,
          photoBiometricsId,
          signatureBiometricsId,
        )
      }
      return this.drivingLicenseService.newTemporaryDrivingLicense(
        nationalId,
        auth.authorization.replace('Bearer ', ''),
        {
          jurisdictionId: jurisdictionId
            ? jurisdictionId
            : setJurisdictionToKopavogur,
          sendLicenseInMail: deliveryMethod === Pickup.POST ? true : false,
          needsToPresentHealthCertificate: needsHealthCert,
          needsToPresentQualityPhoto: needsQualityPhoto,
          teacherNationalId: teacher,
          email: email,
          phone: phone,
          photoBiometricsId,
          signatureBiometricsId,
        },
      )
    } else if (applicationFor === 'BE') {
      const instructorSSN = getValueViaPath<string>(
        answers,
        'drivingInstructor',
      )
      const beEmail = getValueViaPath<string>(answers, 'email')
      const bePhone = formatPhoneNumber(
        getValueViaPath<string>(answers, 'phone') ?? '',
      )
      // BE has no redesign flag — this selector is unconditional and live in
      // production. It initialises to `null`, so an absent selection keeps
      // `null` (the keys are always present on the BE request).
      let photoBiometricsId: string | null = null
      let signatureBiometricsId: string | null = null

      const resolvedBeBiometrics = this.resolveSelectedPhotoBiometrics(
        answers,
        application,
      )

      if (resolvedBeBiometrics) {
        photoBiometricsId = resolvedBeBiometrics.photoBiometricsId
        signatureBiometricsId = resolvedBeBiometrics.signatureBiometricsId
      }

      // Health certificate handling
      const healthDeclaration =
        getValueViaPath<Record<string, string>>(answers, 'healthDeclaration') ??
        {}
      const beNeedsHealthCert =
        calculateNeedsHealthCert(healthDeclaration) ||
        remarks ||
        getValueViaPath<boolean>(
          application.externalData,
          'glassesCheck.data',
        ) === true

      let contentList:
        | Array<{
            fileName: string
            fileExtension: string
            contentType: string
            content: string
            description: string
          }>
        | undefined

      if (beNeedsHealthCert) {
        try {
          const files = await this.attachmentS3Service.getFiles(application, [
            'healthCertificate',
          ])

          contentList = files
            .filter((f) => f.fileContent)
            .map((f) => {
              const rawExt = f.fileName.split('.').pop()?.toLowerCase() ?? ''
              const ext = rawExt === 'jpg' ? 'jpeg' : rawExt
              return {
                fileName: f.fileName,
                fileExtension: ext,
                contentType: getContentType(f.fileName),
                content: f.fileContent,
                description: 'Laeknisvottord',
              }
            })
        } catch (e) {
          this.log('error', 'Failed to read health certificate files from S3', {
            e,
          })
          throw e
        }

        if (!contentList || contentList.length === 0) {
          throw new TemplateApiError(
            {
              title: coreErrorMessages.failedDataProviderSubmit,
              summary: drivingLicenseMessages.healthCertificateRequired,
            },
            400,
          )
        }
      }

      // Health declaration model — always sent for BE
      const healthDeclarationModel = {
        isDisabled: healthDeclaration?.isDisabled === 'yes',
        hasDiabetes: healthDeclaration?.hasDiabetes === 'yes',
        hasEpilepsy: healthDeclaration?.hasEpilepsy === 'yes',
        isAlcoholic: healthDeclaration?.isAlcoholic === 'yes',
        hasHeartDisease: healthDeclaration?.hasHeartDisease === 'yes',
        hasMentalIllness: healthDeclaration?.hasMentalIllness === 'yes',
        hasOtherDiseases: healthDeclaration?.hasOtherDiseases === 'yes',
        usesMedicalDrugs: healthDeclaration?.usesMedicalDrugs === 'yes',
        usesContactGlasses: healthDeclaration?.usesContactGlasses === 'yes',
        hasReducedPeripheralVision:
          healthDeclaration?.hasReducedPeripheralVision === 'yes',
      }

      return this.drivingLicenseService.applyForBELicense(
        nationalId,
        auth.authorization,
        {
          jurisdiction: jurisdictionId
            ? jurisdictionId
            : setJurisdictionToKopavogur,
          instructorSSN: instructorSSN ?? '',
          primaryPhoneNumber: bePhone,
          studentEmail: beEmail ?? '',
          contentList,
          photoBiometricsId,
          signatureBiometricsId,
          sendPlasticToPerson: deliveryMethod === Pickup.POST,
          healthDeclarationModel,
        },
      )
    }

    throw new Error('application for unknown type of license')
  }

  async submitAssessmentConfirmation({
    application,
  }: TemplateApiModuleActionProps) {
    const { answers } = application
    const studentNationalId = (answers.student as { nationalId: string })
      .nationalId
    const teacherNationalId = application.applicant

    try {
      const result = await this.drivingLicenseService.newDrivingAssessment(
        studentNationalId as string,
        teacherNationalId,
      )

      if (result.success) {
        await this.sharedTemplateAPIService.sendEmail(
          generateDrivingAssessmentApprovalEmail,
          application,
        )
        return {
          success: result.success,
        }
      } else {
        throw new Error(
          `Unexpected error (creating driver's license): '${result.errorMessage}'`,
        )
      }
    } catch (e) {
      if (e instanceof Error && e.name === 'FetchError') {
        const err = e as unknown as FetchError
        throw new TemplateApiError(
          {
            title:
              err.problem?.title || coreErrorMessages.failedDataProviderSubmit,
            summary: err.problem?.detail || '',
          },
          400,
        )
      }
    }
  }

  async glassesCheck({ auth }: TemplateApiModuleActionProps): Promise<boolean> {
    const licences: DriverLicenseWithoutImages[] =
      await this.drivingLicenseService.getAllDriverLicenses(auth.authorization)
    const hasGlasses: boolean = licences.some((license) => {
      // Visual impairments comments on driving licenses are prefixed with "01."
      return !!license.comments?.some((comment) => comment.nr?.includes('01.'))
    })
    return hasGlasses
  }
}
