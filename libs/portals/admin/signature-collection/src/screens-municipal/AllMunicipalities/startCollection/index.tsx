import { Box, Text, Button, DialogPrompt } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'

const StartAreaCollection = () => {
  const { formatMessage } = useLocale()
  
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
          marginTop={5}
        >
          <Text marginBottom={[2, 0, 0]} variant="medium" color="blue600">
            {formatMessage(m.startCollectionDescriptionInBox)}
          </Text>
          <Button
            icon="lockOpened"
            iconType="outline"
            variant="ghost"
            size="small"
          >
            {formatMessage(m.startCollectionButton)}
          </Button>
        </Box>
      }
      onConfirm={() => console.log('TODO: add action once available')}
      buttonTextConfirm={formatMessage(m.startCollectionButtonModal)}
    />
  )
}

export default StartAreaCollection
