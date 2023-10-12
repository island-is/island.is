import React, { FC } from 'react'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  Stack,
  Button,
  Link,
} from '@island.is/island-ui/core'
import { News } from '@island.is/api/schema'
import { BackgroundImage } from '@island.is/web/components'
import AdgerdirHeading from '../AdgerdirHeading/AdgerdirHeading'

import * as styles from './FeaturedNews.css'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

interface FeaturedNewsProps {
  items: Array<News>
}

export const FeaturedNews: FC<React.PropsWithChildren<FeaturedNewsProps>> = ({
  items,
}) => {
  const { linkResolver } = useLinkResolver()

  if (!items.length) {
    return null
  }

  const parsed = items.map((x, index) => {
    return {
      ...x,
      dateFormatted: format(new Date(x.date), 'd. LLLL, uuuu', {
        locale: is,
      }).toLowerCase(),
    }
  })

  const first = parsed[0]
  const second = parsed[1]
  const third = parsed[2]

  return (
    <>
      {first ? (
        <GridContainer>
          <GridRow>
            <GridColumn
              span={['12/12', '12/12', '12/12', '12/12', '10/12']}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              offset={[null, null, null, null, '1/12']}
            >
              <Box marginBottom={[3, 3, 5]}>
                {first.image ? (
                  <Box marginBottom={6}>
                    <BackgroundImage ratio="20:10" image={first.image} />
                  </Box>
                ) : null}
                <Stack space={2}>
                  <AdgerdirHeading
                    subtitle={first.dateFormatted}
                    title={first.title}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore make web strict
                    intro={first.intro}
                  />
                  <Link {...linkResolver('news', [first.slug])} pureChildren>
                    <Button variant="text" icon="arrowForward">
                      Lesa meira
                    </Button>
                  </Link>
                </Stack>
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      ) : null}
      {second || third ? (
        <>
          <Box className={styles.centeredBorder} marginBottom={[3, 3, 5]}>
            <GridContainer>
              <GridRow>
                <GridColumn
                  span={['12/12', '12/12', '12/12', '12/12', '10/12']}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore make web strict
                  offset={[null, null, null, null, '1/12']}
                >
                  <Box className={styles.topBorder}></Box>
                </GridColumn>
                {second ? (
                  <GridColumn
                    span={['12/12', '12/12', '12/12', '5/12', '4/12']}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore make web strict
                    offset={[null, null, null, null, '1/12']}
                  >
                    <Box marginY={[3, 3, 5]}>
                      <Stack space={2}>
                        <AdgerdirHeading
                          main={false}
                          subtitle={second.dateFormatted}
                          title={second.title}
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore make web strict
                          intro={second.intro}
                          variant="h3"
                          as="h3"
                        />
                        <Link
                          {...linkResolver('news', [second.slug])}
                          pureChildren
                        >
                          <Button variant="text" icon="arrowForward">
                            Lesa meira
                          </Button>
                        </Link>
                      </Stack>
                    </Box>
                  </GridColumn>
                ) : null}
                {third ? (
                  <GridColumn
                    span={['12/12', '12/12', '12/12', '5/12', '4/12']}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore make web strict
                    offset={[null, null, null, '2/12', '2/12']}
                  >
                    <Box marginY={[3, 3, 5]}>
                      <Stack space={2}>
                        <AdgerdirHeading
                          main={false}
                          subtitle={third.dateFormatted}
                          title={third.title}
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore make web strict
                          intro={third.intro}
                          variant="h3"
                          as="h3"
                        />
                        <Link
                          {...linkResolver('news', [third.slug])}
                          pureChildren
                        >
                          <Button variant="text" icon="arrowForward">
                            Lesa meira
                          </Button>
                        </Link>
                      </Stack>
                    </Box>
                  </GridColumn>
                ) : null}
              </GridRow>
            </GridContainer>
          </Box>
          <Box
            marginTop={3}
            display="flex"
            width="full"
            alignItems="center"
            justifyContent="center"
          >
            <Link {...linkResolver('newsoverview')} pureChildren>
              <Button variant="ghost" icon="arrowForward">
                Sjá allar fréttir
              </Button>
            </Link>
          </Box>
        </>
      ) : null}
    </>
  )
}

export default FeaturedNews
