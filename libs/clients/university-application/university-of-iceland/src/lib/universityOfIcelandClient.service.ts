import { Injectable, Req } from '@nestjs/common'
import { ExampleEndpointsForUniversitiesApi } from '../../gen/fetch/apis'
import {
  DegreeType,
  FieldType,
  ICourse,
  IProgram,
  ModeOfDelivery,
  Requirement,
  Season,
  mapEnumToEnum,
  mapEnumToOtherEnum,
} from '@island.is/university-gateway-lib'
import {
  ExampleProgramDegreeTypeEnum,
  ExampleProgramModeOfDeliveryEnum,
  ExampleProgramStartingSemesterSeasonEnum,
} from '../../gen/fetch'
import { logger } from '@island.is/logging'

export
@Injectable()
class UniversityOfIcelandApplicationClient {
  constructor(
    private readonly exampleEndpointsForUniversitiesApi: ExampleEndpointsForUniversitiesApi,
  ) {}

  async getPrograms(): Promise<IProgram[]> {
    const res =
      await this.exampleEndpointsForUniversitiesApi.exampleControllerGetActivePrograms()

    const mappedRes = []
    const programList = res.data || []
    for (let i = 0; i < programList.length; i++) {
      const program = programList[i]
      try {
        mappedRes.push({
          externalId: program.externalId,
          nameIs: program.nameIs,
          nameEn: program.nameEn,
          departmentNameIs: program.departmentNameIs,
          departmentNameEn: program.departmentNameEn,
          startingSemesterYear: program.startingSemesterYear,
          startingSemesterSeason: mapEnumToEnum(
            program.startingSemesterSeason,
            ExampleProgramStartingSemesterSeasonEnum,
            Season,
          ),
          applicationStartDate: program.applicationStartDate,
          applicationEndDate: program.applicationEndDate || new Date(),
          schoolAnswerDate: undefined, //TODO missing in api
          studentAnswerDate: undefined, //TODO missing in api
          degreeType: mapEnumToEnum(
            program.degreeType,
            ExampleProgramDegreeTypeEnum,
            DegreeType,
          ),
          degreeAbbreviation: program.degreeAbbreviation,
          credits: Number(program.credits) || 0, // TODO swagger says number, but api returns string
          descriptionIs: program.descriptionIs || '',
          descriptionEn: program.descriptionEn || '',
          durationInYears: program.durationInYears || 0,
          costPerYear: program.costPerYear,
          iscedCode: program.iscedCode || '',
          languages: [], //TODO missing in api
          searchKeywords: [], //TODO missing in api
          externalUrlIs: program.externalUrlIs,
          externalUrlEn: program.externalUrlEn,
          admissionRequirementsIs: program.admissionRequirementsIs,
          admissionRequirementsEn: program.admissionRequirementsEn,
          studyRequirementsIs: program.studyRequirementsIs,
          studyRequirementsEn: program.studyRequirementsEn,
          costInformationIs: program.costInformationIs,
          costInformationEn: program.costInformationEn,
          tag: program.interestTags.map((tag) => ({
            code: tag.toString(), //TODO change from enum to code (string) in api
          })),
          modeOfDelivery: program.modeOfDelivery.map((m) => {
            // TODO what value is this
            if (m.toString() === 'MIXED') {
              return ModeOfDelivery.OTHER
            } else {
              return mapEnumToOtherEnum(
                m,
                ExampleProgramModeOfDeliveryEnum,
                ModeOfDelivery,
              )
            }
          }),
          extraApplicationField: program.extraApplicationFields.map(
            (field) => ({
              nameIs: field.nameIs,
              nameEn: field.nameEn,
              descriptionIs: field.descriptionIs,
              descriptionEn: field.descriptionEn,
              required: field.required === 'true', //TODO change to boolean not string
              fieldType: field.fieldType as unknown as FieldType,
              uploadAcceptedFileType: field.uploadAcceptedFileType,
            }),
          ),
        })
      } catch (e) {
        logger.error(
          `Failed to map program with externalId ${program.externalId} (University of Iceland), reason:`,
          e,
        )
      }
    }

    return mappedRes
  }

  async getCourses(externalId: string): Promise<ICourse[]> {
    const res =
      await this.exampleEndpointsForUniversitiesApi.exampleControllerGetProgramsCourses(
        { externalId },
      )

    const mappedRes = []
    const courseList = res.data || []
    for (let i = 0; i < courseList.length; i++) {
      const course = courseList[i]
      try {
        let requirement: Requirement | undefined = undefined
        //TODO swagger says boolean, but api returns string
        switch (course.required) {
          case 'M':
            requirement = Requirement.MANDATORY
            break
          case 'O': // TODO what value is this
            requirement = Requirement.FREE_ELECTIVE
            break
          case '0': // TODO what value is this
            requirement = Requirement.FREE_ELECTIVE
            break
          case 'C': // TODO what value is this
            requirement = Requirement.FREE_ELECTIVE
            break
          case '': // TODO what value is this
            requirement = Requirement.FREE_ELECTIVE
            break
        }
        if (requirement === undefined) {
          throw new Error(`Not able to map requirement: ${course.required}`)
        }

        let semesterSeason: Season | undefined = undefined
        //TODO swagger says enum, but api returns string not in enum
        switch (course.semesterSeason.toString()) {
          case 'V':
            semesterSeason = Season.SPRING
            break
          case 'H':
            semesterSeason = Season.FALL
            break
          case 'S':
            semesterSeason = Season.SUMMER
            break
          case 'A': // TODO what value is this
            semesterSeason = Season.FALL
            break
          case '': // TODO what value is this
            semesterSeason = Season.FALL
            break
        }
        if (!semesterSeason) {
          throw new Error(
            `Not able to map semester season: ${course.semesterSeason.toString()}`,
          )
        }

        mappedRes.push({
          externalId: course.externalId,
          nameIs: course.nameIs,
          nameEn: course.nameEn,
          credits: Number(course.credits.toString().replace(',', '.')), //TODO swagger says number, but api returns string (e.g. '7,5')
          semesterYear: course.semesterYear,
          semesterSeason: semesterSeason,
          descriptionIs: course.descriptionIs,
          descriptionEn: course.descriptionEn,
          externalUrlIs: course.externalUrlIs,
          externalUrlEn: course.externalUrlEn,
          requirement: requirement,
        })
      } catch (e) {
        logger.error(
          `Failed to map course with externalId ${course.externalId} for program with externalId ${externalId} (University of Iceland), reason:`,
          e,
        )
      }
    }

    return mappedRes
  }
}
