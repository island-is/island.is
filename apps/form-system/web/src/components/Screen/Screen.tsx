import {
  Box,
  GridColumn,
} from '@island.is/island-ui/core'
import { Footer } from '../Footer/Footer'


export const Screen = () => {
  return (
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      justifyContent="spaceBetween"
      height="full"
    >
      <GridColumn
        span={['12/12', '12/12', '10/12', '7/9']}
        offset={['0', '0', '1/12', '1/9']}
      >

      </GridColumn>
      <Footer />
    </Box>
  )

}