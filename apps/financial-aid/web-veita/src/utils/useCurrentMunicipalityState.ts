import { useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Municipality } from '@island.is/financial-aid/shared/lib'
import { AdminContext } from '../components/AdminProvider/AdminProvider'
import { UpdateMunicipalityMutation } from '@island.is/financial-aid-web/veita/graphql/sharedGql'
import omit from 'lodash/omit'
import { toast } from '@island.is/island-ui/core'

interface Props {
  municipality: Municipality
}

const useCurrentMunicipalityState = ({ municipality }: Props) => {
  const [state, setState] = useState(municipality)

  const [updateMunicipalityMutation, { loading }] = useMutation(
    UpdateMunicipalityMutation,
  )

  const { setMunicipality } = useContext(AdminContext)

  const updateMunicipality = async () => {
    await updateMunicipalityMutation({
      variables: {
        input: {
          individualAid: omit(state.individualAid, ['__typename']),
          cohabitationAid: omit(state.cohabitationAid, ['__typename']),
          homepage: state.homepage,
          rulesHomepage: state.rulesHomepage,
          email: state.email,
          municipalityId: state.municipalityId,
          usingNav: state.usingNav,
          navUrl: state.navUrl
            ? `${state.navUrl}${state.navUrl.endsWith('/') ? '' : '/'}`
            : state.navUrl,
          navUsername: state.navUsername,
          navPassword: state.navPassword,
        },
      },
    })
      .then((res) => {
        if (setMunicipality) {
          setMunicipality(res.data.updateMunicipality)
          toast.success('Það tókst að uppfæra sveitarfélagið')
        }
      })
      .catch(() => {
        toast.error(
          'Ekki tókst að uppfæra sveitarfélagið, vinsamlega reynið aftur síðar',
        )
      })
  }

  return {
    state,
    setState,
    loading,
    updateMunicipality,
  }
}

export default useCurrentMunicipalityState
