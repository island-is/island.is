import { Text, Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import EmptyImageSmall from './EmptyImgSmall'

interface Props {
  title: string
  description: string
}

export const EmptyState = ({ title, description }: Props) => {
  return (
    <Box paddingTop={[0, 3]}>
      <GridRow rowGap={3}>
        <GridColumn
          span={['12/12', '12/12', '12/12', '3/12', '3/12']}
          order={[2, 2, 2, 1, 1]}
        >
          <Box
            paddingLeft={[0, 0, 0, 'containerGutter']}
            display="flex"
            justifyContent="center"
          >
            <EmptyImageSmall style={{ maxHeight: 229 }} />
          </Box>
        </GridColumn>
        <GridColumn
          span={['12/12', '12/12', '10/12', '4/12']}
          offset={['0', '1/12', '1/12', '1/12', '0']}
          order={[1, 1, 1, 2, 2]}
        >
          <Box
            height="full"
            display="flex"
            justifyContent="center"
            flexDirection="column"
          >
            <Text marginBottom={1} variant="h3">
              {title}
            </Text>
            <Text marginBottom={1} as="p">
              {description}
            </Text>
          </Box>
        </GridColumn>
      </GridRow>
    </Box>
  )
}

export default EmptyState
