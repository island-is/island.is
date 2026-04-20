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
  PermitProgram,
  Message,
  error as errorMsg,
  information,
} from '@island.is/application/templates/healthcare-work-permit'
import {
  HealthDirectorateClientService,
  Nam,
  NamsUpplysingar,
  StarfsleyfiUmsoknStarfsleyfi,
  UtbuaStarfsleyfiSkjalResponse,
} from '@island.is/clients/health-directorate'
import { TemplateApiError } from '@island.is/nest/problem'
import {
  UniversityCareersClientService,
  UniversityId,
} from '@island.is/clients/university-careers'
import { InnaClientService } from '@island.is/clients/inna'
import {
  mapSecondarySchoolStudentTrack,
  mapUniversityStudentTracks,
  StudentGraduations,
} from './healthcare-Work-permit.utils'

const getFoundationProgram = (
  professionId: string,
  foundationPrograms: NamsUpplysingar[],
): NamsUpplysingar | undefined => {
  return foundationPrograms?.find(
    (foundationProgram) => foundationProgram.idProfession === professionId,
  )
}

const getCareerFoundationProgram = (
  foundationProgram: NamsUpplysingar,
  relevantCareerFoundationPrograms: StudentGraduations[],
): StudentGraduations | undefined => {
  return relevantCareerFoundationPrograms.find(
    (program) => program.programId === foundationProgram?.shortId,
  )
}

