import {
  Box,
  Text,
  Button,
  DialogPrompt,
  toast,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import { useStartCollectionMutation } from './startCollection.generated'
import { useRevalidator } from 'react-router-dom'

const StartAreaCollection = ({ areaId }: { areaId: string }) => {
  const { formatMessage } = useLocale()
  const [startCollectionMutation, { loading }] = useStartCollectionMutation()
  const { revalidate } = useRevalidator()

  const onStartCollection = () => {
    startCollectionMutation({
      variables: {
        input: {
          areaId: areaId,
        },
      },
      onCompleted: (response) => {
        const { success, reasons } =
          response.signatureCollectionAdminStartMunicipalityCollection

        if (success) {
          toast.success(formatMessage(m.openMunicipalCollectionSuccess))
          revalidate()
        } else {
          toast.error(
            reasons?.[0] ?? formatMessage(m.openMunicipalCollectionError),
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
          paddingY={5}
          paddingX={3}
          marginY={5}
        >
          <GridRow>
            <GridColumn span={['12/12', '8/12']}>
              <Text marginBottom={[2, 0, 0]} variant="medium" color="blue600">
                {formatMessage(m.startCollectionDescriptionInBox)}
              </Text>
            </GridColumn>
          </GridRow>
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
      buttonPropsConfirm={{ variant: 'primary' }}
      buttonTextConfirm={formatMessage(m.startCollectionButtonModal)}
    />
  )
}

export default StartAreaCollection
