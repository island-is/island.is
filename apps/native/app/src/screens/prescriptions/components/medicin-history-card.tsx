import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Image, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import chevronDown from '../../../assets/icons/chevron-down.png'
import { Pressable } from '../../../components/pressable/pressable'
import {
  HealthDirectorateMedicineHistoryDispensation,
  HealthDirectorateMedicineHistoryItem,
  useGetMedicineDispensationForAtcLazyQuery,
} from '../../../graphql/types/schema'
import { navigateTo } from '../../../lib/deep-linking'
import { Badge, Button, ExpandableCard, Loader, Typography } from '../../../ui'
import arrowRightIcon from '../../../ui/assets/icons/arrow.png'
import checkmarkIcon from '../../../ui/assets/icons/check.png'

const TableRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: ${({ theme }) => theme.spacing[2]}px;
  padding-bottom: ${({ theme }) => theme.spacing[2]}px;
  border-bottom-color: ${({ theme }) => theme.color.blue200};
  border-bottom-width: 1px;
`

const NoDispensations = styled.View`
  padding: ${({ theme }) => theme.spacing[3]}px;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]}px;
  border-width: ${({ theme }) => theme.border.width.standard}px;
  border-color: ${({ theme }) => theme.color.blue200};
  border-radius: ${({ theme }) => theme.border.radius.large};
`
const RowItem = styled.View`
  margin-horizontal: ${({ theme }) => theme.spacing[1]}px;
  width: 40%;
  flex: 1;
`

const DispensationHeader = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]}px;
  margin-vertical: ${({ theme }) => theme.spacing[1]}px;
`

const DispensationCheckmark = styled.View`
  max-width: 15%;
  padding-right: ${({ theme }) => theme.spacing[2]}px;
`

const MoreInfoLink = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.color.blue400};
  align-self: center;
  margin-vertical: ${({ theme }) => theme.spacing[2]}px;
`

const Loading = styled.View`
  margin-top: ${({ theme }) => theme.spacing[2]}px;
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
  align-self: center;
`

type MedicineHistoryCardProps = {
  medicine: HealthDirectorateMedicineHistoryItem
}

export function MedicineHistoryCard({ medicine }: MedicineHistoryCardProps) {
  const intl = useIntl()
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const [dispensations, setDispensations] = useState<{
    data: HealthDirectorateMedicineHistoryDispensation[]
    fullyLoaded: boolean
  }>({
    data: medicine.dispensations ?? [],
    fullyLoaded:
      (medicine?.dispensationCount ?? 0) <=
        (medicine.dispensations?.length ?? 0) || false,
  })

  const [getDispensationForAtc, { data: atcData, loading: atcLoading }] =
    useGetMedicineDispensationForAtcLazyQuery({
      fetchPolicy: 'no-cache',
    })

  useEffect(() => {
    if (atcData) {
      setDispensations({
        data: atcData.healthDirectorateMedicineDispensationsATC.dispensations,
        fullyLoaded: true,
      })
    }
  }, [atcData])

  return (
    <ExpandableCard
      title={
        medicine.lastDispensationDate
          ? intl.formatMessage(
              {
                id: 'health.prescriptions.lastDispensationDate',
              },
              {
                date: medicine.lastDispensationDate
                  ? intl.formatDate(medicine.lastDispensationDate)
                  : '',
              },
            )
          : undefined
      }
      message={medicine.name}
      icon={chevronDown}
      onPress={() => setOpen(!open)}
      open={open}
      topRightValue={
        <Typography variant="body3">
          {intl.formatMessage(
            {
              id: 'health.prescriptions.dispensationCount',
            },
            { count: medicine.dispensationCount?.toString() ?? '' },
          )}
        </Typography>
      }
    >
      <View style={{ width: '100%', padding: theme.spacing[2] }}>
        <View style={{ marginTop: theme.spacing[2] }}>
          {dispensations.data.length > 0 ? (
            <>
              {dispensations.data.map((dispensation, index) => (
                <View key={`${dispensation.id}-${index}`}>
                  <DispensationHeader>
                    <Typography variant="eyebrow">
                      {intl.formatMessage(
                        {
                          id: 'health.prescriptions.completedDispensation',
                        },
                        { number: index + 1 },
                      )}
                    </Typography>
                    <DispensationCheckmark>
                      <Image
                        source={checkmarkIcon}
                        style={{ width: 16, height: 16 }}
                      />
                    </DispensationCheckmark>
                  </DispensationHeader>
                  <TableRow
                    style={{
                      backgroundColor: theme.color.blue100,
                    }}
                  >
                    <RowItem>
                      <Typography variant="eyebrow">
                        {intl.formatMessage({
                          id: 'health.prescriptions.history.table.date',
                        })}
                      </Typography>
                    </RowItem>
                    <RowItem>
                      <Typography variant="body3">
                        {dispensation.date
                          ? intl.formatDate(dispensation.date)
                          : ''}
                      </Typography>
                    </RowItem>
                  </TableRow>
                  <TableRow>
                    <RowItem>
                      <Typography variant="eyebrow">
                        {intl.formatMessage({
                          id: 'health.prescriptions.history.table.dispensery',
                        })}
                      </Typography>
                    </RowItem>
                    <RowItem>
                      <Typography variant="body3">
                        {dispensation.agentName}
                      </Typography>
                    </RowItem>
                  </TableRow>
                  <TableRow style={{ backgroundColor: theme.color.blue100 }}>
                    <RowItem>
                      <Typography variant="eyebrow">
                        {intl.formatMessage({
                          id: 'health.prescriptions.history.table.drug',
                        })}
                      </Typography>
                    </RowItem>
                    <RowItem>
                      <Typography variant="body3">
                        {dispensation.name}
                      </Typography>
                    </RowItem>
                  </TableRow>
                  <TableRow>
                    <RowItem>
                      <Typography variant="eyebrow">
                        {intl.formatMessage({
                          id: 'health.prescriptions.history.table.quantity',
                        })}
                      </Typography>
                    </RowItem>
                    <RowItem>
                      <Typography variant="body3">
                        {dispensation.quantity}
                      </Typography>
                    </RowItem>
                  </TableRow>
                  <Pressable
                    onPress={() => {
                      navigateTo('/prescriptions/dispensation', {
                        dispensation,
                        number: index + 1,
                      })
                    }}
                  >
                    <MoreInfoLink>
                      <Typography variant="eyebrow" color={theme.color.blue400}>
                        {intl.formatMessage({
                          id: 'health.prescriptions.history.table.moreInfo',
                        })}
                      </Typography>
                      <Image
                        source={arrowRightIcon}
                        style={{
                          width: 12,
                          height: 12,
                        }}
                      />
                    </MoreInfoLink>
                  </Pressable>
                </View>
              ))}

              {atcLoading ? (
                <Loading>
                  <Loader />
                </Loading>
              ) : (
                <Button
                  isUtilityButton
                  isOutlined
                  disabled={atcLoading || dispensations.fullyLoaded}
                  title={intl.formatMessage({
                    id: 'health.prescriptions.fetchMoreDispensations',
                  })}
                  compactPadding
                  style={{
                    alignSelf: 'center',
                    marginBottom: theme.spacing[2],
                  }}
                  onPress={() => {
                    if (medicine.atcCode) {
                      getDispensationForAtc({
                        variables: {
                          input: { atcCode: medicine.atcCode },
                        },
                      })
                    }
                  }}
                />
              )}
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
      </View>
    </ExpandableCard>
  )
}
