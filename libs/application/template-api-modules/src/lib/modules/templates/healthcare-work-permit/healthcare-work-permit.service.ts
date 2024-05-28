import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import {
  ApplicationTypes,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import {
  EES,
  HealthcareWorkPermitAnswers,
  error as errorMsg,
  information,
} from '@island.is/application/templates/healthcare-work-permit'
import {
  HealthDirectorateClientService,
  NamsUpplysingar,
  StarfsleyfiUmsoknStarfsleyfi,
  UtbuaStarfsleyfiSkjalResponse,
} from '@island.is/clients/health-directorate'
import { TemplateApiError } from '@island.is/nest/problem'
import {
  StudentTrackDto,
  StudentTrackInstitutionDto,
  UniversityCareersClientService,
  UniversityId,
} from '@island.is/clients/university-careers'
import {
  EinstaklingurDTOFaeding,
  EinstaklingurDTOHeimili,
  EinstaklingurDTONafnAllt,
  EinstaklingurDTORikisfang,
  NationalRegistryV3ClientService,
} from '@island.is/clients/national-registry-v3'

const isCitizenOfEES = (alpha2Code: string) => {
  return EES.some((country) => country.alpha2Code === alpha2Code)
}

interface Message {
  id: string
  defaultMessage: string
  description: string
}

export interface EinstaklingurDTO {
  kennitala?: string | null
  nafn?: string | null
  heimilisfang?: EinstaklingurDTOHeimili
  rikisfang?: EinstaklingurDTORikisfang
  faedingarstadur?: EinstaklingurDTOFaeding
  fulltNafn?: EinstaklingurDTONafnAllt
}

interface PermitProgram {
  name?: string
  programId?: string
  institution?: StudentTrackInstitutionDto
  error?: boolean
  errorMsg?: Message | string
  professionId?: string
  prereq?: StudentTrackDto // TODO Probably don't need this
}

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
  relevantCareerFoundationPrograms: StudentTrackDto[],
): StudentTrackDto | undefined => {
  return relevantCareerFoundationPrograms.find(
    (obj) => obj.programId === foundationProgram?.shortId,
  )
}

