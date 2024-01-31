import React, { useContext, useState } from 'react'
import {
  Text,
  Box,
  Input,
  Button,
  toast,
  ToastContainer,
  Checkbox,
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
import MunicipalityNumberInput from './MunicipalityNumberInput/MunicipalityNumberInput'
import { SelectedMunicipality } from '@island.is/financial-aid-web/veita/src/components'
import { AdminContext } from '@island.is/financial-aid-web/veita/src/components/AdminProvider/AdminProvider'

interface Props {
  currentMunicipality: Municipality
}
const MunicipalityAdminSettings = ({ currentMunicipality }: Props) => {
  const [state, setState] = useState(currentMunicipality)

  const [hasNavError, setHasNavError] = useState(false)
  const [hasAidError, setHasAidError] = useState(false)
  const [updateMunicipalityMutation, { loading }] = useMutation(
    UpdateMunicipalityMutation,
  )
  const { setMunicipality } = useContext(AdminContext)

  const INDIVIDUAL = 'individual'
  const COHABITATION = 'cohabitation'
  const aidNames = Object.values(AidName).map(String)

  const errorCheckAid = (aid: Aid, prefix: string, scrollToError: boolean) => {
    const firstErrorAid = Object.entries(aid).find(
      (a) => aidNames.includes(a[0]) && a[1] <= 0,
    )

    if (firstErrorAid === undefined) {
      return false
    }

    setHasAidError(true)
    if (scrollToError) {
      scrollToId(`${prefix}${firstErrorAid[0]}`)
    }
    return true
  }

  const errorCheckNav = () => {
    if (
      state.usingNav &&
      (!state.navUrl || !state.navUsername || !state.navPassword)
    ) {
      setHasNavError(true)
      scrollToId('navSettings')
      return true
    }

    return false
  }

  const submit = () => {
    const errorNav = errorCheckNav()
    const errorAid =
      errorCheckAid(state.individualAid, INDIVIDUAL, !errorNav) ||
      errorCheckAid(state.cohabitationAid, COHABITATION, !errorNav)

    if (errorNav || errorAid) {
      return
    }
    updateMunicipality()
  }

  const aidChangeHandler = (update: () => void) => {
    setHasAidError(false)
    update()
  }

  const navChangeHandler = (update: () => void) => {
    setHasNavError(false)
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

  //This is because of animation on select doesnt work stand alone
  const navAndMultiSelectContent = [
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
      headline: 'Tenging við ytri kerfi',
      component: (
        <>
          <Box marginBottom={3} id="navSettings">
            <Checkbox
              name="usingNav"
              label="Virkja tengingu við Navision"
              checked={state.usingNav}
              onChange={(event) =>
                navChangeHandler(() => {
                  setState({
                    ...state,
                    usingNav: event.target.checked,
                  })
                })
              }
            />
          </Box>
          <Input
            label="Slóð"
            name="navUrl"
            value={state.navUrl ?? ''}
            backgroundColor="blue"
            hasError={hasNavError && !state.navUrl}
            disabled={!state.usingNav}
            onChange={(event) =>
              navChangeHandler(() => {
                setState({
                  ...state,
                  navUrl: event.currentTarget.value,
                })
              })
            }
          />
          <Text marginTop={1} marginBottom={3} variant="small">
            Þetta er slóð á vefþjónustu Navision sem þið fáið frá Wise þegar
            vefþjónustan hefur verið sett upp fyrir sveitafélagið.
          </Text>
          <Input
            label="Notendanafn"
            name="navUsername"
            value={state.navUsername ?? ''}
            backgroundColor="blue"
            hasError={hasNavError && !state.navUsername}
            disabled={!state.usingNav}
            onChange={(event) =>
              navChangeHandler(() => {
                setState({
                  ...state,
                  navUsername: event.currentTarget.value,
                })
              })
            }
          />
          <Text marginTop={1} marginBottom={3} variant="small">
            Þetta er notendanafn að Navision vefþjónustunni sem þið fáið frá
            Wise þegar vefþjónustan hefur verið sett upp fyrir sveitarfélagið.
          </Text>
          <Input
            label="Lykilorð"
            name="navPassword"
            value={state.navPassword ?? ''}
            backgroundColor="blue"
            hasError={hasNavError && !state.navPassword}
            disabled={!state.usingNav}
            autoComplete="off"
            onChange={(event) =>
              navChangeHandler(() => {
                setState({
                  ...state,
                  navPassword: event.currentTarget.value,
                })
              })
            }
          />
          <Text marginTop={1} marginBottom={3} variant="small">
            Þetta er lykilorð að Navision vefþjónustunni sem þið fáið frá Wise
            þegar vefþjónustan hefur verið sett upp fyrir sveitarfélagið.
          </Text>
        </>
      ),
    },
  ]

  const EmailSiteAidContent = [
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
            <MunicipalityNumberInput
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
            <MunicipalityNumberInput
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
      <Box
        className={`contentUp`}
        marginBottom={[2, 2, 7]}
        display="flex"
        justifyContent="spaceBetween"
      >
        <Text as="h1" variant="h1">
          Sveitarfélagsstillingar
        </Text>
        <Button loading={loading} onClick={submit} icon="checkmark">
          Vista stillingar
        </Button>
      </Box>

      <Box marginBottom={[2, 2, 20]} marginTop={[2, 2, 20]}>
        <Input
          label="Kerfi"
          name="systemName"
          value={''}
          backgroundColor="blue"
          disabled={!state.usingNav}
          autoComplete="off"
          onChange={(event) => console.log(event.currentTarget.value)}
        />
        <Input
          label="Lykill"
          name="apiKey"
          value={''}
          backgroundColor="blue"
          disabled={!state.usingNav}
          autoComplete="off"
          onChange={(event) => console.log(event.currentTarget.value)}
        />
      </Box>

      <Box className={`contentUp delay-25`}>
        {navAndMultiSelectContent.map((el, index) => {
          return (
            <Box
              marginBottom={[2, 2, 7]}
              key={`navAndMultiSelectContent-${index}`}
            >
              <Text
                as="h3"
                variant="h3"
                marginBottom={[2, 2, 3]}
                color="dark300"
              >
                {el.headline}
              </Text>
              {el.component}
            </Box>
          )
        })}
      </Box>

      {EmailSiteAidContent.map((el, index) => {
        return (
          <Box
            marginBottom={[2, 2, 7]}
            className={`contentUp`}
            style={{ animationDelay: index * 10 + 30 + 'ms' }}
            key={`EmailSiteAidContent-${index}`}
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
