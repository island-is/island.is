export enum RadioValidationExampleEnum {
  OPTION_1 = 'option1',
  OPTION_2 = 'option2',
  OPTION_3 = 'option3',
}

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
    children?: Array<{
      __typename?: 'EducationFriggOrganizationModel'
      id: string
      nationalId: string
      name: string
      type: OrganizationModelTypeEnum
      gradeLevels?: Array<string> | null
    }> | null
  }> | null
}
