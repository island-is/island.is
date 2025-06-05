import { Box, DialogPrompt, Icon, Tag } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

const StartAreaCollection = () => {
  const { formatMessage } = useLocale()
  return (
    <Box display="flex" alignItems="center" columnGap={1}>
      <DialogPrompt
        baseId="openCollection"
        ariaLabel=""
        title={formatMessage(m.openMunicipalCollection)}
        description={formatMessage(m.openMunicipalCollectionDescription)}
        disclosureElement={
          <Tag variant="blue">
            <Icon icon="lockOpened" size="small" />
          </Tag>
        }
        onConfirm={() => console.log('TODO: add action once available')}
        buttonTextConfirm={formatMessage(m.confirmOpenMunicipalCollection)}
      />
    </Box>
  )
}

export default StartAreaCollection
