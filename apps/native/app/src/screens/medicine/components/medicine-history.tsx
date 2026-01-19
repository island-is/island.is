import React, { useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import { RefreshControl, ScrollView, View } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled, { useTheme } from 'styled-components/native'

import {
  HealthDirectorateMedicineHistoryDispensation,
  HealthDirectorateMedicineHistoryItem,
  useGetMedicineDispensationForAtcQuery,
} from '../../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../../hooks/create-navigation-option-hooks'
import { navigateTo } from '../../../lib/deep-linking'
import { Badge, Problem, Typography } from '../../../ui'

const Host = styled.View`
  flex: 1;
`

const DispensationRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-vertical: ${({ theme }) => theme.spacing[2]}px;
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.color.blue200};
`

const DispensationInfo = styled.View`
  flex: 1;
  margin-right: ${({ theme }) => theme.spacing[2]}px;
`

const DispensationMetaText = styled(Typography)`
  margin-bottom: ${({ theme }) => theme.spacing[1]}px;
`

const MoreLink = styled.TouchableOpacity`
  align-self: center;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.color.blue400};
`

const MoreLinkText = styled(Typography)`
  padding-bottom: 2px;
`

const NoDispensations = styled.View`
  padding: ${({ theme }) => theme.spacing[3]}px;
  margin: ${({ theme }) => theme.spacing[2]}px;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]}px;
  border-width: ${({ theme }) => theme.border.width.standard}px;
  border-color: ${({ theme }) => theme.color.blue200};
  border-radius: ${({ theme }) => theme.border.radius.large};
`

const SkeletonLine = styled.View<{ width: number }>`
  height: 12px;
  width: ${({ width }) => width}%;
  background-color: ${({ theme }) => theme.color.blue100};
  border-radius: ${({ theme }) => theme.border.radius.large}px;
  margin-bottom: ${({ theme }) => theme.spacing[1]}px;
`

const ProblemContainer = styled.View`
  margin: ${({ theme }) => theme.spacing[2]}px;
`

type Props = {
  medicine: HealthDirectorateMedicineHistoryItem
}

const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks((_, intl) => ({
    topBar: {
      title: {
        text: intl.formatMessage({
          id: 'health.prescriptions.dispensations',
        }),
      },
    },
    bottomTabs: {
      visible: false,
      drawBehind: true,
    },
  }))

export const MedicineHistoryScreen: NavigationFunctionComponent<Props> = ({
  componentId,
  medicine,
}) => {
  useNavigationOptions(componentId)
  const intl = useIntl()
  const theme = useTheme()

  const [refetching, setRefetching] = useState(false)

  const {
    data: atcData,
    loading: atcLoading,
    refetch,
    error: atcError,
  } = useGetMedicineDispensationForAtcQuery({
    fetchPolicy: 'no-cache',
    variables: {
      input: {
        atcCode: medicine.atcCode ?? '',
      },
    },
    skip: !medicine.atcCode,
  })

  const dispensations: HealthDirectorateMedicineHistoryDispensation[] =
    atcData?.healthDirectorateMedicineDispensationsATC.dispensations ?? []

  const onRefresh = useCallback(async () => {
    if (!medicine.atcCode) {
      return
    }

    setRefetching(true)
    try {
      await refetch()
    } catch (e) {
      // noop
    } finally {
      setRefetching(false)
    }
  }, [medicine.atcCode, refetch])

  if (!medicine) {
    return null
  }

  return (
    <Host>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refetching} onRefresh={onRefresh} />
        }
      >
        <View style={{ marginTop: theme.spacing[2] }}>
          {atcError && !atcData ? (
            <ProblemContainer>
              <Problem error={atcError} />
            </ProblemContainer>
          ) : atcLoading && !dispensations.length ? (
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <DispensationRow key={`skeleton-${index}`}>
                  <DispensationInfo>
                    <SkeletonLine width={40} />
                    <SkeletonLine width={70} />
                    <SkeletonLine width={30} />
                  </DispensationInfo>
                </DispensationRow>
              ))}
            </>
          ) : dispensations.length > 0 ? (
            <>
              {dispensations.map((dispensation, index) => (
                <DispensationRow key={`${dispensation.id}-${index}`}>
                  <DispensationInfo>
                    <DispensationMetaText variant="body3">
                      {[
                        dispensation.date
                          ? intl.formatDate(dispensation.date)
                          : null,
                        dispensation.agentName,
                      ]
                        .filter(Boolean)
                        .join(' – ')}
                    </DispensationMetaText>
                    <Typography variant="heading5">
                      {dispensation.name}
                    </Typography>
                    <Typography variant="body">
                      {dispensation.quantity}
                    </Typography>
                  </DispensationInfo>
                  <MoreLink
                    onPress={() => {
                      navigateTo('/prescriptions/dispensation', {
                        dispensation,
                        number: index + 1,
                      })
                    }}
                  >
                    <MoreLinkText
                      weight={600}
                      variant="body3"
                      color={theme.color.blue400}
                    >
                      {intl.formatMessage({
                        id: 'health.prescriptions.history.table.moreInfo',
                      })}
                    </MoreLinkText>
                  </MoreLink>
                </DispensationRow>
              ))}
            </>
          ) : (
            <NoDispensations>
              <Badge
                variant="blue"
                title={intl.formatMessage({
                  id: 'health.vaccinations.directorateOfHealth',
                })}
              />
              <Typography
                variant="heading5"
                textAlign="center"
                style={{ marginTop: theme.spacing[1] }}
              >
                {intl.formatMessage({
                  id: 'health.prescriptions.noDispensations',
                  defaultMessage: 'Engar afgreiðslur fundust',
                })}
              </Typography>
              <Typography variant="body3" textAlign="center">
                {intl.formatMessage({
                  id: 'health.prescriptions.noDispensationsDescription',
                  defaultMessage:
                    'Ef þú telur þig eiga gögn sem ættu að birtast hér, vinsamlegast hafðu samband við þjónustuaðila.',
                })}
              </Typography>
            </NoDispensations>
          )}
        </View>
      </ScrollView>
    </Host>
  )
}

MedicineHistoryScreen.options = getNavigationOptions
