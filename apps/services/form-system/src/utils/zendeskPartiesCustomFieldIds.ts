import { CustomField } from '../app/modules/services/models/zendeskCustomField.dto'

export type Instance = keyof typeof fieldMappings

const fieldMappings = {
  haskoliislands: {
    name: 51015877611291,
    email: 51016152728859,
    address: 51015867401371,
    nationalId: 51015855616795,
    postalCode: 51015920921755,
    phoneNumber: 51016234676763,
    municipality: 51015942835227,
  },
  heilsa: {
    name: 51216152741531,
    email: 51216169546267,
    address: 51216186383515,
    nationalId: 51216171879451,
    postalCode: 51216189258139,
    phoneNumber: 51216190788891,
    municipality: 51216236329371,
  },
  digitaliceland: {
    name: 29423576358418,
    email: 27056758018194,
    address: 15167143366802,
    nationalId: 24962773088530,
    postalCode: 15524096374162,
    phoneNumber: 15359010264850,
    municipality: 35764490214930,
  },
  digitaliceland1715002531: {
    name: 36033208873618,
    email: 36033206372114,
    address: 36033213472786,
    nationalId: 27740279016466,
    postalCode: 36033229111442,
    phoneNumber: 36033299365010,
    municipality: 36033312019346,
  },
} as const

type Input = {
  name?: string | null
  email?: string | null
  address?: string | null
  nationalId?: string | null
  postalCode?: string | null
  phoneNumber?: string | null
  municipality?: string | null
}

export const mapToCustomFields = (
  instance: Instance,
  input: Input,
): CustomField[] => {
  const mapping = fieldMappings[instance]

  return (Object.keys(mapping) as Array<keyof typeof mapping>).flatMap(
    (key) => {
      const value = input[key]
      return value == null ? [] : [{ id: mapping[key], value }]
    },
  )
}
