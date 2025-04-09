import { Box, Button, Divider, Drawer, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import PdfReport from '../../../../shared/PdfReport'

const ListActions = () => {
  const { formatMessage } = useLocale()

  return (
    <Box marginTop={3} marginBottom={5}>
      <Drawer
        ariaLabel={''}
        baseId={''}
        disclosure={
          <Button variant="utility" icon="settings" iconType="outline">
            Aðgerðir
          </Button>
        }
      >
        <Text variant="h2" color="backgroundBrand" marginY={3}>
          Aðgerðir
        </Text>
        <Divider />
        <Text marginY={6}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu
          justo interdum, pharetra enim vel, ultrices augue.
        </Text>
        {/* Sækja skýrslu */}
        <Box display="flex" justifyContent="spaceBetween" marginBottom={5}>
          <Box>
            <Text variant="h5">Sækja skýrslu</Text>
            <Text>
              Lorem ipsum dolor sit amet. Vestibulum tincidunt cursus viverra.
            </Text>
          </Box>
          <PdfReport listId={'1'} />
        </Box>

        {/* Eyða framboði */}
        <Box display="flex" justifyContent="spaceBetween">
          <Box>
            <Text variant="h5">Eyða framboði</Text>
            <Text>
              Lorem ipsum dolor sit amet. Vestibulum tincidunt cursus viverra.
            </Text>
          </Box>
          <Button
            iconType="outline"
            variant="ghost"
            icon="trash"
            colorScheme="destructive"
          >
            {formatMessage('Eyða framboði')}
          </Button>
        </Box>
      </Drawer>
    </Box>
  )
}

export default ListActions
