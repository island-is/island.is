import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Tag } from './model/tag'
import { ProgramTable } from './model/program'
import { ProgramTag } from './model/programTag'
import { ProgramModeOfDelivery } from './model/programModeOfDelivery'
import { ProgramExtraApplicationField } from './model/programExtraApplicationField'
import { University } from '../university'
import { ReykjavikUniversityApplicationClient } from '@island.is/clients/university-application/reykjavik-university'
import { UniversityOfIcelandApplicationClient } from '@island.is/clients/university-application/university-of-iceland'
import { IProgram, UniversityNationalIds } from '@island.is/university-gateway'
import { logger } from '@island.is/logging'

@Injectable()
export class InternalProgramService {
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
  ) {}

  async updatePrograms(): Promise<void> {
    Promise.allSettled([
      await this.doUpdateProgramsForUniversity(
        UniversityNationalIds.REYKJAVIK_UNIVERSITY,
        await this.reykjavikUniversityClient.getPrograms(),
      ),
      // await this.doUpdateProgramsForUniversity(
      //   UniversityNationalIds.UNIVERSITY_OF_ICELAND,
      //   await this.universityOfIcelandClient.getPrograms(),
      // ),
    ]).catch((e) => {
      logger.error('Failed to update programs, reason:', e)
    })
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
      throw new Error('University not found in DB')
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
              externalId: extraApplicationFieldList[j].externalId,
              nameIs: extraApplicationFieldList[j].nameIs,
              nameEn: extraApplicationFieldList[j].nameEn,
              descriptionIs: extraApplicationFieldList[j].descriptionIs,
              descriptionEn: extraApplicationFieldList[j].descriptionEn,
              required: extraApplicationFieldList[j].required,
              fieldType: extraApplicationFieldList[j].fieldType,
              uploadAcceptedFileType:
                extraApplicationFieldList[j].uploadAcceptedFileType,
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
