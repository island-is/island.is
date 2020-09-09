import React from 'react'
import { Box, Typography, Button, Stack, Icon } from '@island.is/island-ui/core'
import { Link } from '@island.is/air-discount-scheme-web/components'

interface PropTypes {
  misc: string
}

function NoBenefits({ misc }: PropTypes) {
  const {
    noRights,
    noRightsDescription,
    backToInfoPage,
    backToInfoPageLink,
  } = JSON.parse(misc)

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
          <Icon type="alert" color="red400" width={26} />
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
      <Link href={backToInfoPageLink}>
        <Button variant="text" leftIcon="arrowLeft">
          {backToInfoPage}
        </Button>
      </Link>
    </>
  )
}

export default NoBenefits
