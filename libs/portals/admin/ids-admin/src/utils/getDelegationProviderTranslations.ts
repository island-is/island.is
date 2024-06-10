import upperFirst from 'lodash/upperFirst'

import { m } from '../lib/messages'
import { AuthAdminDelegationProvider } from '@island.is/api/schema'
import { FormatMessage } from '@island.is/localization'

// This function is used to get the translation keys for delegation providers and delegation types
const getDelegationTypeTranslationKey = ({
  id,
  isDelegationType,
  type,
  prefix,
}: {
  prefix: string
  id: string
  isDelegationType: boolean
  type: 'name' | 'description'
}) => {
  return (
    prefix +
    (isDelegationType ? 'Type' : 'Provider') +
    upperFirst(id.replace(':', '')) +
    upperFirst(type)
  )
}

// This function is used to get the translations objects for the delegation providers and their delegation types
export const getDelegationProviderTranslations =
  (prefix: string, formatMessage: FormatMessage) =>
  (provider: AuthAdminDelegationProvider) => {
    const providerNameTranslationKey = getDelegationTypeTranslationKey({
      prefix,
      id: provider.id,
      isDelegationType: false,
      type: 'name',
    })
    const providerDescriptionTranslationKey = getDelegationTypeTranslationKey({
      prefix,
      id: provider.id,
      isDelegationType: false,
      type: 'description',
    })

    const providerNameTranslation = Object.entries(m).find(
      ([key]) => key === providerNameTranslationKey,
    )
    const providerDescriptionTranslation = Object.entries(m).find(
      ([key]) => key === providerDescriptionTranslationKey,
    )

    if (!providerNameTranslation) {
      return null
    }

    const delegationTypes = provider.delegationTypes
      .map((delegationType) => {
        const delegationTypeNameTranslationKey =
          getDelegationTypeTranslationKey({
            prefix,
            id: delegationType.id,
            isDelegationType: true,
            type: 'name',
          })
        const delegationTypeDescriptionTranslationKey =
          getDelegationTypeTranslationKey({
            prefix,
            id: delegationType.id,
            isDelegationType: true,
            type: 'description',
          })

        const delegationTypeNameTranslation = Object.entries(m).find(
          ([key]) => key === delegationTypeNameTranslationKey,
        )
        const delegationTypeDescriptionTranslation = Object.entries(m).find(
          ([key]) => key === delegationTypeDescriptionTranslationKey,
        )

        if (
          delegationTypeNameTranslation ||
          delegationTypeDescriptionTranslation
        ) {
          return {
            ...delegationType,
            name: delegationTypeNameTranslation
              ? formatMessage(delegationTypeNameTranslation[1])
              : '',
            description: delegationTypeDescriptionTranslation
              ? formatMessage(delegationTypeDescriptionTranslation[1])
              : '',
          }
        }

        return null
      })
      .filter(Boolean)
      .sort((a, b) => {
        // should not happen because we are filtering out null values
        if (!a || !b) {
          return 1
        }

        return a.name.localeCompare(b.name)
      })

    if (delegationTypes.length === 0) {
      return null
    }

    return {
      ...provider,
      name: formatMessage(providerNameTranslation[1]),
      description: providerDescriptionTranslation
        ? formatMessage(providerDescriptionTranslation[1])
        : '',
      delegationTypes,
    }
  }
