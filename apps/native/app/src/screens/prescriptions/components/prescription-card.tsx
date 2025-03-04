import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { ExpandableCard, Skeleton, Typography, dynamicColor } from '../../../ui'
import chevronDown from '../../../assets/icons/chevron-down.png'
import clockIcon from '../../../assets/icons/clock.png'
import { HealthDirectoratePrescription } from '../../../graphql/types/schema'
import { capitalizeEveryWord } from '../../../utils/capitalize'

const Row = styled.View<{ border?: boolean }>`
  flex-direction: row;
  flex-wrap: wrap;
  border-bottom-color: ${dynamicColor(({ theme }) => ({
    light: theme.color.blue100,
    dark: theme.shades.dark.shade300,
  }))};
  border-bottom-width: ${({ border }) => (border ? 1 : 0)}px;
`

const Cell = styled.View`
  margin-right: ${({ theme }) => theme.spacing[1]}px;
  margin-left: ${({ theme }) => theme.spacing[1]}px;
  margin-top: ${({ theme }) => theme.spacing.smallGutter}px;
  margin-bottom: ${({ theme }) => theme.spacing.smallGutter}px;
`

const TableRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: ${({ theme }) => theme.spacing[2]}px;
  padding-bottom: ${({ theme }) => theme.spacing[2]}px;
  border-bottom-color: ${dynamicColor(({ theme }) => ({
    light: theme.color.blue200,
    dark: theme.shades.dark.shade300,
  }))};
  border-bottom-width: 1px;
`
const RowItem = styled.View`
  margin-right: ${({ theme }) => theme.spacing[1]}px;
  margin-left: ${({ theme }) => theme.spacing[1]}px;
  width: 40%;
  flex: 1;
`

const TableHeader = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

export function PrescriptionCard({
  prescription,
  loading,
}: {
  prescription: HealthDirectoratePrescription
  loading: boolean
}) {
  const intl = useIntl()
  const theme = useTheme()
  const [open, setOpen] = useState(false)

  const isExpired =
    prescription.expiryDate && new Date(prescription.expiryDate) < new Date()

  const prescriptionDataInformation = [
    {
      data: prescription.name
        ? capitalizeEveryWord(prescription.name)
        : undefined,
      label: 'health.prescriptions.drug',
    },
    {
      data: prescription.type,
      label: 'health.prescriptions.type',
    },
    {
      data: prescription.indication,
      label: 'health.prescriptions.indication',
    },
    {
      data: prescription.quantity
        ? intl.formatMessage(
            { id: 'health.prescriptions.quantityUnit' },
            { quantity: prescription.quantity },
          )
        : undefined,
      label: 'health.prescriptions.quantity',
    },
    {
      data: prescription.dosageInstructions,
      label: 'health.prescriptions.dosageInstructions',
    },
  ]

  const prescriptionDataIssuedBy = [
    {
      data: prescription.issueDate
        ? intl.formatDate(prescription.issueDate)
        : undefined,
      label: 'health.prescriptions.issueDate',
    },
    {
      data: prescription.expiryDate
        ? intl.formatDate(prescription.expiryDate)
        : undefined,
      label: 'health.prescriptions.expiresAt',
    },
    {
      data: prescription.prescriberName,
      label: 'health.prescriptions.doctor',
    },
  ]

  return (
    <ExpandableCard
      title={
        isExpired
          ? intl.formatMessage({
              id: 'health.prescriptionsAndCertificates.expired',
            })
          : prescription.expiryDate
          ? intl.formatMessage(
              { id: 'health.prescriptionsAndCertificates.validTo' },
              { date: intl.formatDate(prescription.expiryDate) },
            )
          : undefined
      }
      titleColor={isExpired ? theme.color.red600 : undefined}
      titleIcon={clockIcon}
      topRightValue={
        prescription?.amountRemaining
          ? intl.formatMessage(
              { id: 'health.prescriptions.amountRemaining' },
              { amountRemaining: prescription.amountRemaining },
            )
          : prescription?.amountRemaining === '0' ||
            prescription?.amountRemaining === '0 pk'
          ? intl.formatMessage({ id: 'health.prescriptions.fullyUsed' })
          : undefined
      }
      message={
        prescription.name ? capitalizeEveryWord(prescription.name) : undefined
      }
      icon={chevronDown}
      onPress={() => {
        setOpen((isOpen) => !isOpen)
      }}
      open={open}
    >
      <View style={{ width: '100%', padding: theme.spacing[2] }}>
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Row key={index}>
              <Cell style={{ flex: 1 }}>
                <Skeleton height={18} />
              </Cell>
            </Row>
          ))
        ) : (
          <View>
            <TableHeader>
              <Typography variant="eyebrow">
                <FormattedMessage id="health.prescriptionsAndCertificates.furtherInformation" />
              </Typography>
            </TableHeader>
            {prescriptionDataInformation
              .filter((item) => item.data)
              .map((item, visibleIndex) => (
                <TableRow
                  key={visibleIndex}
                  style={{
                    backgroundColor:
                      visibleIndex % 2 === 0
                        ? theme.color.blue100
                        : theme.color.white,
                  }}
                >
                  <RowItem>
                    <Typography variant="eyebrow">
                      <FormattedMessage id={item.label} />
                    </Typography>
                  </RowItem>
                  <RowItem>
                    <Typography variant="body3">{item.data}</Typography>
                  </RowItem>
                </TableRow>
              ))}
          </View>
        )}
      </View>
    </ExpandableCard>
  )
}
