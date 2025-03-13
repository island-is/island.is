import { useQuery } from '@apollo/client'
import {
  coreDelegationsMessages,
  coreMessages,
  getTypeFromSlug,
} from '@island.is/application/core'
import { ACTOR_DELEGATIONS } from '@island.is/application/graphql'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import { FeatureFlagClient, Features } from '@island.is/feature-flags'
import {
  Box,
  GridContainer,
  Icon,
  Page,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useAuth } from '@island.is/react-spa/bff'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'
import * as kennitala from 'kennitala'
import { format as formatKennitala } from 'kennitala'
import intersection from 'lodash/intersection'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Delegation, DelegationsScreenDataType, ScreenType } from '../types'
import * as styles from './DelegationsScreen.css'
import { LoadingShell } from './LoadingShell'

enum DelegationType {
  LegalGuardian = 'LegalGuardian',
  ProcurationHolder = 'ProcurationHolder',
  PersonalRepresentative = 'PersonalRepresentative',
  Custom = 'Custom',
}

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
  const featureFlagClient: FeatureFlagClient = useFeatureFlagClient()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const paramString = searchParams.size
    ? '&' +
      Array.from(searchParams.entries())
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&')
    : ''

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
    const applicationSupportsDelegations = async () => {
      if (type) {
        const template = await getApplicationTemplateByTypeId(type)
        const featureFlagEnabled = await featureFlagClient.getValue(
          Features.applicationSystemDelegations,
          false,
        )

        const allowedDelegations: string[] = []
        if (template.allowedDelegations) {
          for (let i = 0; i < template.allowedDelegations.length; i++) {
            const d = template.allowedDelegations[i]
            if (
              !d.featureFlag ||
              (await featureFlagClient.getValue(d.featureFlag, false))
            ) {
              allowedDelegations.push(d.type)
            }
          }
        }

        if (allowedDelegations.length > 0 && featureFlagEnabled) {
          setScreenData((prev) => ({
            ...prev,
            allowedDelegations: allowedDelegations,
          }))
        } else {
          if (user?.profile.actor) {
            setScreenData({
              screenType: ScreenType.NOT_SUPPORTED,
              authDelegations: [
                {
                  types: ['user'],
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
      const authActorDelegations: Delegation[] =
        delegations.authActorDelegations.filter(
          (delegation: Delegation) =>
            intersection(screenData.allowedDelegations, delegation.types)
              .length > 0,
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
                types: ['user'],
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
    if (screenData.screenType !== ScreenType.ONGOING && nationalId) {
      navigate(`?delegationChecked=true${paramString}`)
      switchUser(nationalId)
    } else if (nationalId) {
      switchUser(nationalId)
    } else {
      checkDelegation(true)
    }
  }

  const screenTexts = {
    title: formatMessage(
      screenData.screenType === ScreenType.ONGOING
        ? screenData.templateName ||
            coreDelegationsMessages.delegationScreenTitleForOngoingApplication
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

  const currentUser = screenData.authDelegations?.slice(0, 1)
  const otherUsers = screenData.authDelegations?.slice(1)

  const companyDelegations = otherUsers?.filter((delegation: Delegation) =>
    kennitala.isCompany(delegation.from.nationalId),
  )

  const personDelegations = otherUsers?.filter((delegation: Delegation) =>
    kennitala.isPerson(delegation.from.nationalId),
  )

  return (
    <Page>
      <GridContainer>
        {screenData.screenType === ScreenType.LOADING ? (
          <LoadingShell />
        ) : (
          <Box paddingX="p5" className={styles.delegationContainer}>
            <Box textAlign="center" marginTop={5} marginBottom={5}>
              <Text marginBottom={2} variant="h1">
                {screenTexts.title}
              </Text>
              <Text>{screenTexts.subtitle}</Text>
            </Box>
            <DelegationList
              handleClick={handleClick}
              delegations={currentUser}
            />
            <DelegationList
              isPerson={true}
              handleClick={handleClick}
              delegations={personDelegations}
              header={formatMessage(coreDelegationsMessages.delegationPersons)}
            />
            <DelegationList
              isPerson={false}
              handleClick={handleClick}
              delegations={companyDelegations}
              header={formatMessage(
                coreDelegationsMessages.delegationCompanies,
              )}
            />
          </Box>
        )}
      </GridContainer>
    </Page>
  )
}

type DelegationListProps = {
  isPerson?: boolean
  header?: string
  delegations?: Delegation[]
  handleClick: (nationalId: string) => void
}

const DelegationList = ({
  header,
  delegations,
  handleClick,
  isPerson,
}: DelegationListProps) => (
  <>
    {header && delegations && delegations?.length > 0 && (
      <Box textAlign="center" marginY={1}>
        <Text fontWeight="semiBold" variant="medium">
          {header}
        </Text>
      </Box>
    )}
    {delegations && delegations?.length > 0 && (
      <Stack space={2}>
        {delegations?.map((delegation: Delegation, idx: number) => (
          <DelegationItem
            key={`delegation-${delegation.from.nationalId}-item-${idx}`}
            name={delegation.from.name}
            nationalId={delegation.from.nationalId}
            handleClick={handleClick}
            type={delegation.types[0] as DelegationType}
            isPerson={isPerson}
          />
        ))}
      </Stack>
    )}
  </>
)

type DelegationItemProps = {
  isPerson?: boolean
  name: string
  nationalId: string
  type?: DelegationType
  handleClick: (nationalId: string) => void
}

const DelegationItem = ({
  name,
  nationalId,
  type,
  handleClick,
  isPerson,
}: DelegationItemProps) => {
  const { formatMessage } = useLocale()
  const getIcon = () => {
    if (isPerson === true) {
      return <Icon icon="people" type="outline" size="small" color="blue400" />
    }
    if (isPerson === false) {
      return (
        <Icon icon="business" type="outline" size="small" color="blue400" />
      )
    }
    return null
  }

  const getType = () => {
    if (type === DelegationType.Custom)
      return (
        <Text fontWeight="semiBold" color="blue400" variant="small">
          {formatMessage(coreDelegationsMessages.custom)}
        </Text>
      )
    if (type === DelegationType.LegalGuardian)
      return (
        <Text fontWeight="semiBold" color="blue400" variant="small">
          {formatMessage(coreDelegationsMessages.legalGuardian)}
        </Text>
      )
    if (type === DelegationType.PersonalRepresentative)
      return (
        <Text fontWeight="semiBold" color="blue400" variant="small">
          {formatMessage(coreDelegationsMessages.personalRepresentative)}
        </Text>
      )
    if (type === DelegationType.ProcurationHolder)
      return (
        <Text fontWeight="semiBold" color="blue400" variant="small">
          {formatMessage(coreDelegationsMessages.procurationHolder)}
        </Text>
      )
    return null
  }

  return (
    <Box textAlign="center">
      <button
        aria-label={name}
        onClick={() => handleClick(nationalId)}
        className={styles.buttonStyle}
      >
        <Box display="flex" alignItems="center">
          {getIcon()}
          <Box marginLeft={1}>{getType()}</Box>
        </Box>
        <Text marginBottom="smallGutter" variant="h4">
          {name}
        </Text>
        <Text variant="small">{formatKennitala(nationalId)}</Text>
      </button>
    </Box>
  )
}
