import { ArrOfTypesForSubscriptions } from '../../../types/interfaces'

interface Props {
  types: ArrOfTypesForSubscriptions
}

const getInitValues = ({ types }: Props) => {
  if (types && types != null) {
    const Institutions = Object.entries(types.institutions).map(
      ([id, name]) => ({
        id,
        name,
      }),
    )

    const PolicyAreas = Object.entries(types.policyAreas).map(([id, name]) => ({
      id,
      name,
    }))
    return {
      PolicyAreas: PolicyAreas,
      Institutions: Institutions,
    }
  }
  return {
    PolicyAreas: [],
    Institutions: [],
  }
}

export default getInitValues
