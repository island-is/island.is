import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import {
  ApplicationTypes,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import {
  HealthcareWorkPermitAnswers,
  error as errorMsg,
} from '@island.is/application/templates/healthcare-work-permit'
import {
  HealthDirectorateClientService,
  NamsUpplysingar,
  StarfsleyfiUmsoknStarfsleyfi,
  UtbuaStarfsleyfiSkjalResponse,
} from '@island.is/clients/health-directorate'
import {
  Transcripts,
  UniversityOfIcelandService,
} from '@island.is/clients/university-of-iceland'
import { TemplateApiError } from '@island.is/nest/problem'

@Injectable()
export class HealthcareWorkPermitService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly healthDirectorateClientService: HealthDirectorateClientService,
    private readonly universityOfIcelandService: UniversityOfIcelandService,
  ) {
    super(ApplicationTypes.HEALTHCARE_WORK_PERMIT)
  }

  async getMyHealthcareLicenses({
    auth,
  }: TemplateApiModuleActionProps): Promise<StarfsleyfiUmsoknStarfsleyfi[]> {
    const result =
      await this.healthDirectorateClientService.getHealthCareLicensesForWorkPermit(
        auth,
      )

    // TODO Double check if this fails on empty response
    if (!result) {
      throw new TemplateApiError(
        {
          title: errorMsg.healthcareLicenseErrorTitle,
          summary: errorMsg.healthcareLicenseErrorMessage,
        },
        400,
      )
    }

    return result
  }

  async getEducationInfo({
    auth,
  }: TemplateApiModuleActionProps): Promise<StarfsleyfiUmsoknStarfsleyfi[]> {
    const academicCareer: Transcripts | null =
      await this.universityOfIcelandService.studentInfo(auth)
    const educationTracks: NamsUpplysingar[] =
      await this.healthDirectorateClientService.getHealthCareWorkPermitEducationInfo(
        auth,
      )

    if (!educationTracks || !academicCareer) {
      throw new TemplateApiError(
        {
          title: errorMsg.healthcareLicenseErrorTitle,
          summary: errorMsg.noResponseEducationInfoMessage,
        },
        400,
      )
    }

    // TODO Here I need to make sure that at least some of the users academic career exist in the workpermit educational info list in order
    // to make it to the next step.
    // const educationShortIdMap: { [shortId: string]: boolean } = {};
    // academicCareer?.transcripts?.forEach(edu => {
    //     educationShortIdMap[edu.shortId] = true;
    // });

    // // Match transcripts with education that gives a work permit
    // const matchedTranscripts: Transcripts = academicCareer?.transcripts?.filter(transcript => {
    //     return transcript.shortId in educationShortIdMap;
    // });

    // console.log("Matched Transcripts:", matchedTranscripts);

    return educationTracks
  }

  async getMyAcademicCareer({
    auth,
  }: TemplateApiModuleActionProps): Promise<Transcripts> {
    const result = await this.universityOfIcelandService.studentInfo(auth)

    if (!result) {
      throw new TemplateApiError(
        {
          title: errorMsg.emptyCareerResponseTitle,
          summary: errorMsg.emptyCareerResponseMessage,
        },
        400,
      )
    }

    return result
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<UtbuaStarfsleyfiSkjalResponse> {
    // TODO Change to custom type with base64 + .. ?

    const { paymentUrl } = application.externalData.createCharge.data as {
      paymentUrl: string
    }
    if (!paymentUrl) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    const isPayment: { fulfilled: boolean } | undefined =
      await this.sharedTemplateAPIService.getPaymentStatus(auth, application.id)

    if (!isPayment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    const answers = application.answers as HealthcareWorkPermitAnswers

    const nationalRegistryData = application.externalData.nationalRegistry
      ?.data as NationalRegistryIndividual

    return await this.healthDirectorateClientService.submitApplicationHealthcareWorkPermit(
      auth,
      {
        name: nationalRegistryData.fullName,
        dateOfBirth: nationalRegistryData.birthDate,
        email: answers.userInformation?.email,
        phone: answers.userInformation?.phone, // TODO Is phone in correct format ?
        idProfession: answers.selectWorkPermit.studyProgram, // TODO Where can I get idProfession from
        citizenship: nationalRegistryData.citizenship?.code || '',
        education: [], // TODO
      },
    )
  }
}
