import * as kennitala from 'kennitala'

export const getBirthDate = (nationalId: string): Date | undefined =>
  kennitala.isValid(nationalId)
    ? kennitala.info(nationalId).birthday
    : undefined
