import React, { useContext, useState } from 'react'
import {
  Text,
  Box,
  Input,
  Button,
  toast,
  ToastContainer,
} from '@island.is/island-ui/core'

import {
  Aid,
  AidName,
  Municipality,
  scrollToId,
} from '@island.is/financial-aid/shared/lib'
import { useMutation } from '@apollo/client'
import { UpdateMunicipalityMutation } from '@island.is/financial-aid-web/veita/graphql'
import omit from 'lodash/omit'
import MunicipalityAdminInput from './MunicipalityNumberInput/MunicipalityNumberInput'
import { SelectedMunicipality } from '@island.is/financial-aid-web/veita/src/components'
import { AdminContext } from '@island.is/financial-aid-web/veita/src/components/AdminProvider/AdminProvider'

interface Props {
  currentMunicipality: Municipality
}
const MunicipalityAdminSettings = ({ currentMunicipality }: Props) => {
  const [state, setState] = useState(currentMunicipality)
  const [hasAidError, setHasAidError] = useState(false)
  const [updateMunicipalityMutation, { loading }] = useMutation(
    UpdateMunicipalityMutation,
  )
  const { setMunicipality } = useContext(AdminContext)

  const INDIVIDUAL = 'individual'
  const COHABITATION = 'cohabitation'
  const aidNames = Object.values(AidName).map(String)

  const errorCheck = (aid: Aid, prefix: string) => {
    const firstErrorAid = Object.entries(aid).find(
      (a) => aidNames.includes(a[0]) && a[1] <= 0,
    )

    if (firstErrorAid === undefined) {
      return false
    }

    setHasAidError(true)
    scrollToId(`${prefix}${firstErrorAid[0]}`)
    return true
  }

  const submit = () => {
    if (
      errorCheck(state.individualAid, INDIVIDUAL) ||
      errorCheck(state.cohabitationAid, COHABITATION)
    ) {
      return
    }
    updateMunicipality()
  }

  const aidChangeHandler = (update: () => void) => {
    setHasAidError(false)
    update()
  }

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

  const content = [
    {
      headline: 'Veldu sveitarfélag til að breyta stillingum',
      component: (
        <SelectedMunicipality
          currentMunicipality={state}
          onStateUpdate={(muni: Municipality) => {
            setState(muni)
          }}
        />
      ),
    },
    {
      headline: `Reglur um fjárhagsaðstoð ${state.name}`,
      smallText:
        'Þegar umsóknum er synjað er hlekkur á slóð um reglur um fjárhagsaðstoð sveitarfélagsins birtur í tölvupósti sem er sendur á umsækjanda.',
      component: (
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
      ),
    },
    {
      headline: 'Almennt netfang sveitarfélagsins (félagsþjónusta)',
      smallText:
        'Ef ske kynni að tæknilegir örðugleikar yllu því að umsækjandi næði ekki að senda athugasemdir eða gögn í gegnum sína stöðusíðu þá er umsækjanda bent á að hægt sé að hafa samband með því að senda tölvupóst. Þá er þetta netfang birt umsækjanda til upplýsinga.',
      component: (
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
      ),
    },
    {
      headline: 'Vefur sveitarfélagsins',
      smallText:
        'Ef vísað er til þess að upplýsingar megi finna á vef sveitarfélagsins er notanda bent á þessa slóð.',
      component: (
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
      ),
    },
    {
      headline: 'Einstaklingar',
      component: Object.entries(state.individualAid).map(
        (aid) =>
          aidNames.includes(aid[0]) && (
            <MunicipalityAdminInput
              key={`${INDIVIDUAL}${aid[0]}`}
              id={aid[0]}
              aid={aid[1]}
              prefix={INDIVIDUAL}
              error={hasAidError}
              update={(value) =>
                aidChangeHandler(() =>
                  setState({
                    ...state,
                    individualAid: {
                      ...state.individualAid,
                      [aid[0]]: value,
                    },
                  }),
                )
              }
            />
          ),
      ),
    },
    {
      headline: 'Hjón/sambúð',
      component: Object.entries(state.cohabitationAid).map(
        (aid) =>
          aidNames.includes(aid[0]) && (
            <MunicipalityAdminInput
              key={`${COHABITATION}${aid[0]}`}
              id={aid[0]}
              aid={aid[1]}
              prefix={COHABITATION}
              error={hasAidError}
              update={(value) =>
                aidChangeHandler(() =>
                  setState({
                    ...state,
                    cohabitationAid: {
                      ...state.cohabitationAid,
                      [aid[0]]: value,
                    },
                  }),
                )
              }
            />
          ),
      ),
    },
  ]

  return (
    <Box marginTop={[5, 10, 15]} marginBottom={[5, 10, 15]}>
      <Box className={`contentUp`}>
        <Text as="h1" variant="h1" marginBottom={[2, 2, 7]}>
          Sveitarfélagsstillingar
        </Text>
      </Box>

      {content.map((el, index) => {
        return (
          <Box
            marginBottom={[2, 2, 7]}
            className={``}
            style={{ animationDelay: index * 10 + 30 + 'ms' }}
            key={`settings-${index}`}
          >
            <Text as="h3" variant="h3" marginBottom={[2, 2, 3]} color="dark300">
              {el.headline}
            </Text>
            {el.component}

            {el.smallText && (
              <Text marginTop={1} variant="small">
                {el.smallText}
              </Text>
            )}
          </Box>
        )
      })}

      <Box display="flex" justifyContent="flexEnd">
        <Button loading={loading} onClick={submit} icon="checkmark">
          Vista stillingar
        </Button>
      </Box>
      <ToastContainer />
    </Box>
  )
}

export default MunicipalityAdminSettings
