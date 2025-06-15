export interface GetMachineByRegNumberInput {
  regNumber: string
  locale?: string
  correlationId?: string
}

export interface GetMachineByIdInput {
  id: string
  locale?: string
  correlationId?: string
}

export const isIdInput = (
  object: GetMachineByRegNumberInput | GetMachineByIdInput,
): object is GetMachineByIdInput => {
  return 'id' in object
}
