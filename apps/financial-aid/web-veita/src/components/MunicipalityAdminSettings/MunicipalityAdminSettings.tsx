import React, { useState } from 'react'
import { NumberInput } from '@island.is/financial-aid-web/veita/src/components'
import {
  Text,
  Box,
  Input,
  Button,
  toast,
  ToastContainer,
} from '@island.is/island-ui/core'

import { Municipality } from '@island.is/financial-aid/shared/lib'
import { useMutation } from '@apollo/client'
import { UpdateMunicipalityMutation } from '@island.is/financial-aid-web/veita/graphql'
import omit from 'lodash/omit'
import { useMunicipality } from '@island.is/financial-aid/shared/components'

interface Props {
  municipality: Municipality
}

const MunicipalityAdminSettings = ({ municipality }: Props) => {
  const maxAmountLength = 6
  const [state, setState] = useState(municipality)
  const [updateMunicipalityMutation, { loading }] = useMutation(
    UpdateMunicipalityMutation,
  )
  const { setMunicipality } = useMunicipality()

  const updateMunicipality = async () => {
    await updateMunicipalityMutation({
      variables: {
        input: {
          individualAid: omit(state.individualAid, ['__typename']),
          cohabitationAid: omit(state.cohabitationAid, ['__typename']),
          homepage: state.homepage,
          rulesHomepage: state.rulesHomepage,
          email: state.email,
        },
      },
    })
      .then((res) => {
        setMunicipality(res.data.updateMunicipality)
        toast.success('Það tókst að uppfæra sveitarfélagið')
      })
      .catch(() => {
        toast.error(
          'Ekki tókst að uppfæra sveitarfélagið, vinsamlega reynið aftur síðar',
        )
      })
  }
  return (
    <Box marginTop={[5, 10, 15]} marginBottom={[5, 10, 15]}>
      <Box className={`contentUp delay-25`} marginBottom={[1, 1, 3]}>
        <Text as="h1" variant="h1" marginBottom={[2, 2, 7]}>
          Sveitarfélagsstillingar
        </Text>
        <Text as="h3" variant="h3" color="dark300">
          Reglur um fjárhagsaðstoð {municipality.name}
        </Text>
      </Box>

      <Box marginBottom={[1, 1, 2]} className={`contentUp delay-25`}>
        <Input
          label="Slóð"
          name="financialAidRules"
          value={state.rulesHomepage ?? ''}
          backgroundColor="blue"
          onChange={(event) =>
            setState({
              ...state,
              rulesHomepage: event.currentTarget.value,
            })
          }
        />
      </Box>
      <Box className={`contentUp delay-50`}>
        <Text marginBottom={[2, 2, 7]} variant="small">
          Þegar umsóknum er synjað er hlekkur á slóð um reglur um fjárhagsaðstoð
          sveitarfélagsins birtur í tölvupósti sem er sendur á umsækjanda.
        </Text>
      </Box>
      <Box className={`contentUp delay-75`}>
        <Text as="h3" variant="h3" marginBottom={[1, 1, 3]} color="dark300">
          Almennt netfang sveitarfélagsins (félagsþjónusta)
        </Text>
      </Box>
      <Box marginBottom={[1, 1, 2]} className={`contentUp delay-75`}>
        <Input
          label="Netfang"
          name="municipalityEmail"
          value={state.email ?? ''}
          type="email"
          backgroundColor="blue"
          onChange={(event) =>
            setState({
              ...state,
              email: event.currentTarget.value,
            })
          }
        />
      </Box>
      <Box className={`contentUp delay-100`}>
        <Text marginBottom={[2, 2, 7]} variant="small">
          Ef ske kynni að tæknilegir örðugleikar yllu því að umsækjandi næði
          ekki að senda athugasemdir eða gögn í gegnum sína stöðusíðu þá er
          umsækjanda bent á að hægt sé að hafa samband með því að senda
          tölvupóst. Þá er þetta netfang birt umsækjanda til upplýsinga.
        </Text>

        <Text as="h3" variant="h3" marginBottom={[1, 1, 3]} color="dark300">
          Vefur sveitarfélagsins
        </Text>
      </Box>
      <Box marginBottom={[1, 1, 2]} className={`contentUp delay-100`}>
        <Input
          label="Slóð"
          name="municipalityWeb"
          value={state.homepage ?? ''}
          backgroundColor="blue"
          onChange={(event) =>
            setState({
              ...state,
              homepage: event.currentTarget.value,
            })
          }
        />
      </Box>
      <Text marginBottom={[2, 2, 7]} variant="small">
        Ef vísað er til þess að upplýsingar megi finna á vef sveitarfélagsins er
        notanda bent á þessa slóð.
      </Text>
      <Text as="h3" variant="h3" marginBottom={[1, 1, 3]} color="dark300">
        Einstaklingar
      </Text>
      <Box marginBottom={[1, 1, 3]}>
        <NumberInput
          label="Eigin húsnæði"
          name="individualsOwnPlace"
          id="individualsOwnPlace"
          maximumInputLength={maxAmountLength}
          value={state.individualAid.ownPlace.toString()}
          onUpdate={(value) =>
            setState({
              ...state,
              individualAid: {
                ...state.individualAid,
                ownPlace: value,
              },
            })
          }
        />
      </Box>
      <Box marginBottom={[1, 1, 3]}>
        <NumberInput
          label="Leiga með þinglýstan leigusamning"
          name="individualsRegisteredRenting"
          id="individualsRegisteredRenting"
          maximumInputLength={maxAmountLength}
          value={state.individualAid.registeredRenting.toString()}
          onUpdate={(value) =>
            setState({
              ...state,
              individualAid: {
                ...state.individualAid,
                registeredRenting: value,
              },
            })
          }
        />
      </Box>
      <Box marginBottom={[1, 1, 3]}>
        <NumberInput
          label="Leiga með óþinglýstan leigusamning"
          name="individualsUnregisteredRenting"
          id="individualsUnregisteredRenting"
          maximumInputLength={maxAmountLength}
          value={state.individualAid.unregisteredRenting.toString()}
          onUpdate={(value) =>
            setState({
              ...state,
              individualAid: {
                ...state.individualAid,
                unregisteredRenting: value,
              },
            })
          }
        />
      </Box>
      <Box marginBottom={[1, 1, 3]}>
        <NumberInput
          label="Býr eða leigir hjá öðrum án þinglýsts leigusamnings"
          name="individualsWithOthers"
          id="individualsWithOthers"
          maximumInputLength={maxAmountLength}
          value={state.individualAid.withOthers.toString()}
          onUpdate={(value) =>
            setState({
              ...state,
              individualAid: {
                ...state.individualAid,
                withOthers: value,
              },
            })
          }
        />
      </Box>
      <Box marginBottom={[1, 1, 3]}>
        <NumberInput
          label="Býr hjá foreldrum"
          name="individualsWithParents"
          id="individualsWithParents"
          maximumInputLength={maxAmountLength}
          value={state.individualAid.livesWithParents.toString()}
          onUpdate={(value) =>
            setState({
              ...state,
              individualAid: {
                ...state.individualAid,
                livesWithParents: value,
              },
            })
          }
        />
      </Box>
      <Box marginBottom={[1, 1, 3]}>
        <NumberInput
          label="Ekkert að ofantöldu"
          name="individualsOther"
          id="individualsOther"
          maximumInputLength={maxAmountLength}
          value={state.individualAid.unknown.toString()}
          onUpdate={(value) =>
            setState({
              ...state,
              individualAid: {
                ...state.individualAid,
                unknown: value,
              },
            })
          }
        />
      </Box>
      <Text as="h3" variant="h3" marginBottom={[1, 1, 3]} color="dark300">
        Hjón/sambúð
      </Text>
      <Box marginBottom={[1, 1, 3]}>
        <NumberInput
          label="Eigin húsnæði"
          name="cohabitationOwnPlace"
          id="cohabitationOwnPlace"
          maximumInputLength={maxAmountLength}
          value={state.cohabitationAid.ownPlace.toString()}
          onUpdate={(value) =>
            setState({
              ...state,
              cohabitationAid: {
                ...state.cohabitationAid,
                ownPlace: value,
              },
            })
          }
        />
      </Box>
      <Box marginBottom={[1, 1, 3]}>
        <NumberInput
          label="Leiga með þinglýstan leigusamning"
          name="cohabitationRegisteredRenting"
          id="cohabitationRegisteredRenting"
          maximumInputLength={maxAmountLength}
          value={state.cohabitationAid.registeredRenting.toString()}
          onUpdate={(value) =>
            setState({
              ...state,
              cohabitationAid: {
                ...state.cohabitationAid,
                registeredRenting: value,
              },
            })
          }
        />
      </Box>
      <Box marginBottom={[1, 1, 3]}>
        <NumberInput
          label="Leiga með óþinglýstan leigusamning"
          name="cohabitationUnregisteredRenting"
          id="cohabitationUnregisteredRenting"
          maximumInputLength={maxAmountLength}
          value={state.cohabitationAid.unregisteredRenting.toString()}
          onUpdate={(value) =>
            setState({
              ...state,
              cohabitationAid: {
                ...state.cohabitationAid,
                unregisteredRenting: value,
              },
            })
          }
        />
      </Box>
      <Box marginBottom={[1, 1, 3]}>
        <NumberInput
          label="Býr eða leigir hjá öðrum án þinglýsts leigusamnings"
          name="cohabitationWithOthers"
          id="cohabitationWithOthers"
          maximumInputLength={maxAmountLength}
          value={state.cohabitationAid.withOthers.toString()}
          onUpdate={(value) =>
            setState({
              ...state,
              cohabitationAid: {
                ...state.cohabitationAid,
                withOthers: value,
              },
            })
          }
        />
      </Box>
      <Box marginBottom={[1, 1, 3]}>
        <NumberInput
          label="Býr hjá foreldrum"
          name="cohabitationWithParents"
          id="cohabitationWithParents"
          maximumInputLength={maxAmountLength}
          value={state.cohabitationAid.livesWithParents.toString()}
          onUpdate={(value) =>
            setState({
              ...state,
              cohabitationAid: {
                ...state.cohabitationAid,
                livesWithParents: value,
              },
            })
          }
        />
      </Box>
      <Box marginBottom={[2, 2, 5]}>
        <NumberInput
          label="Ekkert að ofantöldu"
          name="cohabitationOther"
          id="cohabitationOther"
          maximumInputLength={maxAmountLength}
          value={state.cohabitationAid.unknown.toString()}
          onUpdate={(value) =>
            setState({
              ...state,
              cohabitationAid: {
                ...state.cohabitationAid,
                unknown: value,
              },
            })
          }
        />
      </Box>
      <Box display="flex" flexDirection="column" alignItems="flexEnd">
        <Button loading={loading} onClick={updateMunicipality} icon="checkmark">
          Vista stillingar
        </Button>
      </Box>
      <ToastContainer />
    </Box>
  )
}

export default MunicipalityAdminSettings
