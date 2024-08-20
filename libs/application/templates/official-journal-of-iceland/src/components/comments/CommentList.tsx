import type { Props as CommentProps } from './Comment'
import { Comment } from './Comment'
import * as styles from './Comments.css'

type Props = {
  comments: CommentProps[]
}

export const CommentsList = ({ comments }: Props) => {
  return (
    <ul className={styles.commentsList}>
      {comments.map((comment, index) => (
        <Comment key={index} {...comment} as="li" />
      ))}
    </ul>
  )
}
