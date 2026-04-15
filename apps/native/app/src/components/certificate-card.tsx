import { useCallback, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import chevronDown from '@/assets/icons/chevron-down.png'
import clockIcon from '@/assets/icons/clock.png'
import { RightsPortalDrugCertificate } from '@/graphql/types/schema'
import { Badge, ExpandableCard, Typography } from '@/ui'

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

type CertificateCardProps = {
  certificate: RightsPortalDrugCertificate
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  const intl = useIntl()
  const theme = useTheme()
  const [open, setOpen] = useState(false)

  const isExpired =
    certificate.validTo && new Date(certificate.validTo) < new Date()

  const certificateData = [
    {
      data: certificate.drugName,
      label: 'health.drugCertificates.drugName',
    },
    {
      data: certificate.atcCode,
      label: 'health.drugCertificates.atcCode',
    },
    {
      data: certificate.atcName,
      label: 'health.drugCertificates.ingredients',
    },
    {
      data: certificate.validFrom && intl.formatDate(certificate.validFrom),
      label: 'health.drugCertificates.validFrom',
    },
    {
      data: certificate.validTo && intl.formatDate(certificate.validTo),
      label: 'health.drugCertificates.validUntil',
    },
    {
      data: certificate.doctor,
      label: 'health.drugCertificates.nameOfDoctor',
    },
    {
      data: certificate.methylDoctors?.map((doctor) => doctor.name).join(', '),
      label: 'health.drugCertificates.methylDoctors',
    },
    {
      data: certificate.rejected
        ? intl.formatMessage({
            id: 'health.prescriptionsAndCertificates.rejected',
          })
        : !certificate.processed
        ? intl.formatMessage({
            id: 'health.prescriptionsAndCertificates.inProcess',
          })
        : certificate.valid
        ? intl.formatMessage({
            id: 'health.prescriptionsAndCertificates.valid',
          })
        : certificate.expired
        ? intl.formatMessage({
            id: 'health.prescriptionsAndCertificates.expired',
          })
        : undefined,
      label: 'health.prescriptionsAndCertificates.status',
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
          : certificate.validTo
          ? intl.formatMessage(
              { id: 'health.prescriptionsAndCertificates.validTo' },
              { date: intl.formatDate(certificate.validTo) },
            )
          : undefined
      }
      titleColor={isExpired ? theme.color.red600 : undefined}
      titleIcon={clockIcon}
      topRightValue={certificate.drugName ? certificate.atcName : undefined}
      message={certificate.drugName ?? certificate.atcName}
      icon={chevronDown}
      value={
        certificate.rejected ? (
          <Badge
            variant={'red'}
            title={intl.formatMessage({
              id: 'health.prescriptionsAndCertificates.rejected',
            })}
            outlined
          />
        ) : !certificate.processed ? (
          <Badge
            variant={'darkerBlue'}
            title={intl.formatMessage({
              id: 'health.prescriptionsAndCertificates.inProcess',
            })}
            outlined
          />
        ) : undefined
      }
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
          {certificateData
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
      </View>
    </ExpandableCard>
  )
}
