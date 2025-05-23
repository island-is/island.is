import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { LGFieldBaseProps } from '../utils/types'
import { useUserInfo } from '@island.is/react-spa/bff'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'
import { AdvertDisplay } from '../components/advert-display/AdvertDisplay'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import addDays from 'date-fns/addDays'

const KeyValue = ({ label, value }: { label: string; value?: string }) => {
  return (
    <GridRow>
      <GridColumn span={['12/12', '6/12']}>
        <Box paddingY={[1, 2, 3]} paddingX={[2, 3, 4]}>
          <Text variant="h5">{label}</Text>
        </Box>
      </GridColumn>
      <GridColumn span={['12/12', '6/12']}>
        <Box paddingY={[1, 2, 3]} paddingX={[2, 3, 4]}>
          <Text variant="default">{value}</Text>
        </Box>
      </GridColumn>
    </GridRow>
  )
}

export const Confirmation = ({ application }: LGFieldBaseProps) => {
  const { formatMessage } = useLocale()
  const { profile } = useUserInfo()

  const firstDate = application.answers.publishing.dates[0]

  const publicationDate = firstDate
    ? format(new Date(firstDate.date), 'dd.MM.yyyy')
    : format(addDays(new Date(), 14), 'dd.MM.yyyy')

  const allPublicationDates = application.answers.publishing.dates.map(
    ({ date }) => format(new Date(date), 'dd.MM.yyyy'),
  )

  const allCommunicationChannels =
    application.answers.communication.channels.map(
      (channel) =>
        `${channel.email} ${channel.phone ? ` - (${channel.phone})` : ''}`,
    )

  return (
    <Stack space={0} dividers>
      <KeyValue
        label={formatMessage(m.draft.sections.confirmation.sender)}
        value={profile.name}
      />
      <KeyValue
        label={formatMessage(m.draft.sections.confirmation.type)}
        value={formatMessage(m.draft.sections.confirmation.applicationType)}
      />
      {!firstDate && (
        <KeyValue
          label={formatMessage(m.draft.sections.confirmation.publicationDate)}
          value={formatMessage(m.draft.sections.confirmation.noPublicationDate)}
        />
      )}
      {allPublicationDates.length > 0 &&
        allPublicationDates.map((date, i) => (
          <KeyValue
            key={date}
            label={`${formatMessage(
              m.draft.sections.confirmation.publicationDate,
            )}${i > 0 ? ` ${i + 1}` : ''}`}
            value={date}
          />
        ))}
      {allCommunicationChannels.length > 0 &&
        allCommunicationChannels.map((channel, i) => (
          <KeyValue
            key={channel}
            label={`${formatMessage(
              m.draft.sections.confirmation.communicationChannel,
            )}${i > 0 ? ` ${i + 1}` : ''}`}
            value={channel}
          />
        ))}
      <Box paddingY={[1, 2, 3]}>
        <AdvertDisplay
          modal={true}
          withBorder={false}
          publicationDate={publicationDate}
          title={application.answers.application.caption}
          signatureDate={format(
            new Date(application.answers.signature.date),
            'dd. MMMM yyyy.',
            {
              locale: is,
            },
          )}
          signatureLocation={application.answers.signature.location}
          signatureName={application.answers.signature.name}
          html={Buffer.from(
            application.answers.application.html,
            'base64',
          ).toString('utf-8')}
          disclosure={
            <Button
              variant="utility"
              icon="eye"
              iconType="outline"
              size="small"
            >
              {formatMessage(m.draft.sections.confirmation.previewButton)}
            </Button>
          }
        />
      </Box>
    </Stack>
  )
}

export default Confirmation
