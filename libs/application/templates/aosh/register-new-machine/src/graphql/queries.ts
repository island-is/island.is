export const MACHINE_MODELS = `
  query GetMachineModels($type: String!) {
    getMachineModels(type: $type) {
      name
    }
  }
`

export const MACHINE_CATEGORY = `
  query GetMachineCategory($input: WorkMachinesParentCategoryByTypeAndModelInput!) {
    getMachineParentCategoryByTypeAndModel(input: $input) {
      name
      subCategoryName
      registrationNumberPrefix
    }
  }
`

export const MACHINE_SUB_CATEGORIES = `
  query GetMachineSubCategories($parentCategory: String!) {
    getMachineSubCategories(parentCategory: $parentCategory) {
      name
      parentCategoryName
      registrationNumberPrefix
    }
  }
`

export const TECHNICAL_INFO_INPUTS = `
  query GetTechnicalInfoInputs($parentCategory: String!) {
    getTechnicalInfoInputs(parentCategory: $parentCategory) {
      variableName
      label
      type
      required
      maxLength
      values
    }
  }
`
