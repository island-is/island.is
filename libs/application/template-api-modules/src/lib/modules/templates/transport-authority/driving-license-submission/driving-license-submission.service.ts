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
import {
  DriverLicenseWithoutImages,
  isApplicationAlreadyExists,
} from '@island.is/clients/driving-license'
import { messages as drivingLicenseMessages } from '@island.is/application/templates/driving-license'
import {
  PostTemporaryLicenseWithHealthDeclarationMapper,
  DrivingLicenseSchema,
} from './utils/healthDeclarationMapper'
import { formatPhoneNumber } from './utils'

const calculateNeedsHealthCert = (healthDeclaration = {}) => {
  return !!Object.values(healthDeclaration).find((val) => val === 'yes')
}

/**
 * Maps the form's yes/no health answers to the booleans RLS expects. Shared by
 * BE and — behind their redesign flags — B-temp and B-full.
 *
 * The ten keys are listed explicitly rather than derived from the answers, so an
 * unanswered question becomes `false` rather than being omitted. The older mapper
 * in `utils/healthDeclarationMapper.ts` maps over the answer object instead, which
 * silently drops unanswered keys — RLS then reads those as null, not false.
 */
const toHealthDeclarationModel = (
  healthDeclaration: Record<string, string> = {},
) => ({
  isDisabled: healthDeclaration?.isDisabled === YES,
  hasDiabetes: healthDeclaration?.hasDiabetes === YES,
  hasEpilepsy: healthDeclaration?.hasEpilepsy === YES,
  isAlcoholic: healthDeclaration?.isAlcoholic === YES,
  hasHeartDisease: healthDeclaration?.hasHeartDisease === YES,
  hasMentalIllness: healthDeclaration?.hasMentalIllness === YES,
  hasOtherDiseases: healthDeclaration?.hasOtherDiseases === YES,
  usesMedicalDrugs: healthDeclaration?.usesMedicalDrugs === YES,
  usesContactGlasses: healthDeclaration?.usesContactGlasses === YES,
  hasReducedPeripheralVision:
    healthDeclaration?.hasReducedPeripheralVision === YES,
})

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
  }: TemplateApiModuleActionProps): Promise<{
    success: boolean
    // Persisted by the framework at `externalData.submitApplication.data`, so the
    // RLS application guid is retrievable from the application record for support/
    // reconciliation — not only from the api logs. Present for the redesigned
    // B-temp/B-full v6 flows; null for the paths that don't return one.
    applicationGuid?: string | null
  }> {
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
      // Preserve a guid already stored on a prior run: if submitApplication
      // re-enters (state re-entry, admin re-trigger, retry), the v6 call returns
      // APPLICATION_ALREADY_EXISTS and the client guard resolves with a null
      // guid — which would otherwise overwrite the good guid the framework stored
      // at externalData.submitApplication.data on the first pass.
      applicationGuid:
        result.applicationGuid ??
        getValueViaPath<string>(
          application.externalData,
          'submitApplication.data.applicationGuid',
        ) ??
        null,
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
    // RLS's error code is in `problem.title` for problem+json responses (the full
    // endpoint), but the temporary endpoint returns a plain-JSON body carrying it
    // as `body.errorCode` instead — fall back to that so both go through
    // describeErrorCode and the applicant gets the localised text, not the
    // generic "submission failed".
    const code =
      err.problem?.title ??
      (err.body as { errorCode?: string } | undefined)?.errorCode
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

  /**
   * Reads the applicant's uploaded health certificate from S3 and maps it to the
   * contentList shape RLS expects. Shared by every branch that can send one:
   * 65+, BE, and — behind their redesign flags — B-temp and B-full. This was
   * copy-pasted per product, so a fix had to land in every copy.
   *
   * Throws the applicant-facing "certificate required" error on an empty result:
   * every caller reaches this only when a certificate IS required, so nothing
   * attached is always a hard stop rather than an omitted key. Deciding *whether*
   * a certificate is required stays with the caller — 65+ always needs one, the
   * other three only when a health answer, a remark or the glasses check fires.
   */
  private async readHealthCertificateContentList(
    application: ApplicationWithAttachments,
  ): Promise<
    Array<{
      fileName: string
      fileExtension: string
      contentType: string
      content: string
      description: string
    }>
  > {
    let contentList
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

    return contentList
  }

  // A v6 create returns 400 APPLICATION_ALREADY_EXISTS when RLS already holds an
  // application for this person+category. Treat that as success ONLY when THIS
  // application already has a `submitApplication` entry — i.e. a lost-response
  // retry re-running submit on the same application (the framework records that
  // entry even when the first attempt failed, so it is present on the retry).
  //
  // A fresh application with no such entry means a *different* application created
  // the RLS one; the v6 endpoint is a create, not an upsert, so this submission's
  // (possibly changed) payload was discarded. Rethrow so the applicant sees RLS's
  // own error via `toSubmissionError` — the truthful outcome, matching BE — rather
  // than a false "Umsókn móttekin" that hides the lost edits and the payment.
  private async createToleratingLostResponse(
    application: ApplicationWithAttachments,
    create: () => Promise<NewDrivingLicenseResult>,
  ): Promise<NewDrivingLicenseResult> {
    try {
      return await create()
    } catch (e) {
      if (
        isApplicationAlreadyExists(e) &&
        getValueViaPath(application.externalData, 'submitApplication') !==
          undefined
      ) {
        this.log(
          'info',
          'RLS application already exists on submit retry; treating as success',
          { applicationId: application.id },
        )
        return {
          success: true,
          errorMessage: null,
          applicationGuid:
            getValueViaPath<string>(
              application.externalData,
              'submitApplication.data.applicationGuid',
            ) ?? null,
        }
      }
      throw e
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
    const healthDeclarationAnswers =
      getValueViaPath<Record<string, string>>(answers, 'healthDeclaration') ??
      {}
    // `glassesCheck.data === true` means the applicant's current licence carries
    // a glasses code — not that their answers contradict it. (The contradiction
    // is `healthDeclaration.contactGlassesMismatch`, a different answer.)
    const licenseRequiresGlasses =
      getValueViaPath<boolean>(
        application.externalData,
        'glassesCheck.data',
      ) === true
    // Certificate-required predicate, matching BE's rule. Deliberately NOT
    // merged into `needsHealthCert` above: that one feeds the legacy v5
    // `needsToPresentHealthCertificate` flags, which must keep their exact
    // current values for flag-off drafts.
    const needsHealthCertificate =
      needsHealthCert || remarks || licenseRequiresGlasses
    const needsQualityPhoto = answers.willBringQualityPhoto === 'yes'
    const jurisdictionId = Number(
      getValueViaPath(answers, 'delivery.jurisdiction'),
    )
    const teacher = answers.drivingInstructor as string
    const email = answers.email as string
    const deliveryMethod = getValueViaPath(answers, 'delivery.deliveryMethod')
    const phone = formatPhoneNumber(answers.phone as string)
    const setJurisdictionToKopavogur = 37

    // Legacy B-temp only: the v5 two-call path. It carried optional biometric-ID
    // params, but the only flow that ever passed them (flag-on B-temp) now
    // returns early through the v6 endpoint, so they are gone.
    const postHealthDeclaration = async (
      nationalId: string,
      answers: FormValue,
      auth: User,
    ) => {
      await this.drivingLicenseService
        .postHealthDeclaration(
          nationalId,
          PostTemporaryLicenseWithHealthDeclarationMapper(
            answers as DrivingLicenseSchema,
          ),
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

      // 65+ always requires a certificate, so this is ungated.
      const renewalContentList = await this.readHealthCertificateContentList(
        application,
      )

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
      // was ON therefore keeps the redesigned flow even after a global
      // rollback; only a NEW draft begun after rollback freezes the flag OFF
      // and takes the legacy path below unchanged.
      const isBFullRedesignEnabled =
        getValueViaPath<boolean>(answers, 'isBFullRedesignEnabled') === true

      if (isBFullRedesignEnabled) {
        // Redesigned B-full posts the health declaration and, when required, the
        // certificate itself, through the v6 `withhealthdeclaration` endpoint.
        // The declaration is always sent (as BE does) so there is one payload
        // shape per product rather than one per flag/certificate combination;
        // previously B-full sent only a derived boolean and dropped the ten
        // answers entirely.
        const resolved = this.resolveSelectedPhotoBiometrics(
          answers,
          application,
        )

        const fullResult = await this.createToleratingLostResponse(
          application,
          async () =>
            this.drivingLicenseService.newDrivingLicenseWithHealthDeclaration(
              auth,
              {
                licenseCategory: DrivingLicenseCategory.B,
                districtId: jurisdictionId
                  ? jurisdictionId
                  : setJurisdictionToKopavogur,
                sendPlasticToPerson: deliveryMethod === Pickup.POST,
                email,
                primaryPhoneNumber: phone,
                healthDeclaration: toHealthDeclarationModel(
                  healthDeclarationAnswers,
                ),
                contentList: needsHealthCertificate
                  ? await this.readHealthCertificateContentList(application)
                  : undefined,
                photoBiometricsId: resolved?.photoBiometricsId,
                signatureBiometricsId: resolved?.signatureBiometricsId,
              },
            ),
        )

        // Reconciliation record: our application id paired with the RLS-side
        // application guid (null on the lost-response duplicate path).
        this.log('info', 'Created full driving-license application in RLS', {
          applicationId: application.id,
          applicationGuid: fullResult.applicationGuid,
        })

        return fullResult
      }

      // Legacy B-full — flag frozen OFF, so there is no photo step and no
      // biometric IDs to send. Byte-identical to the pre-redesign request.
      return this.drivingLicenseService.newDrivingLicense(nationalId, {
        jurisdictionId: jurisdictionId
          ? jurisdictionId
          : setJurisdictionToKopavogur,
        sendLicenseInMail: deliveryMethod === Pickup.POST ? 1 : 0,
        needsToPresentHealthCertificate: needsHealthCert || remarks,
        needsToPresentQualityPhoto: needsQualityPhoto,
        licenseCategory: DrivingLicenseCategory.B,
      })
    } else if (applicationFor === 'B-temp') {
      // The redesigned B-temp flow (photo selection plus the health-certificate
      // upload) is gated on the *persisted* flag — captured into answers by a
      // hidden input during prerequisites — not on the mere presence of
      // `selectLicensePhoto`, so a draft created while the flag was on keeps
      // that flow and a draft created after a rollback takes the legacy path
      // below unchanged.
      const isBTempRedesignEnabled =
        getValueViaPath<boolean>(answers, 'isBTempRedesignEnabled') === true

      if (isBTempRedesignEnabled) {
        // Redesigned B-temp: one call instead of two. The legacy path below
        // posts the declaration and then submits, both of which RLS documents as
        // "Apply for…" and both of which return NewTemporaryLicsenseDto; the v6
        // endpoint does both jobs.
        const resolved = this.resolveSelectedPhotoBiometrics(
          answers,
          application,
        )

        const tempResult = await this.createToleratingLostResponse(
          application,
          async () =>
            this.drivingLicenseService.newTemporaryDrivingLicenseWithHealthDeclaration(
              auth,
              {
                districtId: jurisdictionId
                  ? jurisdictionId
                  : setJurisdictionToKopavogur,
                instructorSSN: teacher,
                sendPlasticToPerson: deliveryMethod === Pickup.POST,
                email,
                primaryPhoneNumber: phone,
                healthDeclaration: toHealthDeclarationModel(
                  healthDeclarationAnswers,
                ),
                contentList: needsHealthCertificate
                  ? await this.readHealthCertificateContentList(application)
                  : undefined,
                photoBiometricsId: resolved?.photoBiometricsId,
                signatureBiometricsId: resolved?.signatureBiometricsId,
              },
            ),
        )

        // Reconciliation record: our application id paired with the RLS-side
        // application guid (null on the lost-response duplicate path).
        this.log(
          'info',
          'Created temporary driving-license application in RLS',
          {
            applicationId: application.id,
            applicationGuid: tempResult.applicationGuid,
          },
        )

        return tempResult
      }

      // Legacy B-temp — flag frozen OFF, so no photo step and no biometric IDs.
      // Two calls: the declaration first, then the application itself.
      if (needsHealthCert) {
        await postHealthDeclaration(nationalId, answers, auth)
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

      // BE uses the shared predicate above — it recomputed an identical one from
      // the same inputs until the redesigned B-temp/B-full flows needed the same
      // rule and it was hoisted.
      const contentList = needsHealthCertificate
        ? await this.readHealthCertificateContentList(application)
        : undefined

      // Health declaration model — always sent for BE
      const healthDeclarationModel = toHealthDeclarationModel(
        healthDeclarationAnswers,
      )

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
