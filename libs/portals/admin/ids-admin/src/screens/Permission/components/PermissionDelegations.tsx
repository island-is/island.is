import React, { useCallback, useEffect, useMemo } from 'react'
import { useQuery } from '@apollo/client'
import isEqual from 'lodash/isEqual'
import { MultiValue } from 'react-select'

import { useLocale } from '@island.is/localization'
import {
  Box,
  Checkbox,
  Divider,
  Hidden,
  Input,
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
const THIRD_PARTY_URL_SEPARATOR = '?login_hint={{subjectId}}&target_link_uri='

const parseThirdPartyLoginUrl = (
  url?: string,
): { originUrl: string; targetLinkUri: string } => {
  if (!url) return { originUrl: '', targetLinkUri: '' }
  const idx = url.indexOf(THIRD_PARTY_URL_SEPARATOR)
  if (idx === -1) return { originUrl: '', targetLinkUri: '' }
  return {
    originUrl: url.substring(0, idx),
    targetLinkUri: url.substring(idx + THIRD_PARTY_URL_SEPARATOR.length),
  }
}

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

  const parsedUrl = parseThirdPartyLoginUrl(
    (selectedPermission as { thirdPartyLoginUrl?: string }).thirdPartyLoginUrl,
  )

  const [inputValues, setInputValues] = useEnvironmentState<{
    isAccessControlled: boolean
    grantToAuthenticatedUser: boolean
    supportedDelegationTypes: string[]
    addedDelegationTypes: string[]
    removedDelegationTypes: string[]
    originUrl: string
    targetLinkUri: string
  }>({
    isAccessControlled,
    grantToAuthenticatedUser,
    supportedDelegationTypes,
    addedDelegationTypes: [],
    removedDelegationTypes: [],
    originUrl: parsedUrl.originUrl,
    targetLinkUri: parsedUrl.targetLinkUri,
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
  const [categoriesTagsDirty, setCategoriesTagsDirty] =
    useEnvironmentState(false)

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
    (_newFormData: FormData, _prevFormData: FormData) => {
      if (!showCategoriesAndTags) return false
      return categoriesTagsDirty
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      showCategoriesAndTags,
      categoriesTagsDirty,
      selectedCategories,
      selectedTags,
    ],
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
                                    onChange={(value) => {
                                      const newIds = (
                                        value as MultiValue<Option>
                                      ).map((c) => c.value)
                                      setCategoriesTagsDirty(
                                        !isEqual(
                                          newIds,
                                          selectedPermission.categoryIds ?? [],
                                        ) ||
                                          !isEqual(
                                            selectedTags.map((t) => t.value),
                                            selectedPermission.tagIds ?? [],
                                          ),
                                      )
                                      setSelectedCategories(
                                        value as MultiValue<Option>,
                                      )
                                    }}
                                    placeholder={formatMessage(
                                      m.selectCategoriesPlaceholder,
                                    )}
                                    isMulti
                                    size="sm"
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
                                    onChange={(value) => {
                                      const newIds = (
                                        value as MultiValue<Option>
                                      ).map((t) => t.value)
                                      setCategoriesTagsDirty(
                                        !isEqual(
                                          selectedCategories.map(
                                            (c) => c.value,
                                          ),
                                          selectedPermission.categoryIds ?? [],
                                        ) ||
                                          !isEqual(
                                            newIds,
                                            selectedPermission.tagIds ?? [],
                                          ),
                                      )
                                      setSelectedTags(
                                        value as MultiValue<Option>,
                                      )
                                    }}
                                    placeholder={formatMessage(
                                      m.selectTagsPlaceholder,
                                    )}
                                    isMulti
                                    size="sm"
                                  />
                                </Stack>
                              )}
                            </Box>
                            <Divider />
                            <Stack space={3}>
                              <Text paddingBottom={1}>
                                {formatMessage(m.thirdPartyLoginUrl)}
                              </Text>
                              <Text variant="small" as="p">
                                {formatMessage(m.thirdPartyLoginUrlDescription)}
                              </Text>
                              <Input
                                name="originUrl"
                                value={inputValues.originUrl}
                                label={formatMessage(m.originUrl)}
                                size="xs"
                                onChange={(e) =>
                                  setInputValues((prev) => ({
                                    ...prev,
                                    originUrl: e.target.value,
                                  }))
                                }
                              />
                              <Input
                                name="targetLinkUri"
                                value={inputValues.targetLinkUri}
                                label={formatMessage(m.targetLinkUri)}
                                size="xs"
                                onChange={(e) =>
                                  setInputValues((prev) => ({
                                    ...prev,
                                    targetLinkUri: e.target.value,
                                  }))
                                }
                              />
                              <Text variant="small" as="p">{`Preview: ${
                                inputValues.originUrl.length > 0
                                  ? inputValues.originUrl
                                  : formatMessage(m.originUrl)
                              }?login_hint={{subjectId}}&target_link_uri=${
                                inputValues.targetLinkUri.length > 0
                                  ? inputValues.targetLinkUri
                                  : formatMessage(m.targetLinkUri)
                              }`}</Text>
                            </Stack>
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
