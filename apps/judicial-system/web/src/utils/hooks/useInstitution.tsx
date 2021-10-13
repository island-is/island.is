import { useQuery } from '@apollo/client'
import { InstitutionType } from '@island.is/judicial-system/types'
import type { Institution } from '@island.is/judicial-system/types'
import { InstitutionsQuery } from '@island.is/judicial-system-web/src/utils/mutations'

let rawInstitutions: Institution[]

interface InstitutionData {
  institutions: Institution[]
}

const institutions: {
  courts: Institution[]
  allCourts: Institution[]
  defaultCourt: Institution | undefined
  prosecutorsOffices: Institution[]
  prisonInstitutions: Institution[]
  loaded: boolean
} = {
  courts: [],
  allCourts: [],
  defaultCourt: undefined,
  prosecutorsOffices: [],
  prisonInstitutions: [],
  loaded: false,
}

const useInstitution = () => {
  const { data, loading } = useQuery<InstitutionData>(InstitutionsQuery, {
    skip: Boolean(rawInstitutions),
  })

  if (data && data.institutions && !rawInstitutions) {
    rawInstitutions = data.institutions

    institutions.courts = rawInstitutions.filter(
      (institution) => institution.type === InstitutionType.COURT,
    )

    institutions.allCourts = rawInstitutions.filter(
      (institution) =>
        institution.type === InstitutionType.COURT ||
        institution.type === InstitutionType.HIGH_COURT,
    )

    institutions.defaultCourt = institutions.courts.find(
      (institution) => institution.name === 'Héraðsdómur Reykjavíkur',
    )

    institutions.prosecutorsOffices = rawInstitutions.filter(
      (institution) => institution.type === InstitutionType.PROSECUTORS_OFFICE,
    )

    institutions.prisonInstitutions = rawInstitutions.filter(
      (institution) =>
        institution.type === InstitutionType.PRISON ||
        institution.type === InstitutionType.PRISON_ADMIN,
    )
    institutions.loaded = true
  }

  return { ...institutions, loading }
}

export default useInstitution
