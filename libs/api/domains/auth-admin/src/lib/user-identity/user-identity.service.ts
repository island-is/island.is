import { Injectable } from '@nestjs/common'
import * as kennitala from 'kennitala'

import { User } from '@island.is/auth-nest-tools'
import {
  Claim as GeneratedClaim,
  UserIdentity as GeneratedUserIdentity,
} from '@island.is/clients/auth/admin-api'
import { Environment } from '@island.is/shared/types'

import { environments } from '../shared/constants/environments'
import { DeleteEnvironmentResult } from '../shared/models/delete-environment-result.model'
import { EnvironmentFailure } from '../shared/models/multi-environment-result.model'
import { MultiEnvironmentService } from '../shared/services/multi-environment.service'
import { UserIdentitiesInput } from './dto/user-identities.input'
import { UserIdentityClaim } from './models/user-identity-claim.model'
import { UserIdentityEnvironment } from './models/user-identity-environment.model'
import { UserIdentity } from './models/user-identity.model'

const mapClaim = (claim: GeneratedClaim): UserIdentityClaim => ({
  type: claim.type,
  value: claim.value,
  valueType: claim.valueType,
  issuer: claim.issuer,
  originalIssuer: claim.originalIssuer,
})

const toFailure = (
  environment: Environment,
  error: unknown,
): EnvironmentFailure => ({
  environment,
  message: error instanceof Error ? error.message : 'Unknown error',
})

@Injectable()
export class UserIdentityService extends MultiEnvironmentService {
  getAvailableEnvironments(): Environment[] {
    return this.getConfiguredEnvironments()
  }

  async findUserIdentities(
    user: User,
    input: UserIdentitiesInput,
  ): Promise<UserIdentity[]> {
    const trimmed = input.searchString?.trim()
    if (!trimmed) {
      return []
    }

    const isNationalId = kennitala.isValid(trimmed)

    const results = await Promise.allSettled(
      environments.map(async (environment) => {
        if (isNationalId) {
          const result = await this.makeRequest(user, environment, (api) =>
            api.meUserIdentitiesControllerFindByNationalIdRaw({
              xQueryNationalId: trimmed,
            }),
          )
          return result ? { environment, data: result } : null
        }

        const result = await this.makeRequest(user, environment, (api) =>
          api.meUserIdentitiesControllerFindBySubjectIdRaw({
            subjectId: trimmed,
          }),
        )
        return result ? { environment, data: [result] } : null
      }),
    )

    type RowAggregate = {
      base: GeneratedUserIdentity
      perEnv: Map<Environment, GeneratedUserIdentity>
    }
    const rowMap = new Map<string, RowAggregate>()

    for (let index = 0; index < results.length; index++) {
      const result = results[index]
      const environment = environments[index]
      if (result.status === 'rejected') {
        this.logger.warn(
          `User identity search failed in ${environment}: ${
            result.reason instanceof Error
              ? result.reason.message
              : String(result.reason)
          }`,
        )
        continue
      }
      if (!result.value) {
        this.logger.warn(
          `User identity search returned empty response from ${environment} (env not configured or empty body)`,
        )
        continue
      }
      const { data } = result.value
      for (const row of data) {
        const existing = rowMap.get(row.subjectId)
        if (existing) {
          existing.perEnv.set(environment, row)
        } else {
          rowMap.set(row.subjectId, {
            base: row,
            perEnv: new Map([[environment, row]]),
          })
        }
      }
    }

    const rows: UserIdentity[] = []
    for (const { base, perEnv } of rowMap.values()) {
      const availableEnvironments = Array.from(perEnv.keys())
      const activeEnvironments = availableEnvironments.filter(
        (env) => perEnv.get(env)?.active === true,
      )
      const deactivatedEnvironments = availableEnvironments.filter(
        (env) => perEnv.get(env)?.active === false,
      )

      const claimsByKey = new Map<string, UserIdentityClaim>()
      for (const row of perEnv.values()) {
        for (const claim of row.claims ?? []) {
          const key = `${claim.type}:${claim.value}`
          if (!claimsByKey.has(key)) {
            claimsByKey.set(key, mapClaim(claim))
          }
        }
      }

      const environmentsList: UserIdentityEnvironment[] = []
      for (const [env, row] of perEnv.entries()) {
        environmentsList.push({
          environment: env,
          active: row.active,
          claims: (row.claims ?? []).map(mapClaim),
        })
      }

      rows.push({
        subjectId: base.subjectId,
        name: base.name,
        providerName: base.providerName,
        providerSubjectId: base.providerSubjectId,
        availableEnvironments,
        activeEnvironments,
        deactivatedEnvironments,
        claims: Array.from(claimsByKey.values()),
        environments: environmentsList,
      })
    }

    rows.sort((a, b) => a.subjectId.localeCompare(b.subjectId))
    return rows
  }

  async setActive(
    user: User,
    subjectId: string,
    active: boolean,
    targetEnvironments: Environment[],
  ): Promise<DeleteEnvironmentResult> {
    const isFallback = targetEnvironments.length === 0
    const envsToUpdate = isFallback ? environments : targetEnvironments

    const affectedEnvironments: Environment[] = []
    const failedEnvironments: EnvironmentFailure[] = []

    for (const environment of envsToUpdate) {
      try {
        const result = await this.makeRequest(user, environment, (api) =>
          api.meUserIdentitiesControllerSetActiveRaw({
            subjectId,
            activeDTO: { active },
          }),
        )
        if (result) {
          affectedEnvironments.push(environment)
        } else if (isFallback && !this.isEnvironmentConfigured(environment)) {
          continue
        } else {
          failedEnvironments.push({
            environment,
            message:
              'No response from environment (not configured or empty response)',
          })
        }
      } catch (error) {
        this.logger.error(
          `Failed to ${
            active ? 'reactivate' : 'deactivate'
          } user identity in ${environment}`,
          error as Error,
        )
        failedEnvironments.push(toFailure(environment, error))
      }
    }

    if (affectedEnvironments.length === 0) {
      throw new Error(
        `Failed to ${
          active ? 'reactivate' : 'deactivate'
        } user identity in all environments`,
      )
    }

    return {
      success: failedEnvironments.length === 0,
      affectedEnvironments,
      ...(failedEnvironments.length > 0 && { failedEnvironments }),
    }
  }
}
