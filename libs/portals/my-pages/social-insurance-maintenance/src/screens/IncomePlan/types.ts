export type Status =
  | 'no_data' // done
  | 'in_progress' //done
  | 'in_review' //done
  | 'accepted' // done
  | 'accepted_no_changes' // done
  | 'rejected' // done
  | 'rejected_no_changes' // done
  | 'modify_accepted'
  | 'error'
  | 'loading'

export type ApplicationStatus =
  | 'draft'
  | 'tryggingastofnunSubmitted'
  | 'tryggingastofnunInReview'
  | 'completed'
