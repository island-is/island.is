export enum AccidentNotificationStatusEnum {
  ACCEPTED = 'ACCEPTED',
  REFUSED = 'REFUSED',
  INPROGRESS = 'INPROGRESS',
  INPROGRESSWAITINGFORDOCUMENT = 'INPROGRESSWAITINGFORDOCUMENT',
}

export interface SubmittedApplicationData {
  data?: {
    documentId: string
  }
}

export interface ApplicationStatusProps {
  field: {
    props: {
      isAssignee: boolean
    }
  }
}
