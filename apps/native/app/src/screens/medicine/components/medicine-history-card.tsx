import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { Image } from 'react-native'
import styled from 'styled-components/native'
import clockIcon from '../../../assets/icons/clock.png'
import { HealthDirectorateMedicineHistoryItem } from '../../../graphql/types/schema'
import { navigateTo } from '../../../lib/deep-linking'
import { theme, Typography } from '../../../ui'
import chevronForward from '../../../assets/icons/chevron-forward.png'

const Card = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[2]}px;
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.color.blue200};
  border-radius: ${({ theme }) => theme.border.radius.large};
`

const CardLeft = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing[1]}px;
`

const CardHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.smallGutter}px;
`

const CardRight = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]}px;
`

const Icon = styled(Image)<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
`

type MedicineHistoryCardProps = {
  medicine: HealthDirectorateMedicineHistoryItem
}

export function MedicineHistoryCard({ medicine }: MedicineHistoryCardProps) {
  const intl = useIntl()
  const handlePress = useCallback(() => {
    navigateTo('/prescriptions/medicine-history', {
      medicine,
    })
  }, [medicine])

  return (
    <Card onPress={handlePress}>
      <CardLeft>
        <CardHeaderRow>
          <Icon source={clockIcon} size={theme.spacing[2]} />
          <Typography variant="body3">
            {medicine.lastDispensationDate
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
              : ''}
          </Typography>
        </CardHeaderRow>
        <Typography variant="heading5">{medicine.name}</Typography>
      </CardLeft>
      <CardRight>
        <Typography variant="body3">
          {intl.formatMessage(
            {
              id: 'health.prescriptions.dispensationCount',
            },
            { count: medicine.dispensationCount?.toString() ?? '' },
          )}
        </Typography>
        <Icon source={chevronForward} size={theme.spacing[3]} />
      </CardRight>
    </Card>
  )
}
