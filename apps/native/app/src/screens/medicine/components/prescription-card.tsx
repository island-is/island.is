import React, { useCallback, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Image, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import chevronDown from '../../../assets/icons/chevron-down.png'
import clockIcon from '../../../assets/icons/clock.png'
import { HealthDirectoratePrescription } from '../../../graphql/types/schema'
import { ExpandableCard, Typography } from '../../../ui'
import checkmarkIcon from '../../../ui/assets/icons/check.png'
import { capitalizeEveryWord } from '../../../utils/capitalize'

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

type PrescriptionCardProps = {
  prescription: HealthDirectoratePrescription
}

export const PrescriptionCard = ({ prescription }: PrescriptionCardProps) => {
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

  const onPress = useCallback(() => {
    setOpen((isOpen) => !isOpen)
  }, [])

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
        prescription?.amountRemaining && prescription?.amountRemaining
      }
      message={
        prescription.name ? capitalizeEveryWord(prescription.name) : undefined
      }
      icon={chevronDown}
      onPress={onPress}
      open={open}
    >
      <View style={{ width: '100%', padding: theme.spacing[2] }}>
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
          {prescriptionDataIssuedBy.length && (
            <>
              <TableHeader style={{ marginTop: theme.spacing[3] }}>
                <Typography variant="eyebrow">
                  <FormattedMessage id="health.prescriptions.issueInformation" />
                </Typography>
              </TableHeader>
              {prescriptionDataIssuedBy
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
            </>
          )}
          {!prescription?.dispensations?.length ? null : (
            <>
              <TableHeader style={{ marginTop: theme.spacing[3] }}>
                <Typography variant="eyebrow">
                  <FormattedMessage id="health.prescriptions.dispensations" />
                </Typography>
              </TableHeader>
              {prescription.dispensations.map((item, visibleIndex) => (
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
                      <Typography variant="body3">
                        {`${intl.formatDate(item.date)}${
                          item.agentName ? ' - ' + item.agentName : ''
                        }${
                          item.items?.[0]?.amount
                            ? ' - ' + item.items[0].amount
                            : ''
                        }`}
                      </Typography>
                    </View>
                  </DispensationRowItem>
                </TableRow>
              ))}
            </>
          )}
        </View>
      </View>
    </ExpandableCard>
  )
}
