import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useLazyQuery } from '@apollo/client'

import { Box, Inline, LoadingDots, Text } from '@island.is/island-ui/core'
import { GET_SINGLE_SHIP } from '@island.is/web/screens/queries/Fiskistofa'

import { translation as translationStrings } from './translation.strings'
import * as styles from './SelectedShip.css'

const SelectedShip = () => {
  const [shipNumber, setShipNumber] = useState<number | null>(null)
  const router = useRouter()

  // TODO: figure out how to not call endpoint when nothing is selected
  const [getSingleShip, { data, error, loading }] =
    useLazyQuery(GET_SINGLE_SHIP)
  const { formatMessage } = useIntl()

  useEffect(() => {
    if (router.query.nr && !isNaN(Number(router.query.nr))) {
      const nr = Number(router.query.nr)
      setShipNumber(nr)
      getSingleShip({
        variables: {
          input: {
            shipNumber: nr,
          },
        },
      })
    }
  }, [router.query.nr])

  if (loading) {
    return (
      <Box className={styles.container}>
        <LoadingDots />
      </Box>
    )
  }

  const ship = data?.fiskistofaGetSingleShip?.fiskistofaSingleShip

  if (!data || error) {
    return (
      <Box className={styles.container}>
        <Text>{formatMessage(translationStrings.noShipSelected)}</Text>
      </Box>
    )
  }

  return (
    <Box className={styles.container}>
      <Inline space={3}>
        {ship?.name ? (
          <Text variant="h2">{ship?.name}</Text>
        ) : (
          <Text>{formatMessage(translationStrings.shipCouldNotBeFetched)}</Text>
        )}

        <Box className={styles.shipNumber}>
          <Text fontWeight="semiBold" color="white">
            {shipNumber}
          </Text>
        </Box>
      </Inline>
    </Box>
  )
}

export default SelectedShip
