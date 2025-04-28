import { Box, DialogPrompt, Icon, Tag } from '@island.is/island-ui/core'

const StartAreaCollection = () => {
  return (
    <Box display="flex" alignItems="center" columnGap={1}>
      <DialogPrompt
        baseId="open_collection"
        ariaLabel=""
        title="Opna fyrir meðmælasöfnun"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit?"
        disclosureElement={
          <Tag variant="blue">
            <Icon icon="lockOpened" size="small" />
          </Tag>
        }
        onConfirm={() => console.log('opened')}
        buttonTextConfirm="Já, opna"
        buttonTextCancel="Hætta við"
      />
    </Box>
  )
}

export default StartAreaCollection
