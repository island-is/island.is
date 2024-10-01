import { Box, Icon, Text } from '@island.is/island-ui/core'
import * as styles from './Comments.css'
import { useLocale } from '@island.is/localization'
import { comments } from '../../lib/messages/comments'
import { countDaysAgo } from '../../lib/utils'
import { Maybe } from 'graphql/jsutils/Maybe'
export type Props = {
  as?: 'div' | 'li'
  date?: string
  from?: string
  task?: string
  comment?: Maybe<string>
  type?: 'sent' | 'received'
}

export const Comment = ({
  as = 'li',
  date,
  from,
  task,
  comment,
  type,
}: Props) => {
  const Wrapper = as

  const { formatMessage: f } = useLocale()

  const daysAgo = date ? countDaysAgo(new Date(date)) : null

  const many = f(comments.dates.xDaysAgo, {
    days: daysAgo,
  })

  const yesterDay = f(comments.dates.yesterday)
  const today = f(comments.dates.today)

  const msg = daysAgo === 0 ? today : daysAgo === 1 ? yesterDay : many

  return (
    <Wrapper className={styles.comment}>
      <Box className={styles.iconColumn}>
        {type && (
          <Box className={styles.iconWrapper}>
            <Icon
              useStroke={true}
              icon={type === 'received' ? 'arrowForward' : 'arrowBack'}
              type="filled"
              color="white"
            />
          </Box>
        )}
      </Box>
      <Box className={styles.contentColumn}>
        <Text>
          <strong>{from ? from : f(comments.unknownUser.name)}</strong>{' '}
          {task && `${task}`}
        </Text>
        <Text>{comment}</Text>
      </Box>
      <Box className={styles.dateColumn}>
        {daysAgo !== null && <Text truncate>{msg}</Text>}
      </Box>
    </Wrapper>
  )
}
