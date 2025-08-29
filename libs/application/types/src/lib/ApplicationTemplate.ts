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
   * Configuration for retaining and displaying specific fields in the admin portal after pruning.
   *
   * After pruning, most data from `answers` and `externalData` is removed. This config allows
   * certain fields to be temporarily retained for admin portal visibility. These fields will be
   * fully removed during post-pruning.
   */
  readonly adminDataConfig?: {
    /**
     * When the application should be post-pruned.
     * Can be either:
     * - A number (milliseconds after pruning), e.g., `2 * 365 * 24 * 3600 * 1000` for 2 years.
     * - A function returning a Date, e.g., `(application) => addMonths(new Date(), 6)`.
     *
     * At post-pruning, all remaining `answers` and `externalData` will be cleared.
     */
    whenToPostPrune: number | ((application: PruningApplication) => Date)

    /**
     * List of fields from the `answers` object to retain after pruning.
     *
     * Each item includes:
     * - `key`: Path to a value in `answers`. Supports dot notation for nested fields.
     * - `isListed`: If `true`, the field will be explicitly displayed in the admin portal.
     *               If `false`, the field is only retained for internal display (e.g., pendingActionCard).
     * - `label`: Optional. Only applies when `isListed` is `true`. This is the display label in the admin portal.
     *
     * **Array support**:
     * Use `$` as a wildcard for array elements (single level only).
     * For example:
     *   - `coOwners.$.name` - Keeps `name` for each item in `coOwners`.
     *
     * Example:
     * answers: [
     *   { key: 'buyer.name', isListed: true, label: 'Buyer Name' },
     *   { key: 'coOwners.$.name', isListed: false },
     *   { key: 'coOwners.$.nationalId', isListed: false },
     * ]
     */
    answers?: { key: string; isListed: boolean; label?: StaticText }[]

    /**
     * List of fields from the `externalData` object to retain after pruning.
     *
     * Each item includes:
     * - `key`: Path to a value in `externalData`.
     *
     * Example:
     * externalData: [
     *   { key: 'currentVehicle.data.permno' }
     * ]
     */
    externalData?: { key: string }[]
  }
}
