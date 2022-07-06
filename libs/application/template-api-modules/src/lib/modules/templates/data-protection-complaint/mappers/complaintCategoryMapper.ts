import { SubjectOfComplaint } from '@island.is/application/templates/data-protection-complaint'

export const subjectOfComplaintGoProValueLabelMapper = {
  [SubjectOfComplaint.WITH_AUTHORITIES]: 'Stjórnvöld',
  [SubjectOfComplaint.LACK_OF_EDUCATION]: 'Réttindi einstaklinga',
  [SubjectOfComplaint.SOCIAL_MEDIA]: 'Réttindi einstaklinga',
  [SubjectOfComplaint.REQUEST_FOR_ACCESS]: 'Réttindi einstaklinga',
  [SubjectOfComplaint.RIGHTS_OF_OBJECTION]: 'Réttindi einstaklinga',
  [SubjectOfComplaint.EMAIL]: 'Heimildir til vinnslu',
  [SubjectOfComplaint.NATIONAL_ID]: 'Kennitölur',
  [SubjectOfComplaint.EMAIL_IN_WORKPLACE]: 'tölvupóstur',
  [SubjectOfComplaint.UNAUTHORIZED_PUBLICATION]: 'Heimildir til vinnslu',
  [SubjectOfComplaint.VANSKILASKRA]: ['Lánshæfismat', 'vanskilaskrá'],
  [SubjectOfComplaint.VIDEO_RECORDINGS]: 'Rafræn vöktun',
  [SubjectOfComplaint.OTHER]: '',
}

export const subjectOfComplaintToGoProValues = (
  complaint: SubjectOfComplaint,
): string | string[] => {
  return subjectOfComplaintGoProValueLabelMapper[complaint]
}
