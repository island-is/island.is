import type { Props as CommentProps } from './Comment'
import { Text } from '@island.is/island-ui/core'
import { Comment } from './Comment'
import * as styles from './Comments.css'
import { useLocale } from '@island.is/localization'
import { comments as messages } from '../../lib/messages/comments'

type Props = {
  comments: CommentProps[]
}

export const CommentsList = ({ comments }: Props) => {
  const { formatMessage: f } = useLocale()
  if (!comments.length) {
    return <Text>{f(messages.errors.emptyComments)}</Text>
  }

  return (
    <ul className={styles.commentsList}>
      {comments.map((comment, index) => (
        <Comment key={index} {...comment} as="li" />
      ))}
    </ul>
  )
}
