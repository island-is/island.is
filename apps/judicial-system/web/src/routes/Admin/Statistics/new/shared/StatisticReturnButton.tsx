import router from 'next/router'

import { Box, Button } from '@island.is/island-ui/core'

export const StatisticReturnButton = () => (
  <Box marginBottom={5}>
    <Button
      colorScheme="default"
      iconType="filled"
      onClick={() => router.push('/notendur/tolfraedi/')}
      preTextIcon="arrowBack"
      preTextIconType="filled"
      type="button"
      variant="text"
    >
      Til baka á yfirlitsskjá
    </Button>
  </Box>
)
