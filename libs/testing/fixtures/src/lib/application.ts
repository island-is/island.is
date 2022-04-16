import * as faker from 'faker'
import { MessageDescriptor } from 'react-intl'
import {
  ApplicationTypes,
  ApplicationStatus,
} from '@island.is/application/core'

type RecordObject<T = unknown> = Record<string, T>

type StaticTextObject = MessageDescriptor & {
  values?: RecordObject<any>
}

type StaticText = StaticTextObject | string

type ActionCardTag = 'red' | 'blueberry' | 'blue'

interface ActionCardMetaData {
  title?: string
  description?: string
  tag?: {
    label?: string
    variant?: ActionCardTag
  }
}

type Answer = string | number | boolean | Answer[] | FormValue

interface FormValue {
  [key: string]: Answer
}

interface DataProviderResult {
  data?: object | string | boolean | number
  date: Date
  reason?: StaticText
  status: 'failure' | 'success'
  statusCode?: number
}

interface ExternalData {
  [key: string]: DataProviderResult
}

interface Application {
  id: string
  state: string
  actionCard?: ActionCardMetaData
  applicant: string
  assignees: string[]
  typeId: ApplicationTypes
  modified: Date
  created: Date
  answers: FormValue
  externalData: ExternalData
  name?: string
  institution?: string
  progress?: number
  status: ApplicationStatus
}

export interface ApplicationWithAttachments extends Application {
  attachments: object
}

export const createApplication = (
  overrides?: Partial<ApplicationWithAttachments>,
): ApplicationWithAttachments => ({
  applicant: faker.helpers.replaceSymbolWithNumber('##########'),
  answers: {},
  assignees: [],
  attachments: {},
  created: new Date(),
  modified: new Date(),
  externalData: {},
  id: faker.random.word(),
  state: 'DRAFT',
  typeId: ApplicationTypes.EXAMPLE,
  name: '',
  status: ApplicationStatus.IN_PROGRESS,
  ...overrides,
})
