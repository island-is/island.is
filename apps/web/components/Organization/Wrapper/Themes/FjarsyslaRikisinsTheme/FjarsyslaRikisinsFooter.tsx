import { Box, GridContainer, Text, Inline } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useNamespace } from '@island.is/web/hooks'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { nlToBr } from '@island.is/web/utils/nlToBr'
import { useMemo } from 'react'

import * as styles from './FjarsyslaRikisinsFooter.css'

const joinList = (list: string[], seperator: string) => {
  const joinedList: string[] = []
  for (let i = 0; i < list.length; i += 1) {
    if (i !== 0) joinedList.push(seperator)
    joinedList.push(list[i])
  }
  return joinedList
}

interface FjarsyslaRikisinsFooterProps {
  namespace: Record<string, string>
  title: string
}

const FjarsyslaRikisinsFooter = ({
  namespace,
  title,
}: FjarsyslaRikisinsFooterProps) => {
  const n = useNamespace(namespace)
  const { width } = useWindowSize()

  const bottomRowItems = useMemo(() => {
    const defaultList = [
      'Sími: 545 7500',
      'Vegmúli 3',
      '108 Reykjavík',
      'kt. 540269-75093',
      'postur@fjarsyslan.is',
    ]

    let list = n('fjarsyslanFooterBottomRowItems', defaultList) as string[]
    if (!Array.isArray(list)) {
      if (typeof list === 'string') {
        list = [list]
      } else {
        list = defaultList
      }
    }

    return width >= theme.breakpoints.xl ? joinList(list, '|') : list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width >= theme.breakpoints.xl, n])

  return (
    <footer className={styles.container} aria-labelledby="fjarsyslan-footer">
      <GridContainer>
        <Box className={styles.topRow}>
          <Box>
            <Box marginLeft={[3, 3, 6]} marginBottom={1}>
              <img
                width={80}
                src={n(
                  'fjarsyslanFooterLogo',
                  'https://images.ctfassets.net/8k0h54kbe6bj/5uadQzxeuYfF8bzDjdkygg/32ddc280aa31e7ada0f7a6e007a3ebff/fjarsyslan_logo.svg',
                )}
                alt=""
              />
            </Box>
            <Text color="white" variant="h2">
              {title}
            </Text>
          </Box>
          <Box textAlign="right">
            <Text fontWeight="semiBold" color="white" marginBottom={1}>
              {n('fjarsyslanFooterTopRowColumnTitle', 'Afgreiðslutími')}
            </Text>
            <Text color="white">
              {nlToBr(
                n(
                  'fjarsyslanFooterTopRowColumnText',
                  'Mánudaga-fimmtudaga kl. 9-15\nföstudaga kl. 9-13',
                ),
              )}
            </Text>
          </Box>
        </Box>

        <Box marginY={6} borderTopWidth="standard" borderColor="white" />

        <Box className={styles.bottomRow}>
          <Inline alignY="center" space={2} collapseBelow="xl">
            {bottomRowItems.map((item) => (
              <Text fontWeight="semiBold" color="white">
                {item}
              </Text>
            ))}
          </Inline>

          <Box marginTop={[3, 3, 0]}>
            <Inline alignY="center" space={[3, 3, 1, 2, 3]}>
              <img
                alt=""
                src={n(
                  'fjarsyslanFooterGraenSkrefLogo',
                  'https://images.ctfassets.net/8k0h54kbe6bj/72JIVVuYkz6SphDOrZRIX6/c1b04fc98b2aef1e0e384a697acd91d4/graen-skref.svg',
                )}
              />

              <img
                alt=""
                src={n(
                  'fjarsyslanFooterJafnlaunaLogo',
                  'https://images.ctfassets.net/8k0h54kbe6bj/5n6ItZYKZqiv5yagMBdtcU/ffd31264e5951514b8ff683e72c6e015/JAFNLAUNAMERKI_1.svg',
                )}
              />
            </Inline>
          </Box>
        </Box>
      </GridContainer>
    </footer>
  )
}

export default FjarsyslaRikisinsFooter
