export type Status =
  | 'no_data' //tested
  | 'in_progress' //tested
  | 'in_review' //tested
  | 'accepted' //tested
  | 'accepted_no_changes' //tested
  | 'rejected' //iffy
  | 'rejected_no_changes' //iffy
  | 'unknown' //iffy
  | 'error' //tested
  | 'loading' //tested

export type ApplicationStatus =
  | 'draft'
  | 'tryggingastofnunSubmitted'
  | 'tryggingastofnunInReview'
  | 'completed'
