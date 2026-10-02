import { DefaultEvents } from '@island.is/application/types'

export type Events = { type: DefaultEvents.SUBMIT }

export enum States {
  PREREQUISITE = 'prerequisite',
  MAIN = 'main',
  COMPLETED = 'completed',
}

export enum Roles {
  APPLICANT = 'applicant',
}

export enum SurveyOption {
  OPTION_ONE = 'optionOne',
  OPTION_TWO = 'optionTwo',
}
