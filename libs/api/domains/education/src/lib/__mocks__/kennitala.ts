import { KennitalaInfo } from 'kennitala'

const ages = {} as { [key: string]: number }

// eslint-disable-next-line @typescript-eslint/naming-convention
export const __setAge = (kt: string, age: number) => {
  ages[kt] = age
}

export const info = (kt: string): KennitalaInfo => {
  return {
    valid: true,
    age: ages[kt],
    birthday: new Date(),
    birthdayReadable: 'n/a',
    kt,
    type: 'person',
  }
}
