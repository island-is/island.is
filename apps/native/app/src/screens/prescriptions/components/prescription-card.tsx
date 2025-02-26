import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import {
  Badge,
  ExpandableCard,
  Skeleton,
  Typography,
  dynamicColor,
} from '../../../ui'
import chevronDown from '../../../assets/icons/chevron-down.png'
import clockIcon from '../../../assets/icons/clock.png'
import { HealthDirectoratePrescription } from '../../../graphql/types/schema'

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

  // const isExpired =
  //   prescription.validTo && new Date(prescription.validTo) < new Date()

  // const prescriptionData = [
  //   {
  //     data: prescription.dosageInstructions,
  //     label: 'health.prescriptions.dosageInstructions',
  //   },
  //   {
  //     data: prescription.atcName,
  //     label: 'health.prescriptions.ingredients',
  //   },
  //   {
  //     data: prescription.validFrom && intl.formatDate(prescription.validFrom),
  //     label: 'health.prescriptions.validFrom',
  //   },
  //   {
  //     data: prescription.validTo && intl.formatDate(prescription.validTo),
  //     label: 'health.prescriptions.validUntil',
  //   },
  //   {
  //     data: prescription.doctor,
  //     label: 'health.prescriptions.nameOfDoctor',
  //   },
  // ]

  return (
    <View></View>
    // <ExpandableCard
    //   title={
    //     isExpired
    //       ? intl.formatMessage({ id: 'health.prescriptions.expired' })
    //       : prescription.validTo
    //       ? intl.formatMessage(
    //           { id: 'health.prescriptions.validTo' },
    //           { date: intl.formatDate(prescription.validTo) },
    //         )
    //       : undefined
    //   }
    //   titleColor={isExpired ? theme.color.red600 : undefined}
    //   titleIcon={clockIcon}
    //   message={prescription.atcName}
    //   icon={chevronDown}
    //   value={
    //     prescription.rejected ? (
    //       <Badge
    //         variant={'red'}
    //         title={intl.formatMessage({ id: 'health.prescriptions.rejected' })}
    //         outlined
    //       />
    //     ) : !prescription.processed ? (
    //       <Badge
    //         variant={'darkerBlue'}
    //         title={intl.formatMessage({ id: 'health.prescriptions.inProcess' })}
    //         outlined
    //       />
    //     ) : undefined
    //   }
    //   onPress={() => {
    //     setOpen((isOpen) => !isOpen)
    //   }}
    //   open={open}
    // >
    //   <View style={{ width: '100%', padding: theme.spacing[2] }}>
    //     {loading ? (
    //       Array.from({ length: 3 }).map((_, index) => (
    //         <Row key={index}>
    //           <Cell style={{ flex: 1 }}>
    //             <Skeleton height={18} />
    //           </Cell>
    //         </Row>
    //       ))
    //     ) : (
    //       <View>
    //         <TableHeader>
    //           <Typography variant="eyebrow">
    //             <FormattedMessage id="health.prescriptions.furtherInformation" />
    //           </Typography>
    //         </TableHeader>
    //         {prescriptionData
    //           .filter((item) => item.data)
    //           .map((item, visibleIndex) => (
    //             <TableRow
    //               key={visibleIndex}
    //               style={{
    //                 backgroundColor:
    //                   visibleIndex % 2 === 0
    //                     ? theme.color.blue100
    //                     : theme.color.white,
    //               }}
    //             >
    //               <RowItem>
    //                 <Typography variant="eyebrow">
    //                   <FormattedMessage id={item.label} />
    //                 </Typography>
    //               </RowItem>
    //               <RowItem>
    //                 <Typography variant="body3">{item.data}</Typography>
    //               </RowItem>
    //             </TableRow>
    //           ))}
    //       </View>
    //     )}
    //   </View>
    // </ExpandableCard>
  )
}
