import { Box, Icon, Text } from '@island.is/island-ui/core'
import * as styles from './Comments.css'
import { useLocale } from '@island.is/localization'
import { comments } from '../../lib/messages/comments'
import { OjoiaComment, OjoiaCommentTypeEnum } from '@island.is/api/schema'
export type Props = OjoiaComment

export const Comment = ({
  id,
  age,
  creator,
  comment,
  action,
}: OjoiaComment) => {
  const { formatMessage: f } = useLocale()

  return (
    <li key={id} className={styles.comment}>
      <Box className={styles.iconColumn}>
        <Box className={styles.iconWrapper}>
          <Icon
            useStroke={true}
            icon={
              action === OjoiaCommentTypeEnum.EXTERNAL_COMMENT
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
          <strong>{creator}</strong> {f(comments.general.commentPostfix)}
        </Text>
        <Text>{comment}</Text>
      </Box>
      <Box className={styles.dateColumn}>{age}</Box>
    </li>
  )
}
