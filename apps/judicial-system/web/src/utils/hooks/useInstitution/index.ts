import { useQuery } from '@apollo/client'

import {
  Institution,
  InstitutionType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { InstitutionsQuery } from '@island.is/judicial-system-web/src/utils/mutations'

let allInstitutions: Institution[]

interface InstitutionData {
  institutions: Institution[]
}

const institutions: {
  districtCourts: Institution[]
  courtsOfAppeal: Institution[]
  prosecutorsOffices: Institution[]
  prisonInstitutions: Institution[]
  loaded: boolean
} = {
  districtCourts: [],
  courtsOfAppeal: [],
  prosecutorsOffices: [],
  prisonInstitutions: [],
  loaded: false,
}

const useInstitution = (skip = false) => {
  const { data, loading } = useQuery<InstitutionData>(InstitutionsQuery, {
    skip: skip || Boolean(allInstitutions),
    errorPolicy: 'all',
  })

  if (data && data.institutions && !allInstitutions) {
    allInstitutions = data.institutions

    institutions.districtCourts = allInstitutions.filter(
      (institution) => institution.type === InstitutionType.DISTRICT_COURT,
    )

    institutions.courtsOfAppeal = allInstitutions.filter(
      (institution) => institution.type === InstitutionType.COURT_OF_APPEALS,
    )

    institutions.prosecutorsOffices = allInstitutions.filter(
      (institution) => institution.type === InstitutionType.PROSECUTORS_OFFICE,
    )

    institutions.prisonInstitutions = allInstitutions.filter(
      (institution) =>
        institution.type === InstitutionType.PRISON ||
        institution.type === InstitutionType.PRISON_ADMIN,
    )

    institutions.loaded = true
  }

  return { ...institutions, allInstitutions, loading }
}

export default useInstitution
