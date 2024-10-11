import { MachineStatusEnum } from '@island.is/clients/work-machines'

export const cleanPhoneNumber = (phoneNumber: string) => {
  return phoneNumber.replace(/[-+]/g, '')
}

export const statusMapping: Record<string, MachineStatusEnum> = {
  Temporary: MachineStatusEnum.NUMBER_3,
  Permanent: MachineStatusEnum.NUMBER_4,
}
