import { useQuery } from '@apollo/client'

import { InstitutionsQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import {
  InstitutionType,
  Institution,
} from '@island.is/judicial-system-web/src/graphql/schema'

let rawInstitutions: Institution[]

interface InstitutionData {
  institutions: Institution[]
}

const institutions: {
  courts: Institution[]
  allCourts: Institution[]
  prosecutorsOffices: Institution[]
  prisonInstitutions: Institution[]
  loaded: boolean
} = {
  courts: [],
  allCourts: [],
  prosecutorsOffices: [],
  prisonInstitutions: [],
  loaded: false,
}

const useInstitution = (skip = false) => {
  const { data, loading } = useQuery<InstitutionData>(InstitutionsQuery, {
    skip: skip || Boolean(rawInstitutions),
  })

  if (data && data.institutions && !rawInstitutions) {
    rawInstitutions = data.institutions

    institutions.courts = rawInstitutions.filter(
      (institution) => institution.type === InstitutionType.Court,
    )

    institutions.allCourts = rawInstitutions.filter(
      (institution) =>
        institution.type === InstitutionType.Court ||
        institution.type === InstitutionType.HighCourt,
    )

    institutions.prosecutorsOffices = rawInstitutions.filter(
      (institution) => institution.type === InstitutionType.ProsecutorsOffice,
    )

    institutions.prisonInstitutions = rawInstitutions.filter(
      (institution) =>
        institution.type === InstitutionType.Prison ||
        institution.type === InstitutionType.PrisonAdmin,
    )
    institutions.loaded = true
  }

  return { ...institutions, loading }
}

export default useInstitution
