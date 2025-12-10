import {
  DegreeType,
  FieldType,
  IProgram,
  ModeOfDelivery,
  Season,
  mapStringToEnum,
  EnumError,
  IProgramExtraApplicationField,
} from '@island.is/university-gateway'
import {
  InlineResponse2002,
  InlineResponse2002Data,
  InlineResponse2002ExtraApplicationFields,
} from '../../../gen/fetch'
import { logger } from '@island.is/logging'

export const mapUglaPrograms = (
  res: InlineResponse2002,
  universityName: string,
): IProgram[] => {
  const mappedRes = []
  const programList = res.data || []
  for (let i = 0; i < programList.length; i++) {
    const program = programList[i]
    try {
      mappedRes.push({
        externalId: program.externalId || '',
        nameIs: program.nameIs || '',
        nameEn: program.nameEn || '',
        departmentNameIs: program.departmentNameIs || '',
        departmentNameEn: program.departmentNameEn || '',
        startingSemesterYear: Number(program.startingSemesterYear) || 0,
        startingSemesterSeason: mapStringToEnum(
          program.startingSemesterSeason,
          Season,
          'Season',
        ),
        applicationStartDate: program.applicationStartDate ?? null,
        applicationEndDate: program.applicationEndDate ?? null,
        schoolAnswerDate: undefined, //TODO missing in api
        studentAnswerDate: undefined, //TODO missing in api
        degreeType: mapStringToEnum(
          program.degreeType,
          DegreeType,
          'DegreeType',
        ),
        degreeAbbreviation: program.degreeAbbreviation || '',
        credits: program.credits || 0,
        descriptionIs: program.descriptionIs || '',
        descriptionEn: program.descriptionEn || '',
        durationInYears: program.durationInYears || 0,
        costPerYear: program.costPerYear,
        iscedCode: program.iscedCode || '',
        externalUrlIs: program.externalUrlIs,
        externalUrlEn: program.externalUrlEn,
        admissionRequirementsIs: program.admissionRequirementsIs,
        admissionRequirementsEn: program.admissionRequirementsEn,
        studyRequirementsIs: program.studyRequirementsIs,
        studyRequirementsEn: program.studyRequirementsEn,
        costInformationIs: program.costInformationIs,
        costInformationEn: program.costInformationEn,
        arrangementIs: undefined, //TODO missing in api
        arrangementEn: undefined, //TODO missing in api
        allowException: program.extraApplicationSettings?.bannaUndanthagur
          ? program.extraApplicationSettings?.bannaUndanthagur !== 't'
          : true,
        allowThirdLevelQualification: program.extraApplicationSettings
          ?.thridjaStigsnamLeyft
          ? program.extraApplicationSettings?.thridjaStigsnamLeyft === 't'
          : false,
        modeOfDelivery:
          program.modeOfDelivery?.map((m) => {
            return mapStringToEnum(m, ModeOfDelivery, 'ModeOfDelivery')
          }) || [],
        extraApplicationFields: mapExtraApplicationFields(program),
        specializations: program.kjorsvid?.map((k) => ({
          externalId: k.id?.toString() || '',
          nameIs: k.heiti || '',
          nameEn: k.heitiEn || '',
        })),
        applicationPeriodOpen: mapApplicationPeriodOpen(program),
        applicationInUniversityGateway:
          program.canApplyOnHaskolanam !== undefined &&
          program.canApplyOnHaskolanam !== null
            ? program.canApplyOnHaskolanam
            : true,
      })
    } catch (e) {
      if (e instanceof EnumError) {
        logger.warn(
          `EnumError when trying to map program with externalId ${program.externalId} for university ${universityName}, update skipped.`,
          e,
        )
      } else {
        logger.error(
          `Failed to map program with externalId ${program.externalId} for university ${universityName}, reason:`,
          e,
        )
      }
    }
  }

  return mappedRes
}

const mapApplicationPeriodOpen = (program: InlineResponse2002Data): boolean => {
  if (!program.applicationStartDate || !program.applicationEndDate) return false
  return (
    new Date() > program.applicationStartDate &&
    new Date() < program.applicationEndDate
  )
}

const mapExtraApplicationFields = (
  program: InlineResponse2002Data,
): IProgram['extraApplicationFields'] => {
  const fields =
    program.extraApplicationFields?.map((field) => {
      return {
        externalKey: field.fieldKey || '',
        nameIs: field.nameIs || '',
        nameEn: field.nameEn || '',
        descriptionIs: field.descriptionIs,
        descriptionEn: field.descriptionEn,
        required: field.required || false,
        fieldType: mapStringToEnum(field.fieldType, FieldType, 'FieldType'),
        uploadAcceptedFileType: field.uploadAcceptedFileType,
        options: mapOptions(program, field),
      } as IProgramExtraApplicationField
    }) || []

  if (program.mustPickExamVenue) {
    fields.push({
      externalKey: '', // TODO missing in the api
      nameIs: 'Prófstaður',
      nameEn: 'Exam venue',
      required: true,
      descriptionIs: undefined,
      descriptionEn: undefined,
      fieldType: FieldType.TESTING_SITE,
      uploadAcceptedFileType: undefined,
      options: JSON.stringify(program?.simenntunarstodvar) ?? undefined,
    })
  }

  return fields
}

const mapOptions = (
  program: InlineResponse2002Data,
  field: InlineResponse2002ExtraApplicationFields,
): string | undefined => {
  const type = field.fieldType as FieldType
  // More fields can be added here
  switch (type) {
    case FieldType.TESTING_SITE:
      return JSON.stringify(program?.simenntunarstodvar) ?? undefined
    default:
      return undefined
  }
}
