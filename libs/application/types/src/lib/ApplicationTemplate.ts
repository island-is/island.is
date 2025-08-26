import { EventObject, MachineConfig } from 'xstate'
import { MachineOptions, StatesConfig } from 'xstate/lib/types'

import { Application } from './Application'
import {
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
} from './StateMachine'
import { ApplicationTypes } from './ApplicationTypes'
import { Schema, StaticText } from './Form'
import { AnswerValidator } from './AnswerValidator'
import { Features } from '@island.is/feature-flags'
import { AllowedDelegation } from './ApplicationAllowedDelegations'
import { CodeOwners } from '@island.is/shared/constants'
import { PruningApplication } from './ApplicationLifecycle'

export interface ApplicationTemplate<
  TContext extends ApplicationContext,
  TStateSchema extends ApplicationStateSchema<TEvents>,
  TEvents extends EventObject,
> {
  /**
   * @deprecated Use featureFlag instead.
   */
  readonly readyForProduction?: boolean
  readonly featureFlag?: Features
  readonly type: ApplicationTypes
  readonly codeOwner: CodeOwners
  readonly name:
    | StaticText
    | ((
        application: Application,
      ) => StaticText | { name: StaticText; value: string })
  readonly newApplicationButtonLabel?: StaticText
  readonly applicationText?: StaticText
  readonly institution?: StaticText
  readonly translationNamespaces?: string[]
  readonly allowMultipleApplicationsInDraft?: boolean
  readonly initialQueryParameter?: string
  readonly allowedDelegations?: AllowedDelegation[]
  readonly requiredScopes?: string[]
  readonly dataSchema: Schema
  readonly stateMachineConfig: MachineConfig<
    TContext,
    TStateSchema,
    TEvents
  > & {
    states: StatesConfig<TContext, TStateSchema, TEvents> // TODO Extend StatesConfig to completely enforce meta being required attribute
  }
  readonly stateMachineOptions?: Partial<MachineOptions<TContext, TEvents>>
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined
  answerValidators?: Record<string, AnswerValidator>
  /**
   * Defines which fields in `answers` and `externalData` remain after pruning
   * for admin portal visibility, and which of them should be explicitly listed there.
   * Note: All retained fields are removed during post-pruning.
   */
  readonly adminDataConfig?: {
    /**
     * Date or milliseconds after pruning when the application will be post-pruned.
     * At that time, all `answers` and `externalData` will be cleared.
     */
    whenToPostPrune: number | ((application: PruningApplication) => Date)
    /**
     * `key` - path to a value in the `answers` object.
     * `isListed` - whether the field should be explicitly listed in the admin portal.
     *   - If `false`, the field is only retained so it can be displayed normally until pruning (e.g. in pendingActionCard).
     * `label` - only used when `isListed` is `true`, as the display label in the admin portal.
     * If array use dollar sign for index ($), e.g. 'key.$.subKey'
     */
    answers?: { key: string; isListed: boolean; label?: StaticText }[]
    /**
     * `key` - path to a value in the `externalData` object.
     * Should include the applicant's name, usually from:
     * - nationalRegistry.data.fullName
     * - identity.data.name
     */
    externalData?: { key: string }[]
  }
}
