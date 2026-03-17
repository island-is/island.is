import React, { useCallback, useEffect, useMemo } from 'react'
import { useQuery } from '@apollo/client'
import isEqual from 'lodash/isEqual'
import { MultiValue } from 'react-select'

import { useLocale } from '@island.is/localization'
import {
  Box,
  Checkbox,
  Hidden,
  Select,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/shared/types'

import { usePermission } from '../PermissionContext'
import { FormCard } from '../../../components/FormCard/FormCard'
import { m } from '../../../lib/messages'
import { PermissionFormTypes } from '../EditPermission.schema'
import { useEnvironmentState } from '../../../hooks/useEnvironmentState'
import { checkEnvironmentsSync } from '../../../utils/checkEnvironmentsSync'
import { useDelegationProviders } from '../../../context/DelegationProviders/DelegationProvidersContext'
import { getDelegationProviderTranslations } from '../../../utils/getDelegationProviderTranslations'
import { useSuperAdmin } from '../../../hooks/useSuperAdmin'
import {
  GetScopeCategoriesDocument,
  GetScopeCategoriesQuery,
  GetScopeTagsDocument,
  GetScopeTagsQuery,
} from './PermissionCategoriesAndTags.generated'

const FIELD_PREFIX = 'field-'

type Option = { label: string; value: string; description: string }
type Category = GetScopeCategoriesQuery['authAdminScopeCategories'][number]
type Tag = GetScopeTagsQuery['authAdminScopeTags'][number]

export const PermissionDelegations = ({
  isNewPermissionsOptionsEnabled = false,
}: {
  isNewPermissionsOptionsEnabled?: boolean
} = {}) => {
  const { formatMessage, lang } = useLocale()
  const { selectedPermission, permission } = usePermission()
  const { isSuperAdmin } = useSuperAdmin()
  const {
    isAccessControlled,
    grantToAuthenticatedUser,
    supportedDelegationTypes,
  } = selectedPermission
  const { getDelegationProviders } = useDelegationProviders()

  const delegationProviders = getDelegationProviders(
    selectedPermission.environment,
  )

  const providers = delegationProviders.map(
    getDelegationProviderTranslations('apiScopeDelegation', formatMessage),
  )

  const [inputValues, setInputValues] = useEnvironmentState<{
    isAccessControlled: boolean
    grantToAuthenticatedUser: boolean
    supportedDelegationTypes: string[]
    addedDelegationTypes: string[]
    removedDelegationTypes: string[]
  }>({
    isAccessControlled,
    grantToAuthenticatedUser,
    supportedDelegationTypes,
    addedDelegationTypes: [],
    removedDelegationTypes: [],
  })

  const showCategoriesAndTags =
    isNewPermissionsOptionsEnabled &&
    inputValues.supportedDelegationTypes?.includes(AuthDelegationType.Custom)

  const { data: categoriesData, loading: categoriesLoading } = useQuery(
    GetScopeCategoriesDocument,
    {
      variables: { lang },
      skip: !showCategoriesAndTags,
    },
  )
  const { data: tagsData, loading: tagsLoading } = useQuery(
    GetScopeTagsDocument,
    {
      variables: { lang },
      skip: !showCategoriesAndTags,
    },
  )

  const categories: Option[] = useMemo(
    () =>
      categoriesData?.authAdminScopeCategories.map((cat: Category) => ({
        label: cat.title,
        value: cat.id,
        description: cat.description ?? '',
      })) ?? [],
    [categoriesData?.authAdminScopeCategories],
  )
  const tags: Option[] = useMemo(
    () =>
      tagsData?.authAdminScopeTags.map((tag: Tag) => ({
        label: tag.title,
        value: tag.id,
        description: tag.description ?? '',
      })) ?? [],
    [tagsData?.authAdminScopeTags],
  )

  const [selectedCategories, setSelectedCategories] = useEnvironmentState<
    MultiValue<Option>
  >([])
  const [selectedTags, setSelectedTags] = useEnvironmentState<
    MultiValue<Option>
  >([])

  useEffect(() => {
    if (
      !showCategoriesAndTags ||
      (tags.length === 0 && categories.length === 0)
    )
      return
    setSelectedCategories(
      (selectedPermission.categoryIds ?? [])
        .map((id) => categories.find((c) => c.value === id))
        .filter((c): c is Option => c !== undefined),
    )
    setSelectedTags(
      (selectedPermission.tagIds ?? [])
        .map((id) => tags.find((t) => t.value === id))
        .filter((t): t is Option => t !== undefined),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCategoriesAndTags, tags, categories])

  const customValidation = useCallback(
    (newFormData: FormData, prevFormData: FormData) => {
      if (!showCategoriesAndTags) return false
      const parse = (v: FormDataEntryValue | null): string[] => {
        if (v == null || typeof v !== 'string') return []
        try {
          const a = JSON.parse(v)
          return Array.isArray(a) && a.every((x) => typeof x === 'string')
            ? a
            : []
        } catch {
          return []
        }
      }
      return (
        !isEqual(
          parse(newFormData.get('categoryIds')),
          parse(prevFormData.get('categoryIds')),
        ) ||
        !isEqual(
          parse(newFormData.get('tagIds')),
          parse(prevFormData.get('tagIds')),
        )
      )
    },
    [showCategoriesAndTags],
  )

  const loadingCategoriesAndTags = categoriesLoading || tagsLoading

  const toggleDelegationType = (field: string, checked: boolean) => {
    const type = field.split('-')[1]

    if (checked) {
      const newInputValues = { ...inputValues }
      // should not be in removed delegation types if field is checked
      if (inputValues.removedDelegationTypes.includes(type)) {
        newInputValues.removedDelegationTypes =
          inputValues.removedDelegationTypes.filter((t) => t !== type)
      }

      // if not in supported delegation types, user is adding it for the first time
      if (!supportedDelegationTypes.includes(type)) {
        newInputValues.addedDelegationTypes = [
          ...inputValues.addedDelegationTypes,
          type,
        ]
        newInputValues.supportedDelegationTypes = [
          ...inputValues.supportedDelegationTypes,
          type,
        ]
      }

      // if already in supported delegation types, user is re-adding it
      if (supportedDelegationTypes.includes(type)) {
        newInputValues.supportedDelegationTypes = [
          ...inputValues.supportedDelegationTypes,
          type,
        ]
      }

      setInputValues(newInputValues)
    } else {
      const newInputValues = { ...inputValues }
      // should not be in added delegation types if field is not checked
      if (inputValues.addedDelegationTypes.includes(type)) {
        newInputValues.addedDelegationTypes =
          inputValues.addedDelegationTypes.filter((t) => t !== type)
      }
      // should not be in supported delegation types if field is not checked
      if (inputValues.supportedDelegationTypes.includes(type)) {
        newInputValues.supportedDelegationTypes =
          inputValues.supportedDelegationTypes.filter((t) => t !== type)
      }

      // if not in removed delegation types, user is removing it for the first time
      if (supportedDelegationTypes.includes(type)) {
        newInputValues.removedDelegationTypes = [
          ...inputValues.removedDelegationTypes,
          type,
        ]
      }

      setInputValues(newInputValues)
    }
  }

  const supportsCustomDelegation =
    selectedPermission.supportedDelegationTypes?.includes(
      AuthDelegationType.Custom,
    ) ?? false

  return (
    <FormCard
      title={formatMessage(m.delegations)}
      intent={PermissionFormTypes.DELEGATIONS}
      inSync={checkEnvironmentsSync(permission.environments, [
        'supportedDelegationTypes',
        ...(supportsCustomDelegation
          ? (['categoryIds', 'tagIds'] as const)
          : []),
      ])}
      customValidation={customValidation}
    >
      <Stack space={4}>
        {providers.map((provider) =>
          !provider ||
          (!isSuperAdmin &&
            provider.id ===
              AuthDelegationProvider.PersonalRepresentativeRegistry) ? null : (
            <Stack space={2} key={provider.id}>
              <div>
                <Text variant="h5" as="h4" paddingBottom={1}>
                  {provider.name}
                </Text>
                <Text variant="small" as="h5">
                  {provider.description}
                </Text>
              </div>
              <Stack space={3} component="ul">
                {provider.delegationTypes.map((delegationType) =>
                  !delegationType ? null : (
                    <Checkbox
                      key={delegationType.id}
                      label={delegationType.name}
                      backgroundColor={'blue'}
                      large
                      name={`${FIELD_PREFIX}${delegationType.id}`}
                      value="true"
                      checked={inputValues.supportedDelegationTypes?.includes(
                        delegationType.id,
                      )}
                      onChange={(e) =>
                        toggleDelegationType(e.target.name, e.target.checked)
                      }
                      subLabel={delegationType.description}
                      children={
                        provider.id === AuthDelegationProvider.Custom &&
                        delegationType.id === AuthDelegationType.Custom &&
                        showCategoriesAndTags ? (
                          <Stack space={3}>
                            <Box marginBottom={2}>
                              <Text paddingBottom={1}>
                                {formatMessage(m.categories)}
                              </Text>
                              <Text variant="small" as="p">
                                {formatMessage(m.categoriesDescription)}
                              </Text>
                              {loadingCategoriesAndTags ? (
                                <Text>{formatMessage(m.loading)}</Text>
                              ) : categories.length === 0 ? (
                                <Text>{formatMessage(m.noCategories)}</Text>
                              ) : (
                                <Stack space={1}>
                                  <input
                                    type="hidden"
                                    name="categoryIds"
                                    value={JSON.stringify(
                                      selectedCategories.map((c) => c.value),
                                    )}
                                  />
                                  <input
                                    type="hidden"
                                    name="originalCategoryIds"
                                    value={JSON.stringify(
                                      selectedPermission.categoryIds ?? [],
                                    )}
                                  />
                                  <Select
                                    value={selectedCategories}
                                    options={categories}
                                    onChange={(value) =>
                                      setSelectedCategories(
                                        value as MultiValue<Option>,
                                      )
                                    }
                                    placeholder={formatMessage(
                                      m.selectCategoriesPlaceholder,
                                    )}
                                    isMulti
                                    size="xs"
                                  />
                                </Stack>
                              )}
                            </Box>
                            <Box>
                              <Text paddingBottom={1}>
                                {formatMessage(m.tags)}
                              </Text>
                              <Text variant="small" as="p">
                                {formatMessage(m.tagsDescription)}
                              </Text>
                              {loadingCategoriesAndTags ? (
                                <Text>{formatMessage(m.loading)}</Text>
                              ) : tags.length === 0 ? (
                                <Text>{formatMessage(m.noTags)}</Text>
                              ) : (
                                <Stack space={1}>
                                  <input
                                    type="hidden"
                                    name="tagIds"
                                    value={JSON.stringify(
                                      selectedTags.map((t) => t.value),
                                    )}
                                  />
                                  <input
                                    type="hidden"
                                    name="originalTagIds"
                                    value={JSON.stringify(
                                      selectedPermission.tagIds ?? [],
                                    )}
                                  />
                                  <Select
                                    value={selectedTags}
                                    options={tags}
                                    onChange={(value) =>
                                      setSelectedTags(
                                        value as MultiValue<Option>,
                                      )
                                    }
                                    placeholder={formatMessage(
                                      m.selectTagsPlaceholder,
                                    )}
                                    isMulti
                                    size="xs"
                                  />
                                </Stack>
                              )}
                            </Box>
                          </Stack>
                        ) : undefined
                      }
                    />
                  ),
                )}
              </Stack>
            </Stack>
          ),
        )}
        {inputValues.removedDelegationTypes.map((type) => (
          <Hidden key={type} print screen>
            <input type="hidden" name="removedDelegationTypes" value={type} />
          </Hidden>
        ))}
        {inputValues.addedDelegationTypes.map((type) => (
          <Hidden key={type} print screen>
            <input type="hidden" name="addedDelegationTypes" value={type} />
          </Hidden>
        ))}
      </Stack>
    </FormCard>
  )
}
