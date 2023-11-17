import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Tag } from './model/tag'
import { Program } from './model/program'
import { ProgramTag } from './model/programTag'
import { ProgramModeOfDelivery } from './model/programModeOfDelivery'
import { ProgramExtraApplicationField } from './model/programExtraApplicationField'
import { University } from '../university/model/university'
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

    @InjectModel(Program)
    private programModel: typeof Program,

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
        () => this.reykjavikUniversityClient.getPrograms(),
      ),
      await this.doUpdateProgramsForUniversity(
        UniversityNationalIds.UNIVERSITY_OF_ICELAND,
        () => this.universityOfIcelandClient.getPrograms(),
      ),
    ]).catch((e) => {
      logger.error('Failed to update programs, reason:', e)
    })
  }

  private async doUpdateProgramsForUniversity(
    universityNationalId: string,
    getPrograms: () => Promise<IProgram[]>,
  ): Promise<void> {
    const universityId = (
      await this.universityModel.findOne({
        attributes: ['id'],
        where: { nationalId: universityNationalId },
      })
    )?.id

    if (!universityId) {
      throw new Error(
        `University with national id ${universityNationalId} not found in DB`,
      )
    }

    logger.info(
      `Started updating programs for university ${universityNationalId}`,
    )

    const programList = await getPrograms()

    // 1. Mark all programs as "temporarily inactive", so we know in the end which programs
    // should actually be inactive (hidden)
    // This is done to make sure not all programs for the university are marked as
    // inactive (hidden) while we are updating the list of programs
    await this.programModel.update(
      {
        tmpActive: false,
      },
      {
        where: { universityId },
      },
    )

    // CREATE/UPDATE all programs for this university (make then active again)
    for (let i = 0; i < programList.length; i++) {
      const program = programList[i]
      const specializationList = program.specializations || []

      // Added Math.max to make sure we enter the loop at least once (once for programs with no specialization)
      const specializationListLength = Math.max(specializationList.length, 1)

      for (let j = 0; j < specializationListLength; j++) {
        const specialization = specializationList[j]

        try {
          // Map to programModel object
          const programObj = {
            ...program,
            active: true,
            tmpActive: true,
            specializationExternalId: specialization?.externalId,
            specializationNameIs: specialization?.nameIs,
            specializationNameEn: specialization?.nameEn,
            universityId,
          }

          const tagList = program.tag || []
          const modeOfDeliveryList = program.modeOfDelivery || []
          const extraApplicationFieldList = program.extraApplicationFields || []

          const programWhere: {
            externalId: string
            specializationExternalId?: string
          } = { externalId: programObj.externalId }
          if (specialization?.externalId) {
            programWhere.specializationExternalId = specialization.externalId
          }

          // 2. UPSERT program (make sure tmpActive becomes true)
          const oldProgramObj = await this.programModel.findOne({
            attributes: ['id'],
            where: programWhere,
          })
          const [{ id: programId }] = await this.programModel.upsert({
            ...programObj,
            id: oldProgramObj?.id,
          })

          // 3a. DELETE program tag
          await this.programTagModel.destroy({
            where: { programId: programId },
          })

          // 3b. CREATE program tag
          for (let k = 0; k < tagList.length; k++) {
            const tag = await this.tagModel.findOne({
              attributes: ['id'],
              where: { code: tagList[k].code },
            })

            if (!tag) continue

            await this.programTagModel.create({
              programId: programId,
              tagId: tag?.id,
            })
          }

          // 4a. DELETE program mode of delivery
          await this.programModeOfDeliveryModel.destroy({
            where: { programId: programId },
          })

          // 4b. CREATE program mode of delivery
          for (let k = 0; k < modeOfDeliveryList.length; k++) {
            await this.programModeOfDeliveryModel.create({
              programId: programId,
              modeOfDelivery: modeOfDeliveryList[k],
            })
          }

          // 5a. DELETE program extra application field
          await this.programExtraApplicationFieldModel.destroy({
            where: { programId: programId },
          })

          // 5b. CREATE program extra application field
          for (let k = 0; k < extraApplicationFieldList.length; k++) {
            await this.programExtraApplicationFieldModel.create({
              programId: programId,
              externalId: extraApplicationFieldList[k].externalId,
              nameIs: extraApplicationFieldList[k].nameIs,
              nameEn: extraApplicationFieldList[k].nameEn,
              descriptionIs: extraApplicationFieldList[k].descriptionIs,
              descriptionEn: extraApplicationFieldList[k].descriptionEn,
              required: extraApplicationFieldList[k].required,
              fieldType: extraApplicationFieldList[k].fieldType,
              uploadAcceptedFileType:
                extraApplicationFieldList[k].uploadAcceptedFileType,
            })
          }
        } catch (e) {
          logger.error(
            `Failed to update program with externalId ${program.externalId} and specializationExternalId ${specializationList[j]?.externalId}, reason:`,
            e,
          )
        }
      }
    }

    // 6. UPDATE all programs for this university and make them inactive
    await this.programModel.update(
      {
        active: false,
      },
      {
        where: { universityId, tmpActive: false },
      },
    )

    logger.info(
      `Finished updating programs for university ${universityNationalId}`,
    )
  }
}
