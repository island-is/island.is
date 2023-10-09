import { Injectable } from '@nestjs/common'
import {
  ProgramExtraApplicationField,
  ProgramMinor,
  ProgramModeOfDelivery,
  ProgramTable,
  ProgramTag,
  Tag,
} from './model'
import { InjectModel } from '@nestjs/sequelize'
import { University } from '../university/model'
import { ReykjavikUniversityApplicationClient } from '@island.is/clients/university-application/reykjavik-university'
import { UniversityOfIcelandApplicationClient } from '@island.is/clients/university-application/university-of-iceland'
import {
  IProgram,
  UniversityNationalIds,
} from '@island.is/university-gateway-lib'
import { logger } from '@island.is/logging'

export
@Injectable()
class InternalProgramService {
  constructor(
    private readonly reykjavikUniversityClient: ReykjavikUniversityApplicationClient,

    private readonly universityOfIcelandClient: UniversityOfIcelandApplicationClient,

    @InjectModel(University)
    private universityModel: typeof University,

    @InjectModel(Tag)
    private tagModel: typeof Tag,

    @InjectModel(ProgramTable)
    private programModel: typeof ProgramTable,

    @InjectModel(ProgramTag)
    private programTagModel: typeof ProgramTag,

    @InjectModel(ProgramModeOfDelivery)
    private programModeOfDeliveryModel: typeof ProgramModeOfDelivery,

    @InjectModel(ProgramExtraApplicationField)
    private programExtraApplicationFieldModel: typeof ProgramExtraApplicationField,

    @InjectModel(ProgramMinor)
    private programMinorModel: typeof ProgramMinor,
  ) {}

  async updatePrograms(): Promise<void> {
    try {
      logger.info('Updating programs for Reykjavik University')
      await this.doUpdateProgramsForUniversity(
        UniversityNationalIds.REYKJAVIK_UNIVERSITY,
        await this.reykjavikUniversityClient.getPrograms(),
      )
    } catch (e) {
      logger.error(
        'Failed to update programs for Reykjavik University, reason:',
        e,
      )
    }

    // TODO need to perform for all Uglu universities
    try {
      logger.info('Updating programs for University of Iceland')
      await this.doUpdateProgramsForUniversity(
        UniversityNationalIds.UNIVERSITY_OF_ICELAND,
        await this.universityOfIcelandClient.getPrograms(),
      )
    } catch (e) {
      logger.error(
        'Failed to update programs for University of Iceland, reason:',
        e,
      )
    }
  }

