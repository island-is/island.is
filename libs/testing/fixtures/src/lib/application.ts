import * as faker from 'faker'
import { MessageDescriptor } from 'react-intl'
import {
  ApplicationTypes,
  ApplicationStatus,
  ApplicationStateSchema,
  ApplicationContext,
  ApplicationRole,
  DefaultStateLifeCycle,
  buildForm,
  AnswerValidator,
} from '@island.is/application/core'
import { Features } from '@island.is/feature-flags'
import { AuthDelegationType } from '@island.is/auth-nest-tools'
import {
  EventObject,
  MachineConfig,
  MachineOptions,
  StatesConfig,
} from 'xstate'
import * as z from 'zod'

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
  applicantActors: string[]
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
  applicantActors: [],
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

type Schema = z.ZodObject<any>

interface Template<
  TContext extends ApplicationContext,
  TStateSchema extends ApplicationStateSchema<TEvents>,
  TEvents extends EventObject
> {
  readyForProduction?: boolean
  featureFlag?: Features
  type: ApplicationTypes
  name: string
  institution: string
  translationNamespaces?: string[]
  allowedDelegations?: AuthDelegationType[]
  dataSchema: Schema
  stateMachineConfig: MachineConfig<TContext, TStateSchema, TEvents> & {
    states: StatesConfig<TContext, TStateSchema, TEvents> // TODO Extend StatesConfig to completely enforce meta being required attribute
  }
  stateMachineOptions?: Partial<MachineOptions<TContext, TEvents>>
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined
  answerValidators?: Record<string, AnswerValidator>
}

export const createApplicationTemplate = (
  overrides?: Partial<
    Template<
      ApplicationContext,
      ApplicationStateSchema<EventObject>,
      EventObject
    >
  >,
): Template<
  ApplicationContext,
  ApplicationStateSchema<EventObject>,
  EventObject
> => ({
  mapUserToRole(nationalId: string): ApplicationRole {
    if (nationalId === '111111-3000') {
      return 'applicant'
    }
    return 'reviewer'
  },
  type: ApplicationTypes.EXAMPLE,
  name: 'Test application',
  institution: 'Test institution',
  dataSchema: z.object({
    person: z.object({
      age: z.number().min(18),
      pets: z.array(
        z.object({ name: z.string().nonempty(), kind: z.enum(['dog', 'cat']) }),
      ),
    }),
    externalReviewAccepted: z.boolean(),
    wantsInsurance: z.boolean(),
    wantsCake: z.boolean(),
  }),
  stateMachineConfig: {
    initial: 'draft',
    states: {
      draft: {
        meta: {
          name: 'draft',
          progress: 0.33,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              actions: [{ event: 'SUBMIT', name: 'Submit', type: 'primary' }],
              id: 'applicant',
              formLoader: () =>
                Promise.resolve(
                  buildForm({
                    id: 'ParentalLeave',
                    title: 'parentalLeave',
                    children: [],
                  }),
                ),
              write: {
                answers: ['person', 'wantsInsurance'],
                externalData: ['salary'],
              },
              delete: true,
              shouldBeListedForRole: true,
            },
          ],
        },
        on: {
          SUBMIT: { target: 'inReview' },
        },
      },
      inReview: {
        meta: {
          name: 'In Review',
          progress: 0.66,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: 'applicant',
            },
            {
              id: 'reviewer',
              read: 'all' as const,
              write: {
                answers: [],
                externalData: [],
              },
              shouldBeListedForRole: false,
            },
          ],
        },
        on: {
          APPROVE: { target: 'approved' },
          REJECT: { target: 'draft' },
        },
      },
      approved: {
        meta: {
          name: 'Approved',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
        },
        type: 'final' as const,
      },
      rejected: {
        meta: {
          name: 'Rejected',
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: 'applicant',
              write: 'all',
            },
          ],
        },
      },
    },
  },
  ...overrides,
})
