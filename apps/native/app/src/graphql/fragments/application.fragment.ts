import {gql} from '@apollo/client';

export const ApplicationFragment = gql`
  fragment ApplicationFragment on Application {
    id
    created
    modified
    applicant
    state
    typeId
    name
    progress
    status
  }
`;

enum ApplicationTypeId {
  EXAMPLE_FORM = 'ExampleForm',
  PASSPORT = 'Passport',
  DRIVING_LESSONS = 'DrivingLessons',
  DRIVING_LICENSE = 'DrivingLicense',
  PARENTAL_LEAVE = 'ParentalLeave',
  META_APPLICATION = 'MetaApplication',
  DOCUMENT_PROVIDER_ONBOARDING = 'DocumentProviderOnboarding',
  HEALTH_INSURANCE = 'HealthInsurance',
  CHILDREN_RESIDENCE_CHANGE = 'ChildrenResidenceChange',
  DATA_PROTECTION_AUTHORITY_COMPLAINT = 'DataProtectionAuthorityComplaint',
  PARTY_LETTER = 'PartyLetter',
}

enum ApplicationStatus {
  IN_PROGRESS = 'inprogress',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

export interface IApplication {
  id: string;
  created: string;
  modified: string;
  applicant: string;
  assignees: string[];
  state: string;
  attachments: any;
  typeId: ApplicationTypeId;
  answers: any;
  externalData: any;
  name?: string;
  progress: number;
  status: ApplicationStatus;
}
