export enum OrganizationModelTypeEnum {
  Municipality = 'Municipality',
  National = 'National',
  School = 'School',
}

export type FriggSchoolsByMunicipality = {
  __typename?: 'Query'
  friggSchoolsByMunicipality?: Array<{
    __typename?: 'EducationFriggOrganizationModel'
    id: string
    nationalId: string
    name: string
    type: OrganizationModelTypeEnum
    managing?: Array<{
      __typename?: 'EducationFriggOrganizationModel'
      id: string
      nationalId: string
      name: string
      type: OrganizationModelTypeEnum
      gradeLevels?: Array<string> | null
    }> | null
  }> | null
}

export type TableRepeaterAnswers = {
  fullName: string
  nationalId: string
  relation: string
}
