import type { Props as CommentProps } from './Comment'
import { Text } from '@island.is/island-ui/core'
import { Comment } from './Comment'
import * as styles from './Comments.css'

type Props = {
  comments: CommentProps[]
}

export const CommentsList = ({ comments }: Props) => {
  if (!comments.length) {
    return <Text>Engar athugasemdir eru á þessari umsókn</Text>
  }

  return (
    <ul className={styles.commentsList}>
      {comments.map((comment, index) => (
        <Comment key={index} {...comment} as="li" />
      ))}
    </ul>
  )
}
