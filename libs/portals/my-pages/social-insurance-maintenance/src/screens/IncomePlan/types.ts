export type Status =
  | 'no_data'
  | 'in_progress'
  | 'in_review'
  | 'accepted'
  | 'accepted_no_changes'
  | 'rejected'
  | 'rejected_no_changes'
  | 'unknown'
  | 'error'
  | 'loading'

export type ApplicationStatus =
  | 'draft'
  | 'tryggingastofnunSubmitted'
  | 'tryggingastofnunInReview'
  | 'completed'
