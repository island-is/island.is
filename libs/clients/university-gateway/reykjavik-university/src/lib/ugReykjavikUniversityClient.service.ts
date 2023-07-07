import { Department, Major } from './ugReykjavikUniversityClient.types'
import { Injectable } from '@nestjs/common'
import { DepartmentsApi, MajorsApi } from '../../gen/fetch'

@Injectable()
export class UgReykjavikUniversityClient {
  constructor(
    private majorsApi: MajorsApi,
    private departmentsApi: DepartmentsApi,
  ) {}

  async getMajors(): Promise<Major[]> {
    const res = await this.majorsApi.majorsGetAllMajorsExtendedByDepartmentId({
      version: '2',
    })

    return res.map((major) => ({
      id: major.id,
      name: major.name,
      credits: major.credits,
      majorTypeKey: major.majorType?.key,
      departmentId: major.departmentId,
      years: major.years,
      courseRegistrationBegins: major.settings?.courseRegistration?.begins,
      courseRegistrationEnds: major.settings?.courseRegistration?.ends,
    }))
  }

  async getDepartment(departmentId: number): Promise<Department> {
    const res = await this.departmentsApi.departmentsGetDepartmentById({
      version: '2',
      departmentId: departmentId,
    })

    return {
      id: res.id,
      name: res.name,
    }
  }
}
