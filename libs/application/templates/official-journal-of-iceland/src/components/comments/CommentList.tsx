import { SkeletonLoader } from '@island.is/island-ui/core'
import { Comment } from './Comment'
import * as styles from './Comments.css'
import { OJOI_INPUT_HEIGHT } from '../../lib/constants'
import { OjoiaComment } from '@island.is/api/schema'

type Props = {
  comments?: Array<OjoiaComment>
  loading?: boolean
}

export const CommentsList = ({ comments, loading }: Props) => {
  if (loading) {
    return (
      <SkeletonLoader
        repeat={3}
        space={1}
        height={OJOI_INPUT_HEIGHT}
        borderRadius="xs"
      />
    )
  }

  return (
    <ul className={styles.commentsList}>
      {comments?.map((comment, index) => (
        <Comment key={index} {...comment} />
      ))}
    </ul>
  )
}
