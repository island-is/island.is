import React from 'react'
import {
  Box,
  Typography,
  ButtonDeprecated as Button,
  Stack,
  IconDeprecated as Icon,
} from '@island.is/island-ui/core'
import * as styles from './NoBenefits.css'

interface PropTypes {
  misc: string
}

function NoBenefits({ misc }: PropTypes) {
  const { noRights, noRightsDescription, backToInfoPage, backToInfoPageLink } =
    JSON.parse(misc)

  return (
    <>
      <Box
        marginBottom={5}
        background="red100"
        borderColor="red200"
        borderWidth="standard"
        borderStyle="solid"
        borderRadius="standard"
        display="flex"
        padding={3}
      >
        <Box marginRight={2}>
          <Icon aria-hidden="true" type="alert" color="red400" width={26} />
        </Box>
        <Box marginRight={2}>
          <Stack space={1}>
            <Typography variant="p">
              <strong>{noRights}</strong>
            </Typography>
            <Typography variant="p">{noRightsDescription}</Typography>
          </Stack>
        </Box>
      </Box>
      <a className={styles.link} href={backToInfoPageLink}>
        <Button variant="text" leftIcon="arrowLeft">
          {backToInfoPage}
        </Button>
      </a>
    </>
  )
}

export default NoBenefits