@Injectable()
export class HealthcareWorkPermitService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly healthDirectorateClientService: HealthDirectorateClientService,
    private readonly universityCareersClientService: UniversityCareersClientService,
    private readonly nationalRegistryService: NationalRegistryV3ClientService,
  ) {
    super(ApplicationTypes.HEALTHCARE_WORK_PERMIT)
  }

  async getNationalRegistryWithEESValidation({
    auth,
  }: TemplateApiModuleActionProps): Promise<EinstaklingurDTO> {
    const result = await this.nationalRegistryService.getAllDataIndividual(
      auth.nationalId,
    )

    if (!result) {
      throw new TemplateApiError(
        {
          title: errorMsg.nationalRegistryFetchErrorTitle,
          summary: errorMsg.nationalRegistryFetchErrorMessage,
        },
        400,
      )
    }

    const hasEESCitizenship = isCitizenOfEES(
      result?.rikisfang?.rikisfangKodi || '',
    )

    if (!hasEESCitizenship) {
      throw new TemplateApiError(
        {
          title: errorMsg.nationalRegistryOutsideEESErrorTitle,
          summary: errorMsg.nationalRegistryOutsideEESErrorMessage,
        },

        400,
      )
    }

    const {
      fulltNafn,
      heimilisfang,
      rikisfang,
      kennitala,
      nafn,
      faedingarstadur,
    } = result
    return {
      fulltNafn,
      heimilisfang,
      rikisfang,
      kennitala,
      nafn,
      faedingarstadur,
    }
  }

  /* Which health care licenses does this user already have */
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

  /* Info on different education programs that give work permit licenses */
  async getEducationInfo({
    auth,
  }: TemplateApiModuleActionProps): Promise<NamsUpplysingar[]> {
    const result =
      await this.healthDirectorateClientService.getHealthCareWorkPermitEducationInfo(
        auth,
      )

    if (!result) {
      throw new TemplateApiError(
        {
          title: errorMsg.noResponseEducationInfoTitle,
          summary: errorMsg.noResponseEducationInfoMessage,
        },
        400,
      )
    }

    return result
  }

  /* The academic career of the logged in uses. Used to find which programmes are valid for work permit */
  async getMyAcademicCareer({
    auth,
  }: TemplateApiModuleActionProps): Promise<StudentTrackDto[]> {
    const result =
      await this.universityCareersClientService.getStudentTrackHistory(
        auth,
        UniversityId.UNIVERSITY_OF_ICELAND,
      )

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

  async processPermits({
    auth,
  }: TemplateApiModuleActionProps): Promise<PermitProgram[]> {
    const [licenses, programs, careerPrograms] = await Promise.all([
      this.healthDirectorateClientService.getHealthCareLicensesForWorkPermit(
        auth,
      ),
      this.healthDirectorateClientService.getHealthCareWorkPermitEducationInfo(
        auth,
      ),
      this.universityCareersClientService.getStudentTrackHistory(
        auth,
        UniversityId.UNIVERSITY_OF_ICELAND,
      ),
    ])

    throw new TemplateApiError(
      {
        title: errorMsg.noResponseEducationInfoTitle,
        summary: errorMsg.noResponseEducationInfoMessage,
      },
      400,
    )
    if (!careerPrograms) {
      throw new TemplateApiError(
        {
          title: errorMsg.emptyCareerResponseTitle,
          summary: errorMsg.emptyCareerResponseMessage,
        },
        400,
      )
    }
    if (licenses === undefined) {
      throw new TemplateApiError(
        {
          title: errorMsg.healthcareLicenseErrorTitle,
          summary: errorMsg.healthcareLicenseErrorMessage,
        },
        400,
      )
    }

    const studentTrackDto = [
      {
        name: 'John Doe',
        nationalId: '1234567890',
        graduationDate: new Date('2024-01-15'),
        trackNumber: 3,
        institution: {},
        school: 'School of Science',
        faculty: 'Faculty of Mathematics',
        studyProgram: 'Sjúkraliði',
        degree: 'Bachelor of Science',
        programId: 'SJÚ441',
      },
      {
        name: 'John Doe',
        nationalId: '1234567890',
        graduationDate: new Date('2024-05-15'),
        trackNumber: 3,
        institution: {},
        school: 'School of Science',
        faculty: 'Faculty of Mathematics',
        studyProgram: 'Geislafræðingur',
        degree: 'Bachelor of Science',
        programId: 'GSL321',
      },
      {
        name: 'John Doe',
        nationalId: '1234567890',
        graduationDate: new Date('2024-05-15'),
        trackNumber: 3,
        institution: {},
        school: 'School of Science',
        faculty: 'Faculty of Mathematics',
        studyProgram: 'Hjúkrunafræðingur',
        degree: 'Bachelor of Science',
        programId: 'GSL260',
      },
      {
        name: 'John',
        nationalId: '1234567890',
        graduationDate: new Date('2024-05-15'),
        trackNumber: 3,
        institution: {},
        school: 'School of Science',
        faculty: 'Faculty of Mathematics',
        studyProgram: 'Ljósmóðir',
        degree: 'Bachelor of Science',
        programId: 'LJÓ443',
      },
    ] as StudentTrackDto[]

    // Programs that give licenses to practice (permits)
    const permitValidPrograms = programs?.filter((program) => {
      return (
        (program.dataOrder === 1 && program.noOfData === 1) ||
        (program.dataOrder === 2 && program.noOfData === 2)
      )
    })

    // Programs that serve as Foundation for certain licenses (Hjúkrunfræði fyrir Ljósmóðir t.d)
    const foundationPrograms = programs?.filter((program) => {
      return program.dataOrder === 1 && program.noOfData === 2
    })

    const validPermitIds = new Set(
      permitValidPrograms?.map((item) => item.shortId),
    )
    // Programs user has graduated that are viable for work permit
    const relevantCareerPermitPrograms = studentTrackDto?.filter((program) =>
      validPermitIds.has(program.programId),
    )
    const validFoundationProgramIds = new Set(
      foundationPrograms?.map((item) => item.shortId),
    )
    // Programs user has graduated that are needed as foundation for certain work permit (Nursing for Midwife f.x)
    const relevantCareerFoundationPrograms = studentTrackDto?.filter(
      (program) => validFoundationProgramIds.has(program.programId),
    )

    const programsToBeDisplayed =
      relevantCareerPermitPrograms?.map((program) => {
        const { programId, studyProgram, institution, graduationDate } = program
        let currentPermitProgramProfessionId = ''
        // Find the education program for this career program
        const currentPermitProgram = permitValidPrograms?.find(
          (permitProgram) => {
            if (permitProgram.shortId === program.programId) {
              currentPermitProgramProfessionId =
                permitProgram.idProfession || ''
              return true
            }
            return false
          },
        )

        // Checking if user already has a license with the same professionId
        const license = licenses?.find(
          (item) => item.idProfession === currentPermitProgramProfessionId,
        )
        if (license) {
          return {
            name: studyProgram,
            programId,
            institution,
            professionId: currentPermitProgramProfessionId,
            error: true,
            errorMsg:
              information.labels.selectWorkPermit.restrictionAlreadyHasLicense,
          }
        }

        if (currentPermitProgram?.noOfData === 2) {
          // Work permit requires some foundational program to qualify for work permit
          const currentFoundationProgram = getFoundationProgram(
            currentPermitProgramProfessionId,
            foundationPrograms || [],
          )
          const currentFoundationCareerProgram = getCareerFoundationProgram(
            currentFoundationProgram || {},
            relevantCareerFoundationPrograms || [],
          )

          if (!currentFoundationCareerProgram) {
            return {
              name: studyProgram,
              programId,
              institution,
              professionId: currentPermitProgramProfessionId,
              error: true,
              errorMsg:
                information.labels.selectWorkPermit
                  .restrictionFoundationMissing,
            }
          }
          if (
            !currentFoundationCareerProgram?.graduationDate ||
            !currentFoundationProgram?.educationValidFrom
          ) {
            return {
              name: studyProgram,
              programId,
              institution,
              professionId: currentPermitProgramProfessionId,
              error: true,
              errorMsg:
                information.labels.selectWorkPermit.restrictionDataError,
            }
          } else {
            if (
              currentFoundationCareerProgram?.graduationDate <
              new Date(currentFoundationProgram?.educationValidFrom)
            ) {
              return {
                name: studyProgram,
                programId,
                institution,
                professionId: currentPermitProgramProfessionId,
                error: true,
                errorMsg:
                  information.labels.selectWorkPermit.restrictionDataError,
              }
            }
          }
        }
        let error = true
        let errorMsg: string | Message = ''
        // This program give permit on its own.
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
          name: studyProgram,
          programId,
          institution,
          professionId: currentPermitProgramProfessionId,
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

    return programsToBeDisplayed
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
