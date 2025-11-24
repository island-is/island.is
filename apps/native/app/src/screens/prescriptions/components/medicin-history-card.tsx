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
import { ExpandableCard, Typography } from '../../../ui'
import checkmarkIcon from '../../../ui/assets/icons/check.png'
import { capitalize } from '../../../utils/capitalize'

const TableRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: ${({ theme }) => theme.spacing[2]}px;
  padding-bottom: ${({ theme }) => theme.spacing[2]}px;
  border-bottom-color: ${({ theme }) => theme.color.blue200};
  border-bottom-width: 1px;
`
const RowItem = styled.View`
  margin-horizontal: ${({ theme }) => theme.spacing[1]}px;
  width: 40%;
  flex: 1;
`

const TableHeader = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

const DispensationRowItem = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  margin-horizontal: ${({ theme }) => theme.spacing[1]}px;
`

const DispensationCheckmark = styled.View`
  max-width: 15%;
  padding-right: ${({ theme }) => theme.spacing[2]}px;
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

  const [
    getDispensationForAtc,
    { data: atcData, loading: atcLoading, error: atcError },
  ] = useGetMedicineDispensationForAtcLazyQuery({
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
      title={`Síðast afgreitt: ${
        medicine.lastDispensationDate
          ? intl.formatDate(medicine.lastDispensationDate)
          : ''
      }`}
      message={medicine.name}
      icon={chevronDown}
      onPress={() => setOpen(!open)}
      open={open}
      topRightValue={
        <Typography variant="body3">
          Afgreiðslur: {medicine.dispensationCount?.toString() ?? ''}
        </Typography>
      }
    >
      <View style={{ width: '100%', padding: theme.spacing[2] }}>
        <View>
          <Typography variant="eyebrow">Lyf er notað við:</Typography>
          <Typography variant="body3">
            {capitalize(medicine.indication ?? '')}
          </Typography>
        </View>
        <View style={{ marginTop: theme.spacing[2] }}>
          {dispensations.data.length > 0 ? (
            <>
              <Typography variant="eyebrow">Afgreiðslur:</Typography>
              {dispensations.data.map(
                (
                  item: HealthDirectorateMedicineHistoryDispensation,
                  visibleIndex,
                ) => (
                  <TableRow
                    key={visibleIndex}
                    style={{
                      backgroundColor:
                        visibleIndex % 2 === 0
                          ? theme.color.blue100
                          : theme.color.white,
                      paddingTop: theme.spacing[1],
                      paddingBottom: theme.spacing[1],
                    }}
                  >
                    <DispensationRowItem>
                      <DispensationCheckmark>
                        <Image source={checkmarkIcon} />
                      </DispensationCheckmark>
                      <View>
                        <Typography variant="eyebrow">
                          {intl.formatMessage(
                            {
                              id: 'health.prescriptions.dispensationNumber',
                            },
                            { number: visibleIndex + 1 },
                          )}
                        </Typography>
                        <Typography variant="body">{item.name}</Typography>
                        <Typography variant="body3">
                          {`${intl.formatDate(item.date ?? '')}${
                            item.agentName ? ' - ' + item.agentName : ''
                          }${item.quantity ? ' - ' + item.quantity : ''}`}
                        </Typography>
                      </View>
                    </DispensationRowItem>
                  </TableRow>
                ),
              )}
            </>
          ) : (
            <Typography variant="body3">Engar afgreiðslur fundust</Typography>
          )}
        </View>
      </View>
      <Pressable
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: theme.spacing[2],
          margin: theme.spacing[2],
          backgroundColor: theme.color.blue100,
          borderRadius: theme.border.radius.standard,
          borderWidth: 1,
          borderColor: theme.color.blue200,
          opacity: atcLoading || dispensations.fullyLoaded ? 0.5 : 1,
        }}
        disabled={atcLoading || dispensations.fullyLoaded}
        onPress={() => {
          if (medicine.atcCode) {
            getDispensationForAtc({
              variables: {
                input: { atcCode: medicine.atcCode },
              },
            })
          }
        }}
      >
        <Typography variant="body3">Ná í fleiri afgreiðslur</Typography>
      </Pressable>
    </ExpandableCard>
  )
}
