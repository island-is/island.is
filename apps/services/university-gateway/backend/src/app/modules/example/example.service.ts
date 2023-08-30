import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { UgReykjavikUniversityClient } from '@island.is/clients/university-gateway/reykjavik-university'
import {
  Program,
  ProgramCourse,
  ProgramExtraApplicationField,
  ProgramModeOfDelivery,
  ProgramTag,
  Tag,
} from '../program/model'
import { University } from '../university/model'
import { DegreeType, FieldType, ModeOfDelivery, Season } from '../program/types'
import { Course } from '../course/model'
import { Requirement } from '../course/types'

@Injectable()
export class ExampleService {
  constructor(
    private readonly ugReykjavikUniversityClient: UgReykjavikUniversityClient,

    @InjectModel(University)
    private universityModel: typeof University,

    @InjectModel(Tag)
    private tagModel: typeof Tag,

    @InjectModel(Course)
    private courseModel: typeof Course,

    @InjectModel(Program)
    private programModel: typeof Program,

    @InjectModel(ProgramCourse)
    private programCourseModel: typeof ProgramCourse,

    @InjectModel(ProgramTag)
    private programTagModel: typeof ProgramTag,

    @InjectModel(ProgramModeOfDelivery)
    private programModeOfDeliveryModel: typeof ProgramModeOfDelivery,

    @InjectModel(ProgramExtraApplicationField)
    private programExtraApplicationFieldModel: typeof ProgramExtraApplicationField,
  ) {}

  async triggerWorker(): Promise<string> {
    await this.updatePrograms()
    await this.updateCourses()

    return 'Finished adding data to DB'
  }

  //TODOx move into worker
  private async updatePrograms() {
    var majors = await this.ugReykjavikUniversityClient.getMajors()

    const universityNationalId = '6001692039' //TODO
    const universityId = (
      await this.universityModel.findOne({
        where: { nationalId: universityNationalId },
      })
    )?.id

    for (let i = 0; i < 5; i++) {
      const departmentName =
        majors[i].departmentId &&
        (
          await this.ugReykjavikUniversityClient.getDepartment(
            majors[i].departmentId!,
          )
        )?.name

      let degreeType: DegreeType = DegreeType.UNDERGRADUATE
      switch (majors[i].majorTypeKey) {
        case 'grunnnám':
          degreeType = DegreeType.UNDERGRADUATE
        case 'meistaranám':
          degreeType = DegreeType.POSTGRADUATE
        case 'doktorsnám':
          degreeType = DegreeType.DOCTORAL
      }

      //TODO
      const tagList = [{ code: 'engineering' }, { code: 'science' }]

      //TODO
      const modeOfDeliveryList = [ModeOfDelivery.ONLINE, ModeOfDelivery.ON_SITE]

      //TODO
      const extraApplicationFieldList = [
        {
          nameIs: 'Ferilskrá',
          nameEn: 'CV',
          descriptionIs: '',
          descriptionEn: '',
          required: true,
          fieldType: FieldType.UPLOAD,
          uploadAcceptedFileType: '.pdf, .jpg, .jpeg, .png',
        },
      ]

      // UPDATE all programs for this university and make them inactive
      await this.programModel.update(
        {
          active: false,
        },
        {
          where: { universityId: universityId },
        },
      )

      // CREATE/UPDATE all programs for this university (make then active again)

      const programObj = {
        externalId: majors[i].id?.toString(), //TODO
        active: true,
        nameIs: majors[i].name,
        nameEn: majors[i].name, //TODO
        universityId: universityId,
        departmentNameIs: departmentName,
        departmentNameEn: departmentName, //TODO
        startingSemesterYear: 2023, //TODO
        startingSemesterSeason: Season.FALL, //TODO
        applicationStartDate: majors[i].courseRegistrationBegins,
        applicationEndDate: majors[i].courseRegistrationEnds,
        degreeType: degreeType,
        degreeAbbreviation: 'TODO',
        credits: majors[i].credits,
        descriptionIs: 'TODO',
        descriptionEn: 'TODO',
        durationInYears: majors[i].years,
        costPerYear: null, //TODO
        iscedCode: 'TODO',
        externalUrlIs: 'TODO',
        externalUrlEn: 'TODO',
        searchKeywords: ['Test1', 'Test2'], //TODO
        admissionRequirementsIs: 'TODO',
        admissionRequirementsEn: 'TODO',
        studyRequirementsIs: 'TODO',
        studyRequirementsEn: 'TODO',
        costInformationIs: 'TODO',
        costInformationEn: 'TODO',
      }

      const oldProgramObj = await this.programModel.findOne({
        where: {
          externalId: programObj.externalId,
        },
      })

      let programId: string | undefined
      if (oldProgramObj) {
        programId = oldProgramObj.id
        await this.programModel.update(programObj, {
          where: { id: programId },
        })
      } else {
        programId = (await this.programModel.create(programObj)).id
      }

      // DELETE program tag
      await this.programTagModel.destroy({
        where: { programId: programId },
      })

      // CREATE program tag
      for (let j = 0; j < tagList.length; j++) {
        const tag = await this.tagModel.findOne({
          where: { code: tagList[j].code },
        })

        if (!tag) continue

        await this.programTagModel.create({
          programId: programId,
          tagId: tag?.id,
        })
      }

      // DELETE program mode of delivery
      await this.programModeOfDeliveryModel.destroy({
        where: { programId: programId },
      })

      // CREATE program mode of delivery
      for (let j = 0; j < modeOfDeliveryList.length; j++) {
        await this.programModeOfDeliveryModel.create({
          programId: programId,
          modeOfDelivery: modeOfDeliveryList[j],
        })
      }

      // DELETE program extra application field
      await this.programExtraApplicationFieldModel.destroy({
        where: { programId: programId },
      })

      // CREATE program extra application field
      for (let j = 0; j < extraApplicationFieldList.length; j++) {
        await this.programExtraApplicationFieldModel.create({
          programId: programId,
          nameIs: extraApplicationFieldList[j].nameIs,
          nameEn: extraApplicationFieldList[j].nameEn,
          descriptionIs: extraApplicationFieldList[j].descriptionIs,
          descriptionEn: extraApplicationFieldList[j].descriptionEn,
          required: extraApplicationFieldList[j].required,
          fieldType: extraApplicationFieldList[j].fieldType,
          uploadAcceptedFileType:
            extraApplicationFieldList[j].uploadAcceptedFileType,
        })
      }
    }
  }

