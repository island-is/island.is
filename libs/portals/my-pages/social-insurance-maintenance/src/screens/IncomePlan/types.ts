export type Status =
  | 'no_data'
  | 'in_progress'
  | 'in_review'
  | 'accepted'
  | 'rejected'
  | 'unknown'
  | 'error'

export type ApplicationStatus =
  | 'draft'
  | 'tryggingastofnunSubmitted'
  | 'tryggingastofnunInReview'
  | 'completed'
