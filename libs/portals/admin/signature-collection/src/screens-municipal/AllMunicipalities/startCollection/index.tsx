import {
  Box,
  Text,
  Button,
  DialogPrompt,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import { useStartCollectionMutation } from './startCollection.generated'

const StartAreaCollection = ({ areaId }: { areaId: string }) => {
  const { formatMessage } = useLocale()

  const [startCollectionMutation, { loading }] = useStartCollectionMutation()

  const onStartCollection = () => {
    startCollectionMutation({
      variables: {
        input: {
          areaId: areaId,
        },
      },
      onCompleted: (response) => {
        if (
          response.signatureCollectionAdminStartMunicipalityCollection.success
        )
          toast.success(formatMessage(m.openMunicipalCollectionSuccess))
        else {
          toast.error(
            response.signatureCollectionAdminStartMunicipalityCollection
              .reasons?.[0] ?? formatMessage(m.openMunicipalCollectionError),
          )
        }
      },
    })
  }

  return (
    <DialogPrompt
      baseId="openCollection"
      ariaLabel=""
      title={formatMessage(m.startCollection)}
      description={formatMessage(m.startCollectionDescription)}
      disclosureElement={
        <Box
          background="blue100"
          borderRadius="large"
          display={['block', 'flex', 'flex']}
          justifyContent="spaceBetween"
          alignItems="center"
          padding={3}
          marginY={5}
        >
          <Text marginBottom={[2, 0, 0]} variant="medium" color="blue600">
            {formatMessage(m.startCollectionDescriptionInBox)}
          </Text>
          <Button
            icon="lockOpened"
            iconType="outline"
            variant="ghost"
            size="small"
            loading={loading}
          >
            {formatMessage(m.startCollectionButton)}
          </Button>
        </Box>
      }
      onConfirm={() => onStartCollection()}
      buttonTextConfirm={formatMessage(m.startCollectionButtonModal)}
    />
  )
}

export default StartAreaCollection
