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
import { format as formatKennitala } from 'kennitala'
import { useLocale } from '@island.is/localization'
import { useHistory } from 'react-router-dom'
import { ScreenType, DelegationsScreenDataType, Delegation } from '../types'
import { FeatureFlagClient, Features } from '@island.is/feature-flags'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'
interface DelegationsScreenProps {
  alternativeSubjects?: { nationalId: string }[]
  checkDelegation: Dispatch<SetStateAction<boolean>>
  slug: string
}

export const DelegationsScreen = ({
  slug,
  alternativeSubjects,
  checkDelegation,
}: DelegationsScreenProps) => {
  const [screenData, setScreenData] = useState<DelegationsScreenDataType>({
    screenType: ScreenType.LOADING,
  })
  const { formatMessage } = useLocale()
  const type = getTypeFromSlug(slug)
  const { switchUser, userInfo: user } = useAuth()
  const history = useHistory()
  const featureFlagClient: FeatureFlagClient = useFeatureFlagClient()

  // Check for user delegations if application supports delegations
  const { data: delegations, error } = useQuery(ACTOR_DELEGATIONS, {
    variables: { input: { delegationTypes: screenData.allowedDelegations } },
    skip: !alternativeSubjects && !screenData.allowedDelegations,
  })
  // if error with fetching delegations set handle like application that does not support delegations
  useEffect(() => {
    if (error) {
      checkDelegation(true)
    }
  }, [error, checkDelegation])

  // Check whether application supports delegations
  useEffect(() => {
    async function applicationSupportsDelegations() {
      if (type) {
        const template = await getApplicationTemplateByTypeId(type)
        const featureFlagEnabled = await featureFlagClient.getValue(
          Features.applicationSystemDelegations,
          false,
        )
        if (template.allowedDelegations && featureFlagEnabled) {
          setScreenData((prev) => ({
            ...prev,
            allowedDelegations: template.allowedDelegations,
          }))
        } else {
          if (user?.profile.actor) {
            setScreenData({
              screenType: ScreenType.NOT_SUPPORTED,
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
  }, [
    type,
    user?.profile.actor,
    switchUser,
    checkDelegation,
    featureFlagClient,
  ])

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
          setScreenData((prev) => ({
            ...prev,
            screenType: ScreenType.ONGOING,
            authDelegations: [found],
          }))
        } else {
          setScreenData((prev) => ({
            ...prev,
            screenType: ScreenType.NEW,
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
          }))
        }
      }
    }
  }, [
    delegations,
    screenData.allowedDelegations,
    alternativeSubjects,
    checkDelegation,
    user,
  ])

  const handleClick = (nationalId?: string) => {
    if (screenData.screenType !== ScreenType.ONGOING) {
      history.push('?delegationChecked=true')
    }
    if (nationalId) {
      switchUser(nationalId)
    } else {
      checkDelegation(true)
    }
  }

  const screenTexts = {
    title: formatMessage(
      screenData.screenType === ScreenType.ONGOING
        ? coreDelegationsMessages.delegationScreenTitleForOngoingApplication
        : screenData.screenType === ScreenType.NEW
        ? coreDelegationsMessages.delegationScreenTitle
        : coreDelegationsMessages.delegationScreenTitleApplicationNoDelegationSupport,
    ),
    subtitle: formatMessage(
      screenData.screenType === ScreenType.ONGOING
        ? coreDelegationsMessages.delegationScreenSubtitleForOngoingApplication
        : screenData.screenType === ScreenType.NEW
        ? coreDelegationsMessages.delegationScreenSubtitle
        : coreDelegationsMessages.delegationScreenSubtitleApplicationNoDelegationSupport,
    ),
    actionCardCtaLabel: formatMessage(
      screenData.screenType === ScreenType.ONGOING
        ? coreMessages.buttonNext
        : screenData.screenType === ScreenType.NEW
        ? coreDelegationsMessages.delegationActionCardButton
        : coreDelegationsMessages.delegationErrorButton,
    ),
  }

  return (
    <Page>
      <GridContainer>
        {screenData.screenType === ScreenType.LOADING ? (
          <LoadingShell />
        ) : (
          <Box>
            <Box marginTop={5} marginBottom={5}>
              <Text marginBottom={2} variant="h1">
                {screenTexts.title}
              </Text>
              <Text>{screenTexts.subtitle}</Text>
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
                    label: screenTexts.actionCardCtaLabel,
                    variant: 'text',
                    size: 'medium',
                    onClick: () => handleClick(delegation.from.nationalId),
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}
      </GridContainer>
    </Page>
  )
}
