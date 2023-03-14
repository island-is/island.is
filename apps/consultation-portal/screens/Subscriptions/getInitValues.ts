import { ArrOfTypesForSubscriptions } from '../../types/interfaces'

interface props {
  types: ArrOfTypesForSubscriptions
}

export const getInitValues = ({ types }: props) => {
  const Institutions = Object.entries(types.institutions).map(([id, name]) => ({
    id,
    name,
  }))

  const PolicyAreas = Object.entries(types.policyAreas).map(([id, name]) => ({
    id,
    name,
  }))

  return {
    PolicyAreas: PolicyAreas,
    Institutions: Institutions,
  }
}

export default getInitValues
