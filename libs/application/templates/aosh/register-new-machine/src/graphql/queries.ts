export const MACHINE_MODELS = `
  query GetMachineModels($type: String!) {
    getMachineModels(type: $type) {
      name
    }
  }
`