@Injectable()
export class HealthcareWorkPermitService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly healthDirectorateClientService: HealthDirectorateClientService,
    private readonly universityCareersClientService: UniversityCareersClientService,
    private readonly innaService: InnaClientService,
  ) {
    super(ApplicationTypes.HEALTHCARE_WORK_PERMIT)
  }

  /* Fetching this users healthcare licenses */
  async getMyHealthcareLicenses({
    auth,
  }: TemplateApiModuleActionProps): Promise<StarfsleyfiUmsoknStarfsleyfi[]> {
    const result =
      await this.healthDirectorateClientService.getHealthCareLicensesForWorkPermit(
        auth,
      )

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

  /* Processing and cross validating users graduated programs and healthcare licenses with education info from Landlæknir */
  async processPermits({
    auth,
  }: TemplateApiModuleActionProps): Promise<PermitProgram[]> {
    const [
      licenses,
      programs,
      careerProgramsUNAKRaw,
      careerProgramsHIRaw,
      innaDiplomas,
    ] = await Promise.all([
      this.healthDirectorateClientService.getHealthCareLicensesForWorkPermit(
        auth,
      ),
      this.healthDirectorateClientService.getHealthCareWorkPermitEducationInfo(
        auth,
      ),
      this.universityCareersClientService.getStudentTrackHistory(
        auth,
        UniversityId.UNIVERSITY_OF_AKUREYRI,
      ),
      this.universityCareersClientService.getStudentTrackHistory(
        auth,
        UniversityId.UNIVERSITY_OF_ICELAND,
      ),
      this.innaService.getDiplomas(auth),
    ])

    if (!programs) {
      throw new TemplateApiError(
        {
          title: errorMsg.noResponseEducationInfoTitle,
          summary: errorMsg.noResponseEducationInfoMessage,
        },
        400,
      )
    }
    if (licenses === undefined || licenses === null) {
      throw new TemplateApiError(
        {
          title: errorMsg.healthcareLicenseErrorTitle,
          summary: errorMsg.healthcareLicenseErrorMessage,
        },
        400,
      )
    }

    const secondarySchoolCareerPrograms =
      mapSecondarySchoolStudentTrack(innaDiplomas)
    const careerProgramsHI = mapUniversityStudentTracks(careerProgramsHIRaw)
    const careerProgramsUNAK = mapUniversityStudentTracks(careerProgramsUNAKRaw)
    const careerPrograms = (careerProgramsHI ?? [])
      .concat(careerProgramsUNAK ?? [])
      .concat(secondarySchoolCareerPrograms ?? [])

    if (!careerPrograms || careerPrograms?.length < 1) {
      throw new TemplateApiError(
        {
          title: errorMsg.emptyCareerResponseTitle,
          summary: errorMsg.emptyCareerResponseMessage,
        },
        400,
      )
    }

    // Programs that give licenses to practice (permits)
    const permitValidPrograms = programs?.filter((program) => {
      return (
        (program.dataOrder === 1 && program.noOfData === 1) ||
        (program.dataOrder === 2 && program.noOfData === 2)
      )
    })

    // Programs that serve as Foundation for certain licenses (Nursing for Midwife f.x)
    const foundationPrograms = programs?.filter((program) => {
      return program.dataOrder === 1 && program.noOfData === 2
    })

    // Splitting up programs from Embætti Landlæknis into those that give permits and those that serve as foundation
    // for other permits. For easy lookup
    const validPermitIds = new Set(
      permitValidPrograms?.map((item) => item.shortId),
    )
    const validFoundationProgramIds = new Set(
      foundationPrograms?.map((item) => item.shortId),
    )

    // Programs user has graduated that are viable for work permit
    const relevantCareerPermitPrograms = careerPrograms?.filter((program) =>
      validPermitIds.has(program.programId),
    )
    // Programs user has graduated that are needed as foundation for certain work permit (Nursing for Midwife f.x)
    const relevantCareerFoundationPrograms = careerPrograms?.filter((program) =>
      validFoundationProgramIds.has(program.programId),
    )

    const programsToBeDisplayed =
      relevantCareerPermitPrograms?.map((program) => {
        const { programId, studyProgram, graduationDate, schoolName } = program

        // Find the education program for this career program
        const currentPermitProgram = permitValidPrograms?.find(
          (permitProgram) => {
            if (permitProgram.shortId === program.programId) {
              return true
            }
            return false
          },
        )
        const currentPermitProgramProfessionId =
          currentPermitProgram?.idProfession || ''
        const base = {
          name: studyProgram,
          programId,
          professionId: currentPermitProgramProfessionId,
          error: true,
          mainProgram: {
            educationId: currentPermitProgram?.educationId,
            school: schoolName,
            graduationDate,
          },
        }
        // Checking if user already has a license with the same professionId
        const license = licenses?.find(
          (item) => item.idProfession === currentPermitProgramProfessionId,
        )
        if (license) {
          return {
            ...base,
            errorMsg:
              information.labels.selectWorkPermit.restrictionAlreadyHasLicense,
          }
        }

        if (currentPermitProgram?.noOfData === 2) {
          // If noOfData equals 2, means that this graduated program requires a specific foundation/prereq
          const currentFoundationProgram = getFoundationProgram(
            currentPermitProgramProfessionId,
            foundationPrograms || [],
          )
          const currentFoundationCareerProgram = getCareerFoundationProgram(
            currentFoundationProgram || {},
            relevantCareerFoundationPrograms || [],
          )

          const baseWithFoundationProgram = {
            ...base,
            foundationProgram: {
              educationId: currentFoundationProgram?.educationId,
              school: currentFoundationCareerProgram?.schoolName,
              graduationDate: currentFoundationCareerProgram?.graduationDate,
            },
          }

          if (!currentFoundationCareerProgram) {
            return {
              ...baseWithFoundationProgram,
              errorMsg:
                information.labels.selectWorkPermit
                  .restrictionFoundationMissing,
            }
          }

          const graduationDate = currentFoundationCareerProgram?.graduationDate
          const educationValidFrom =
            currentFoundationProgram?.educationValidFrom

          if (!graduationDate || !educationValidFrom) {
            return {
              ...baseWithFoundationProgram,
              errorMsg:
                information.labels.selectWorkPermit.restrictionDataError,
            }
          } else {
            if (graduationDate < new Date(educationValidFrom)) {
              return {
                ...baseWithFoundationProgram,
                errorMsg:
                  information.labels.selectWorkPermit.restrictionFoundationDate,
              }
            }
          }
        }
        let error = true
        let errorMsg: string | Message = ''
        // This program gives permit on its own.
        if (!graduationDate || !currentPermitProgram?.educationValidFrom) {
          error = true
          errorMsg = information.labels.selectWorkPermit.restrictionDataError
        } else {
          const validDate =
            graduationDate > new Date(currentPermitProgram?.educationValidFrom)
          if (validDate) {
            error = false
            errorMsg = ''
          } else {
            error = true
            errorMsg =
              information.labels.selectWorkPermit.restrictionGraduationDate
          }
        }

        return {
          ...base,
          error,
          errorMsg,
        }
      }) || []

    if (programsToBeDisplayed.length === 0) {
      throw new TemplateApiError(
        {
          title: errorMsg.noPermitValidGraduationFoundTitle,
          summary: errorMsg.noPermitValidGraduationFoundMessage,
        },
        400,
      )
    }

    const hasNoError = programsToBeDisplayed.some(
      (program) => program.error === false,
    )

    if (!hasNoError) {
      throw new TemplateApiError(
        {
          title: errorMsg.noPermitValidForSelfServiceTitle,
          summary: errorMsg.noPermitValidForSelfServiceMessage,
        },
        400,
      )
    }

    return programsToBeDisplayed.sort(
      (a, b) => Number(a.error) - Number(b.error),
    )
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<UtbuaStarfsleyfiSkjalResponse[]> {
    const { paymentUrl } = application.externalData.createCharge.data as {
      paymentUrl: string
    }
    if (!paymentUrl) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    const isPayment: { fulfilled: boolean } | undefined =
      await this.sharedTemplateAPIService.getPaymentStatus(application.id)

    if (!isPayment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    const answers = application.answers as HealthcareWorkPermitAnswers

    const nationalRegistryData = application.externalData.nationalRegistry
      ?.data as NationalRegistryIndividual
    if (!nationalRegistryData) {
      throw new Error('National registry data is missing.')
    }

    const permitPrograms = application.externalData.permitOptions
      ?.data as PermitProgram[]
    if (!permitPrograms) {
      throw new Error('Permit programs data is missing.')
    }

    const chosenProgram = permitPrograms.find(
      (program) => program.programId === answers.selectWorkPermit.programId,
    )
    if (!chosenProgram || !chosenProgram.professionId) {
      throw new Error('Chosen program not found.')
    }

    const { fullName, citizenship, birthDate } = nationalRegistryData
    if (!fullName || !birthDate || !citizenship?.code) {
      throw new Error('Incomplete national registry data.')
    }

    const { email, phone } = answers.userInformation
    if (!email || !phone) {
      throw new Error('User information is incomplete.')
    }

    const educations: Nam[] = []
    if (chosenProgram.mainProgram) {
      if (chosenProgram.mainProgram.graduationDate)
        chosenProgram.mainProgram.graduationDate = new Date(
          chosenProgram.mainProgram.graduationDate,
        )
      educations.push(chosenProgram.mainProgram)
    }
    if (chosenProgram.foundationProgram) {
      if (chosenProgram.foundationProgram.graduationDate)
        chosenProgram.foundationProgram.graduationDate = new Date(
          chosenProgram.foundationProgram.graduationDate,
        )
      educations.push(chosenProgram.foundationProgram)
    }

    const response =
      await this.healthDirectorateClientService.submitApplicationHealthcareWorkPermit(
        auth,
        {
          name: fullName,
          dateOfBirth: birthDate,
          email: email,
          phone: phone,
          idProfession: chosenProgram.professionId,
          citizenship: citizenship.code,
          education: educations,
        },
      )

    if (!response) {
      throw Error(
        'Health Directorate did not respond with a PDF license and/or PDF license number',
      )
    }

    return response
  }
}
