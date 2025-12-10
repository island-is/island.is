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
      nameEn
      subCategoryName
      subCategoryNameEn
      registrationNumberPrefix
    }
  }
`

export const MACHINE_SUB_CATEGORIES = `
  query GetMachineSubCategories($parentCategory: String!) {
    getMachineSubCategories(parentCategory: $parentCategory) {
      name
      nameEn
      parentCategoryName
      parentCategoryNameEn
      registrationNumberPrefix
    }
  }
`

export const TECHNICAL_INFO_INPUTS = `
  query GetTechnicalInfoInputs($parentCategory: String!, $subCategory: String!) {
    getTechnicalInfoInputs(parentCategory: $parentCategory, subCategory: $subCategory) {
      name
      label
      labelEn
      type
      required
      maxLength
      values {
        name
        nameEn
      }
    }
  }
`
