import { useQuery } from '@apollo/client'

import { Box, LinkV2, Text } from '@island.is/island-ui/core'
import {
  ContentLanguage,
  GrantCardsList,
  Query,
} from '@island.is/web/graphql/schema'
import { LinkType, useLinkResolver } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { GET_GRANTS_QUERY } from '@island.is/web/screens/queries'

import * as styles from './GrantCardsListSlice.css'

interface SliceProps {
  slice: GrantCardsList
}

export const GrantCardsListSlice = ({ slice }: SliceProps) => {
  const { activeLocale } = useI18n()
  const { linkResolver } = useLinkResolver()

  const { data, loading, error } = useQuery<Query>(GET_GRANTS_QUERY, {
    variables: {
      input: {
        lang: activeLocale as ContentLanguage,
        size: slice.maxNumberOfCards ?? 4,
        funds: slice.funds ? slice.funds.map((f) => f.id).join(',') : undefined,
      },
    },
  })

  console.log(slice)

  if (!slice.funds) {
    return undefined
  }

  return (
    <Box component="ul" className={styles.unorderedList}>
      {slice.funds.map((fund) => {
        if (!fund.link) {
          return null
        }
        return (
          <Box component="li" className={styles.listItem}>
            <LinkV2
              href={linkResolver(fund.link?.type as LinkType, [
                fund.link.slug ?? '',
              ])}
            >
              <Text>{fund.title}</Text>
            </LinkV2>
          </Box>
        )
      })}
    </Box>
  )
}
