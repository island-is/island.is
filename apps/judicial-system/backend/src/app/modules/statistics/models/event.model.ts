import { ApiProperty } from '@nestjs/swagger'

type BaseEventType =
  | 'CASE_CREATED'
  | 'CASE_SENT_TO_COURT'
  | 'CASE_RECEIVED_BY_COURT'
  | 'COURT_DATE_SCHEDULED' // include with type, and the actual court date. Event date is the date when this is triggered
  | 'COURT_DATE_OCCURRED'

type RequestCaseEventType =
  | BaseEventType
  | 'DEFENDANT_ARRESTED'
  | 'COURT_SESSION_STARTED'
  | 'COURT_SESSION_ENDED'
  | 'RESTRICTION_ENDED'
  | 'ISOLATION_ENDED'
  | 'TRAVEL_BAN_ENDED'
  | 'REQUEST_APPEALED'
  | 'REQUEST_CONFIRMED'
  | 'COURT_RECORD_SIGNED'
  | 'RULING_SIGNED'
  | 'REQUEST_EXTENDED'
  | 'CASE_RECEIVED_BY_COURT_OF_APPEALS'

type IndictmentCaseEventType =
  | BaseEventType
  | 'SUBPOENA_SERVED'
  | 'RULING_ACKNOWLEDGED_IN_COURT'
  | 'INDICTMENT_COMPLETED'
  | 'VERDICT_CREATED'
  | 'VERDICT_SERVED'
  | 'INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR'
  | 'INDICTMENT_REVIEWED_BY_PUBLIC_PROSECUTOR'
  | 'CASE_SENT_TO_PRISON_ADMIN'
  | 'CASE_RECEIVED_BY_PRISON_ADMIN'

// TODO: Maybe have two models for request and indictments event
export class Event {
  @ApiProperty({ type: String })
  id!: string

  @ApiProperty({ type: String })
  type!: RequestCaseEventType | IndictmentCaseEventType
}
