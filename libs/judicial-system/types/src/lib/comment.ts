export enum CommentType {
  POSTPONED_INDEFINITELY_EXPLANATION = 'POSTPONED_INDEFINITELY_EXPLANATION',
}

export interface ExplanatoryComment {
  comment: string
  commentType: CommentType
}