  private async updateCourses() {
    const universityNationalId = '6001692039' //TODO
    const universityId = (
      await this.universityModel.findOne({
        where: { nationalId: universityNationalId },
      })
    )?.id

    // DELETE all courses for this university
    await this.courseModel.destroy({ where: { universityId: universityId } })

    const programList = await this.programModel.findAll({
      where: { universityId: universityId },
    })
    for (let i = 0; i < programList.length; i++) {
      const programId = programList[i].id

      //TODO
      const courseList = [
        {
          externalId: 'AB123',
          nameIs: 'Test',
          nameEn: 'Test',
          credits: 8,
          semesterYear: 2023,
          semesterSeason: Season.FALL,
          descriptionIs: '',
          descriptionEn: '',
          externalUrlIs: '',
          externalUrlEn: '',
        },
      ]

      // DELETE program course
      await this.programCourseModel.destroy({
        where: { programId: programId },
      })

      // CREATE/UPDATE course
      // CREATE program course
      for (let j = 0; j < courseList.length; j++) {
        // course
        const courseObj = {
          externalId: courseList[j].externalId,
          nameIs: courseList[j].nameIs,
          nameEn: courseList[j].nameEn,
          universityId: universityId,
          credits: courseList[j].credits,
          semesterYear: courseList[j].semesterYear,
          semesterSeason: courseList[j].semesterSeason,
          descriptionIs: courseList[j].descriptionIs,
          descriptionEn: courseList[j].descriptionEn,
          externalUrlIs: courseList[j].externalUrlIs,
          externalUrlEn: courseList[j].externalUrlEn,
        }

        const oldCourseObj = await this.courseModel.findOne({
          where: { externalId: courseObj.externalId },
        })

        let courseId: string | undefined
        if (oldCourseObj) {
          courseId = oldCourseObj.id
          await this.courseModel.update(courseObj, {
            where: { id: courseId },
          })
        } else {
          courseId = (await this.courseModel.create(courseObj)).id
        }

        // program course
        await this.programCourseModel.create({
          programId: programId,
          courseId: courseId,
          requirement: Requirement.MANDATORY, //TODO
        })
      }
    }
  }
}
