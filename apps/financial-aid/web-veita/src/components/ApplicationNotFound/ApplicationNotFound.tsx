import React from 'react'
import { Text, Box, Button } from '@island.is/island-ui/core'
import {
  ApplicationSkeleton,
  LoadingContainer,
} from '@island.is/financial-aid-web/veita/src/components'

import { useRouter } from 'next/router'

import * as styles from './ApplicationNotFound.css'

interface Props {
  loading: boolean
}

const ApplicationNotFound = ({ loading }: Props) => {
  const router = useRouter()

  return (
    <LoadingContainer isLoading={loading} loader={<ApplicationSkeleton />}>
      <Box marginTop={10} marginBottom={4}>
        <Button
          colorScheme="default"
          iconType="filled"
          onClick={() => {
            router.push('/nymal')
          }}
          preTextIcon="arrowBack"
          preTextIconType="filled"
          size="small"
          type="button"
          variant="text"
        >
          Í vinnslu
        </Button>
      </Box>
      <Text
        as="h1"
        variant="h1"
        color="red400"
        fontWeight="semiBold"
        marginBottom={2}
      >
        Notandi fannst ekki
      </Text>
      <Box className={styles.maxWidthText}>
        <Text variant="intro">
          Þú getur prufað að fara til baka og opna umsóknina aftur eða að
          {` `}
          <Button
            variant="text"
            size="large"
            onClick={() => {
              window.location.reload()
            }}
          >
            endurhlaða
          </Button>
          {` `} síðunni.
        </Text>
      </Box>
    </LoadingContainer>
  )
}

export default ApplicationNotFound