  private async doUpdateProgramsForUniversity(
    universityNationalId: string,
    programList: IProgram[],
  ): Promise<void> {
    const universityId = (
      await this.universityModel.findOne({
        attributes: ['id'],
        where: { nationalId: universityNationalId },
        logging: false,
      })
    )?.id

    if (!universityId) {
      throw new Error(
        `University with national id ${universityNationalId} not found in DB`,
      )
    }

    // UPDATE all programs for this university and make them inactive
    await this.programModel.update(
      {
        active: false,
      },
      {
        where: { universityId },
        logging: false,
      },
    )

    // CREATE/UPDATE all programs for this university (make then active again)
    for (let i = 0; i < programList.length; i++) {
      const program = programList[i]
      try {
        // Map to programModel object
        const programObj = {
          active: true,
          universityId: universityId,
          externalId: program.externalId,
          nameIs: program.nameIs,
          nameEn: program.nameEn,
          departmentNameIs: program.departmentNameIs,
          departmentNameEn: program.departmentNameEn,
          startingSemesterYear: program.startingSemesterYear,
          startingSemesterSeason: program.startingSemesterSeason,
          applicationStartDate: program.applicationStartDate,
          applicationEndDate: program.applicationEndDate,
          schoolAnswerDate: program.schoolAnswerDate,
          studentAnswerDate: program.studentAnswerDate,
          degreeType: program.degreeType,
          degreeAbbreviation: program.degreeAbbreviation,
          credits: program.credits,
          descriptionIs: program.descriptionIs,
          descriptionEn: program.descriptionEn,
          durationInYears: program.durationInYears,
          costPerYear: program.costPerYear,
          iscedCode: program.iscedCode,
          externalUrlIs: program.externalUrlIs,
          externalUrlEn: program.externalUrlEn,
          languages: program.languages,
          searchKeywords: program.searchKeywords,
          admissionRequirementsIs: program.admissionRequirementsIs,
          admissionRequirementsEn: program.admissionRequirementsEn,
          studyRequirementsIs: program.studyRequirementsIs,
          studyRequirementsEn: program.studyRequirementsEn,
          costInformationIs: program.costInformationIs,
          costInformationEn: program.costInformationEn,
        }

        const tagList = program.tag || []
        const modeOfDeliveryList = program.modeOfDelivery || []
        const extraApplicationFieldList = program.extraApplicationFields || []
        const minorList = program.minors || []

        const oldProgramObj = await this.programModel.findOne({
          attributes: ['id'],
          where: {
            externalId: programObj.externalId,
          },
          logging: false,
        })

        // CREATE or UPDATE program
        let programId: string | undefined
        if (oldProgramObj) {
          programId = oldProgramObj.id
          await this.programModel.update(programObj, {
            where: { id: programId },
            logging: false,
          })
        } else {
          programId = (
            await this.programModel.create(programObj, { logging: false })
          ).id
        }

        // DELETE program tag
        await this.programTagModel.destroy({
          where: { programId: programId },
          logging: false,
        })

        // CREATE program tag
        for (let j = 0; j < tagList.length; j++) {
          const tag = await this.tagModel.findOne({
            attributes: ['id'],
            where: { code: tagList[j].code },
            logging: false,
          })

          if (!tag) continue

          await this.programTagModel.create(
            {
              programId: programId,
              tagId: tag?.id,
            },
            { logging: false },
          )
        }

        // DELETE program mode of delivery
        await this.programModeOfDeliveryModel.destroy({
          where: { programId: programId },
          logging: false,
        })

        // CREATE program mode of delivery
        for (let j = 0; j < modeOfDeliveryList.length; j++) {
          await this.programModeOfDeliveryModel.create(
            {
              programId: programId,
              modeOfDelivery: modeOfDeliveryList[j],
            },
            { logging: false },
          )
        }

        // DELETE program extra application field
        await this.programExtraApplicationFieldModel.destroy({
          where: { programId: programId },
          logging: false,
        })

        // CREATE program extra application field
        for (let j = 0; j < extraApplicationFieldList.length; j++) {
          await this.programExtraApplicationFieldModel.create(
            {
              programId: programId,
              nameIs: extraApplicationFieldList[j].nameIs,
              nameEn: extraApplicationFieldList[j].nameEn,
              descriptionIs: extraApplicationFieldList[j].descriptionIs,
              descriptionEn: extraApplicationFieldList[j].descriptionEn,
              required: extraApplicationFieldList[j].required,
              fieldKey: extraApplicationFieldList[j].fieldKey,
              fieldType: extraApplicationFieldList[j].fieldType,
              uploadAcceptedFileType:
                extraApplicationFieldList[j].uploadAcceptedFileType,
            },
            { logging: false },
          )
        }

        // DELETE program minor
        await this.programMinorModel.destroy({
          where: { programId: programId },
          logging: false,
        })

        // CREATE program minor
        for (let j = 0; j < minorList.length; j++) {
          await this.programMinorModel.create(
            {
              programId: programId,
              externalId: minorList[j].externalId,
              nameIs: minorList[j].nameIs,
              nameEn: minorList[j].nameEn,
            },
            { logging: false },
          )
        }
      } catch (e) {
        logger.error(
          `Failed to update program with externalId ${program.externalId}, reason:`,
          e,
        )
      }
    }
  }
}
