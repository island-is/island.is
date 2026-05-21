import { CustomField } from '../app/modules/services/models/zendeskCustomField.dto'

export type Instance = keyof typeof fieldMappings

const fieldMappings = {
  heilsa: {
    name: 111,
    email: 222,
    address: 333,
    nationalId: 444,
    postalCode: 555,
    phoneNumber: 666,
    municipality: 777,
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
    name: 1,
    email: 2,
    address: 3,
    nationalId: 4,
    postalCode: 5,
    phoneNumber: 6,
    municipality: 7,
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

export function mapToCustomFields(
  instance: Instance,
  input: Input,
): CustomField[] {
  const mapping = fieldMappings[instance]

  return (Object.keys(mapping) as Array<keyof typeof mapping>).flatMap(
    (key) => {
      const value = input[key]
      return value == null ? [] : [{ id: mapping[key], value }]
    },
  )
}
