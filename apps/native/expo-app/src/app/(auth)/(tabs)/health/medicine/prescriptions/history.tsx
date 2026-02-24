import React, { useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import { RefreshControl, ScrollView, View } from 'react-native'
import { Stack, useLocalSearchParams } from 'expo-router'
import styled, { useTheme } from 'styled-components/native'

import {
  HealthDirectorateMedicineHistoryDispensation,
  useGetMedicineDispensationForAtcQuery,
} from '@/graphql/types/schema'
import { Badge, Problem, Typography } from '@/ui'

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

export default function MedicineHistoryScreen() {
  const { atcCode } = useLocalSearchParams<{ atcCode: string }>()
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
        atcCode: atcCode ?? '',
      },
    },
    skip: !atcCode,
  })

  const dispensations: HealthDirectorateMedicineHistoryDispensation[] =
    atcData?.healthDirectorateMedicineDispensationsATC.dispensations ?? []

  const onRefresh = useCallback(async () => {
    if (!atcCode) {
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
  }, [atcCode, refetch])

  return (
    <Host>
      <Stack.Screen
        options={{
          title: intl.formatMessage({
            id: 'health.prescriptions.dispensations',
          }),
        }}
      />
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
