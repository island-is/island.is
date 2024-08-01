export const MACHINE_MODELS = `
  query GetMachineModels($type: String!) {
    getMachineModels(type: $type) {
      name
    }
  }
`

export const MACHINE_CATEGORY = `
  query GetMachineCategory($input: GetMachineParentCategoryByTypeAndModelInput!) {
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
