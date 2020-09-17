import { ApiProperty } from '@nestjs/swagger'

export enum CaseState {
  UNKNOWN = 'UNKNOWN',
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export enum CaseCustodyProvisions {
  _95_1_A = '_95_1_A', // a-lið 1. mgr. 95. gr.
  _95_1_B = '_95_1_B', // b-lið 1. mgr. 95. gr.
  _95_1_C = '_95_1_C', // c-lið 1. mgr. 95. gr.
  _95_1_D = '_95_1_D', // d-lið 1. mgr. 95. gr.
  _95_2 = '_95_2', // d-lið 1. mgr. 95. gr.
  _99_1_B = '_99_1_B', // b-lið 1. mgr. 99. gr.
}

export enum CaseCustodyRestrictions {
  ISOLATION = 'ISOLATION',
  VISITAION = 'VISITAION',
  COMMUNICATION = 'COMMUNICATION',
  MEDIA = 'MEDIA',
}

export enum NotificationType {
  HEADS_UP = 'HEADS_UP',
  READY_FOR_COURT = 'READY_FOR_COURT',
}

export class Notification {
  @ApiProperty()
  caseId: string

  @ApiProperty()
  type: NotificationType
}
