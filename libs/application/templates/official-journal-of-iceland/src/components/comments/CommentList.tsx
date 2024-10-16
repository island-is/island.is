import { SkeletonLoader } from '@island.is/island-ui/core'
import type { Props as CommentProps } from './Comment'
import { Comment } from './Comment'
import * as styles from './Comments.css'
import { OJOI_INPUT_HEIGHT } from '../../lib/constants'

type Props = {
  comments?: CommentProps[]
  loading?: boolean
}

export const CommentsList = ({ comments, loading }: Props) => {
  if (loading) {
    return (
      <SkeletonLoader
        repeat={3}
        space={1}
        height={OJOI_INPUT_HEIGHT}
        borderRadius="standard"
      />
    )
  }

  return (
    <ul className={styles.commentsList}>
      {comments?.map((comment, index) => (
        <Comment key={index} {...comment} as="li" />
      ))}
    </ul>
  )
}
