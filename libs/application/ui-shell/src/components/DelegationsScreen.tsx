import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@island.is/auth/react'
import { ACTOR_DELEGATIONS } from '@island.is/application/graphql'
import {
  Text,
  Box,
  Page,
  ActionCard,
  GridContainer,
  Stack,
} from '@island.is/island-ui/core'
import {
  coreDelegationsMessages,
  coreMessages,
  getTypeFromSlug,
} from '@island.is/application/core'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import { LoadingShell } from './LoadingShell'
import { ErrorShell } from './ErrorShell'
import { format as formatKennitala } from 'kennitala'
import { useLocale } from '@island.is/localization'
import { useHistory } from 'react-router-dom'

type Delegation = {
  type: string
  from: {
    nationalId: string
    name: string
  }
}
interface DelegationsScreenProps {
  alternativeSubjects?: { nationalId: string }[]
  checkDelegation: Dispatch<SetStateAction<boolean>>
  slug: string
}
enum SCREEN_TYPE {
  NEW,
  ON_GOING,
  NOT_SUPPORTED,
  LOADING,
}
type DelegationsScreenDataType = {
  screenType: SCREEN_TYPE
  allowedDelegations?: string[]
  authDelegations?: Delegation[]
}

export const DelegationsScreen = ({
  slug,
  alternativeSubjects,
  checkDelegation,
}: DelegationsScreenProps) => {
  const [screenData, setScreenData] = useState<DelegationsScreenDataType>({
    screenType: SCREEN_TYPE.LOADING,
  })

  const { formatMessage } = useLocale()
  const type = getTypeFromSlug(slug)
  const { switchUser, userInfo: user } = useAuth()
  const history = useHistory()

  // Check for user delegations if application supports delegations
  const { data: delegations, loading } = useQuery(ACTOR_DELEGATIONS, {
    skip: !alternativeSubjects && !screenData.allowedDelegations,
  })

  // Does application support delegations
  useEffect(() => {
    async function applicationSupportsDelegations() {
      if (type) {
        const template = await getApplicationTemplateByTypeId(type)
        if (template.allowedDelegations) {
          setScreenData({
            ...screenData,
            allowedDelegations: template.allowedDelegations,
          })
        } else {
          if (user?.profile.actor) {
            setScreenData({
              screenType: SCREEN_TYPE.NOT_SUPPORTED,
              authDelegations: [
                {
                  type: 'user',
                  from: {
                    nationalId: user.profile.actor.nationalId,
                    name: user.profile.actor.name,
                  },
                },
              ],
            })
          } else {
            checkDelegation(true)
          }
        }
      }
    }
    applicationSupportsDelegations()
  }, [type, user?.profile.actor, switchUser, checkDelegation])

  // Check if user has delegations of the delegation types the application supports
  useEffect(() => {
    if (delegations && !!screenData.allowedDelegations && user) {
      const authActorDelegations: Delegation[] = delegations.authActorDelegations.filter(
        (delegation: Delegation) =>
          screenData.allowedDelegations?.includes(delegation.type),
      )
      if (authActorDelegations.length <= 0) {
        checkDelegation(true)
      } else {
        if (alternativeSubjects) {
          const subjects: string[] = alternativeSubjects.map(
            (subject) => subject.nationalId,
          )
          const found: Delegation = delegations.authActorDelegations.find(
            (delegation: Delegation) =>
              subjects.includes(delegation.from.nationalId),
          )
          setScreenData({
            ...screenData,
            screenType: SCREEN_TYPE.ON_GOING,
            authDelegations: [found],
          })
        } else {
          setScreenData({
            ...screenData,
            screenType: SCREEN_TYPE.NEW,
            authDelegations: [
              {
                type: 'user',
                from: user.profile.actor
                  ? {
                      nationalId: user.profile.actor.nationalId,
                      name: user.profile.actor.name,
                    }
                  : {
                      nationalId: user.profile.nationalId,
                      name: user.profile.name,
                    },
              },
              ...authActorDelegations,
            ],
          })
        }
      }
    }
  }, [
    delegations,
    screenData.allowedDelegations,
    alternativeSubjects,
    checkDelegation,
  ])

  const handleClick = (nationalId?: string) => {
    if (screenData.screenType !== SCREEN_TYPE.ON_GOING) {
      history.push('?delegationChecked=true')
    }
    if (nationalId) {
      switchUser(nationalId)
    } else {
      checkDelegation(true)
    }
  }

  if (screenData.screenType === SCREEN_TYPE.LOADING) {
    return <LoadingShell />
  } else {
    return (
      <Page>
        <GridContainer>
          <Box>
            <Box marginTop={5} marginBottom={5}>
              <Text marginBottom={2} variant="h1">
                {screenData.screenType === SCREEN_TYPE.ON_GOING
                  ? formatMessage(
                      coreDelegationsMessages.delegationScreenTitleForOngoingApplication,
                    )
                  : screenData.screenType === SCREEN_TYPE.NEW
                  ? formatMessage(coreDelegationsMessages.delegationScreenTitle)
                  : formatMessage(
                      coreDelegationsMessages.delegationScreenTitleApplicationNoDelegationSupport,
                    )}
              </Text>
              <Text>
                {screenData.screenType === SCREEN_TYPE.ON_GOING
                  ? formatMessage(
                      coreDelegationsMessages.delegationScreenSubtitleForOngoingApplication,
                    )
                  : screenData.screenType === SCREEN_TYPE.NEW
                  ? formatMessage(
                      coreDelegationsMessages.delegationScreenSubtitle,
                    )
                  : formatMessage(
                      coreDelegationsMessages.delegationScreenSubtitleApplicationNoDelegationSupport,
                    )}
              </Text>
            </Box>
            <Stack space={2}>
              {screenData.authDelegations?.map((delegation: Delegation) => (
                <ActionCard
                  key={delegation.from.nationalId}
                  avatar
                  heading={delegation.from.name}
                  text={
                    formatMessage(
                      coreDelegationsMessages.delegationScreenNationalId,
                    ) + formatKennitala(delegation.from.nationalId)
                  }
                  cta={{
                    label:
                      screenData.screenType === SCREEN_TYPE.ON_GOING
                        ? formatMessage(coreMessages.buttonNext)
                        : screenData.screenType === SCREEN_TYPE.NEW
                        ? formatMessage(
                            coreDelegationsMessages.delegationActionCardButton,
                          )
                        : formatMessage(
                            coreDelegationsMessages.delegationErrorButton,
                          ),
                    variant: 'text',
                    size: 'medium',
                    onClick: () => handleClick(delegation.from.nationalId),
                  }}
                />
              ))}
            </Stack>
          </Box>
        </GridContainer>
      </Page>
    )
  }
}
