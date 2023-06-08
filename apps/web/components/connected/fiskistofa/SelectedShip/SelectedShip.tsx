import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useLazyQuery } from '@apollo/client'
import { Box, Inline, LoadingDots, Text } from '@island.is/island-ui/core'
import { useNamespace } from '@island.is/web/hooks'
import { GET_SINGLE_SHIP } from '@island.is/web/screens/queries/Fiskistofa'

import * as styles from './SelectedShip.css'

interface SelectedShipProps {
  namespace?: Record<string, string>
}

const SelectedShip = ({ namespace }: SelectedShipProps) => {
  const [shipNumber, setShipNumber] = useState<number | null>(null)
  const router = useRouter()

  // TODO: figure out how to not call endpoint when nothing is selected
  const [getSingleShip, { data, error, loading }] =
    useLazyQuery(GET_SINGLE_SHIP)
  const n = useNamespace(namespace)

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
        <Text>{n('noShipSelected', 'Ekkert skip valið')}</Text>
      </Box>
    )
  }

  return (
    <Box className={styles.container}>
      <Inline space={3}>
        {ship?.name ? (
          <Text variant="h2">{ship?.name}</Text>
        ) : (
          <Text>{n('shipCouldNotBeFetched', 'Ekki tókst að sækja skip')}</Text>
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
