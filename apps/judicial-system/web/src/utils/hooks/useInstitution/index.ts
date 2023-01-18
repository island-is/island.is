import { useQuery } from '@apollo/client'
import { InstitutionType } from '@island.is/judicial-system/types'
import type { Institution } from '@island.is/judicial-system/types'
import { InstitutionsGql } from '@island.is/judicial-system-web/src/utils/mutations'

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
  const { data, loading } = useQuery<InstitutionData>(InstitutionsGql, {
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
