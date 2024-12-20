import { Box, Icon, Text } from '@island.is/island-ui/core'
import * as styles from './Comments.css'
import { useLocale } from '@island.is/localization'
import { comments } from '../../lib/messages/comments'
import { OjoiCommentDirection, OjoiaComment } from '@island.is/api/schema'
export type Props = OjoiaComment

export const Comment = ({
  id,
  age,
  title,
  direction,
  creator,
  receiver,
  comment,
}: OjoiaComment) => {
  const { formatMessage: f } = useLocale()

  return (
    <li key={id} className={styles.comment}>
      <Box className={styles.iconColumn}>
        <Box className={styles.iconWrapper}>
          <Icon
            useStroke={true}
            icon={
              direction === OjoiCommentDirection.RECEIVED
                ? 'arrowBack'
                : 'arrowForward'
            }
            type="filled"
            color="white"
          />
        </Box>
      </Box>
      <Box className={styles.contentColumn}>
        <Text>
          <strong>{creator ? creator : f(comments.unknownUser.name)}</strong>{' '}
          {title && `${title}`}
          {receiver && ` ${receiver}`}
        </Text>
        <Text>{comment}</Text>
      </Box>
      <Box className={styles.dateColumn}>{age}</Box>
    </li>
  )
}
