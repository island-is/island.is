import { HealthDirectoratePrescription } from '@island.is/api/schema'
import {
  AlertMessage,
  Box,
  LoadingDots,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatDate } from '@island.is/portals/my-pages/core'
import React from 'react'
import DispensingContainer from '../../../components/DispensingContainer/DispensingContainer'
import NestedInfoLines from '../../../components/NestedInfoLines/NestedInfoLines'
import { messages } from '../../../lib/messages'
import { mapBlockedStatus } from '../../../utils/mappers'
import { useGetPrescriptionDocumentsQuery } from '../Prescriptions.generated'

interface Props {
  item: HealthDirectoratePrescription
}

const PrescriptionDetails: React.FC<Props> = ({ item }) => {
  const { formatMessage } = useLocale()

  // Mounted when the row is expanded, so the documents are only fetched on demand
  const { data, loading } = useGetPrescriptionDocumentsQuery({
    variables: { input: { id: item.productId ?? item.id } },
  })
  const documents = data?.healthDirectoratePrescriptionDocuments.documents

  const blockedStatus = !item.isRenewable
    ? mapBlockedStatus(
        item.renewalBlockedReason?.toString() ?? '',
        formatMessage,
      )
    : null

  return (
    <Box background="blue100" paddingBottom={1} paddingTop={[2, 2, 0]}>
      {(blockedStatus?.showReason || item.renewResponseMessage) && (
        <Box paddingX={[0, 0, 3]} marginBottom={[2, 2, 0]}>
          <AlertMessage
            type="info"
            message={
              <Text variant="small" whiteSpace="preLine">
                {item.renewResponseMessage || blockedStatus?.description}
              </Text>
            }
          />
        </Box>
      )}

      <Stack space={2}>
        <NestedInfoLines
          backgroundColor="blue"
          label={formatMessage(messages.moreDetailedInfo)}
          data={[
            {
              title: formatMessage(messages.medicineTitle),
              value: item.name ?? '',
              href: item.url ?? '',
              type: 'link',
            },
            ...(item.strength
              ? [
                  {
                    title: formatMessage(messages.medicineStrength),
                    value: item.strength,
                  },
                ]
              : []),
            {
              title: formatMessage(messages.usedFor),
              value: item.indication ?? '',
            },
            {
              title: formatMessage(messages.usage),
              value: item.dosageInstructions ?? '',
            },
            ...(loading
              ? [
                  {
                    title: formatMessage(messages.fylgiskjalNr, { arg: 1 }),
                    value: <LoadingDots />,
                  },
                ]
              : documents?.map((doc, index) => ({
                  title: formatMessage(messages.fylgiskjalNr, {
                    arg: index + 1,
                  }),
                  value: formatMessage(messages.openFylgiskjalNr, {
                    arg: index + 1,
                  }),
                  type: 'link' as const,
                  href: doc.url ?? '',
                })) ?? []),
            {
              title: formatMessage(messages.type),
              value: item.type ?? '',
            },
            {
              title: formatMessage(messages.medicineForm),
              value: item.form ?? '',
            },
            {
              title: formatMessage(messages.prescribedAmount),
              value: item.totalPrescribedAmount ?? '',
            },
          ]}
        />
        <NestedInfoLines
          backgroundColor="blue"
          label={formatMessage(messages.version)}
          data={[
            {
              title: formatMessage(messages.publicationDate),
              value: formatDate(item.issueDate) ?? '',
            },
            {
              title: formatMessage(messages.doctor),
              value: item.prescriberName ?? '',
            },
            {
              title: formatMessage(messages.medicineValidTo),
              value: formatDate(item.expiryDate) ?? '',
            },
          ]}
        />
        {item.dispensations.length > 0 && (
          <DispensingContainer
            backgroundColor="blue"
            label={formatMessage(messages.dispenseHistory)}
            data={item.dispensations.map((dispensation, di) => ({
              id:
                dispensation.id.toString() ??
                dispensation.name + '-' + di.toString(),
              date: formatDate(dispensation?.date),
              medicine: dispensation.name ?? '',
              strength: dispensation.strength ?? '',
              number: (di + 1).toString() ?? '',
              pharmacy: dispensation?.pharmacy ?? '',
              quantity: dispensation?.amount ?? '',
            }))}
          />
        )}
      </Stack>
    </Box>
  )
}

export default PrescriptionDetails
