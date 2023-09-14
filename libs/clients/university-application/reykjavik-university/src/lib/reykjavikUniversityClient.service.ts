import { Injectable } from '@nestjs/common'
import { DepartmentsApi, MajorsApi } from '../../gen/fetch'
import {
  DegreeType,
  FieldType,
  ICourse,
  IProgram,
  ModeOfDelivery,
  Requirement,
  Season,
} from '@island.is/university-gateway-lib'

export
@Injectable()
class ReykjavikUniversityApplicationClient {
  constructor(
    private majorsApi: MajorsApi,
    private departmentsApi: DepartmentsApi,
  ) {}

  async getPrograms(): Promise<IProgram[]> {
    const majors =
      await this.majorsApi.majorsGetAllMajorsExtendedByDepartmentId({
        version: '2',
      })

    // Get flat list of departments
    const departmentListList =
      await this.departmentsApi.departmentsGetAllDepartments({
        version: '2',
      })
    const departmentList: { id: number; name: string }[] = []
    for (let i = 0; i < departmentListList.length; i++) {
      const subDepartmentList = departmentListList[i].departments || []
      for (let j = 0; j < subDepartmentList.length; j++) {
        if (subDepartmentList[j].id) {
          departmentList.push({
            id: subDepartmentList[j].id!,
            name: subDepartmentList[j].name || '',
          })
        }
      }
    }

    return await Promise.all(
      majors?.map(async (major) => {
        // Get department name
        const departmentName = departmentList.find(
          (d) => d.id === major.departmentId,
        )?.name

        // Get degree type
        let degreeType: DegreeType = DegreeType.UNDERGRADUATE
        switch (major.majorType?.key) {
          case 'grunnnám':
            degreeType = DegreeType.UNDERGRADUATE
            break
          case 'meistaranám':
            degreeType = DegreeType.POSTGRADUATE
            break
          case 'doktorsnám':
            degreeType = DegreeType.DOCTORAL
            break
        }

        //TODO
        const tagList = [
          { code: 'verkfraedi_raunvisindi_taekni_og_tolur' },
          { code: 'saga_menning_listir_og_tru' },
        ]

        //TODO
        const modeOfDeliveryList = [
          ModeOfDelivery.ONLINE,
          ModeOfDelivery.ON_SITE,
        ]

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

        return {
          externalId: major.id?.toString() ?? '', //TODO
          nameIs: major.name || '',
          nameEn: major.name || '', //TODO
          departmentNameIs: departmentName || '',
          departmentNameEn: departmentName || '', //TODO
          startingSemesterYear: 2023, //TODO
          startingSemesterSeason: Season.FALL, //TODO
          applicationStartDate:
            major.settings?.courseRegistration?.begins || new Date(),
          applicationEndDate:
            major.settings?.courseRegistration?.ends || new Date(),
          degreeType: degreeType,
          degreeAbbreviation: '', //TODO
          credits: major.credits || 0,
          descriptionIs: '', //TODO
          descriptionEn: '', //TODO
          durationInYears: major.years || 0,
          costPerYear: undefined, //TODO
          iscedCode: '', //TODO
          searchKeywords: [], //TODO
          externalUrlIs: '', //TODO
          externalUrlEn: '', //TODO
          admissionRequirementsIs: '', //TODO
          admissionRequirementsEn: '', //TODO
          studyRequirementsIs: '', //TODO
          studyRequirementsEn: '', //TODO
          costInformationIs: '', //TODO
          costInformationEn: '', //TODO
          courses: [], //TODO
          tag: tagList,
          modeOfDelivery: modeOfDeliveryList,
          extraApplicationField: extraApplicationFieldList,
        }
      }),
    )
  }

  async getCourses(externalId: string): Promise<ICourse[]> {
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
        requirement: Requirement.MANDATORY,
      },
    ]

    return courseList
  }
}
