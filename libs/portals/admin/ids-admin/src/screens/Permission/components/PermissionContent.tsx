import React, { useCallback, useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'

import { useLocale } from '@island.is/localization'
import { getTranslatedValue } from '@island.is/portals/core'
import {
  Box,
  Divider,
  Input,
  Select,
  Stack,
  Tabs,
  Text,
} from '@island.is/island-ui/core'
import { AuthAdminTranslatedValue } from '@island.is/api/schema'

import { m } from '../../../lib/messages'
import { FormCard } from '../../../components/FormCard/FormCard'
import { usePermission } from '../PermissionContext'
import { PermissionFormTypes } from '../EditPermission.schema'
import { Languages } from '../../../utils/languages'
import { useErrorFormatMessage } from '../../../hooks/useFormatErrorMessage'
import { useEnvironmentState } from '../../../hooks/useEnvironmentState'
import { checkEnvironmentsSync } from '../../../utils/checkEnvironmentsSync'
import {
  GetScopeCategoriesDocument,
  GetScopeCategoriesQuery,
  GetScopeTagsDocument,
  GetScopeTagsQuery,
} from './PermissionCategoriesAndTags.generated'
import isEqual from 'lodash/isEqual'
import { MultiValue } from 'react-select'

type Locales = Languages.IS | Languages.EN
type ErrorKeys = `${Locales}_description` | `${Locales}_displayName`
type Option = {
  label: string
  value: string
  description: string
}
type Category = GetScopeCategoriesQuery['authAdminScopeCategories'][number]
type Tag = GetScopeTagsQuery['authAdminScopeTags'][number]

const languages = Object.values(Languages)

/**
 * Creates a languages state object for the translated values
 *
 * @example result
 * {
 *   is: 'Íslenska',
 *   en: 'English'
 * }
 */
const createLanguagesState = (value: AuthAdminTranslatedValue[]) =>
  Object.fromEntries(
    languages.map((langKey) => [langKey, getTranslatedValue(value, langKey)]),
  )

export const PermissionContent = () => {
  const { formatMessage, lang } = useLocale()
  const { formatErrorMessage } = useErrorFormatMessage()
  const { selectedPermission, actionData, permission } = usePermission()
  const [activeTab, setActiveTab] = useState<Languages>(Languages.IS)
  const [displayNames, setDisplayNames] = useEnvironmentState(
    createLanguagesState(selectedPermission.displayName),
  )
  const [descriptions, setDescriptions] = useEnvironmentState(
    createLanguagesState(selectedPermission.description),
  )

  // Categories and Tags
  const { data: categoriesData, loading: categoriesLoading } = useQuery(
    GetScopeCategoriesDocument,
    {
      variables: { lang },
    },
  )

  const { data: tagsData, loading: tagsLoading } = useQuery(
    GetScopeTagsDocument,
    {
      variables: { lang },
    },
  )

  const categories = useMemo(
    () => categoriesData?.authAdminScopeCategories || [],
    [categoriesData?.authAdminScopeCategories],
  )

  const tags = useMemo(
    () => tagsData?.authAdminScopeTags || [],
    [tagsData?.authAdminScopeTags],
  )

  const [selectedCategories, setSelectedCategories] = useEnvironmentState<
    MultiValue<Option>
  >(
    (selectedPermission.categoryIds || ([] as string[]))
      .map((id) => {
        const cat = categories.find(
          (c: GetScopeCategoriesQuery['authAdminScopeCategories'][number]) =>
            c.id === id,
        )
        return cat
          ? { label: cat.title, value: cat.id, description: cat.description }
          : null
      })
      .filter((cat: Option | null) => cat !== null),
  )

  const [selectedTags, setSelectedTags] = useEnvironmentState<
    MultiValue<Option>
  >(
    (selectedPermission.tagIds || ([] as string[]))
      .map((id) => {
        const tag = tags.find(
          (t: GetScopeTagsQuery['authAdminScopeTags'][number]) => t.id === id,
        )
        return tag
          ? { label: tag.title, value: tag.id, description: tag.description }
          : null
      })
      .filter((tag: Option | null) => tag !== null),
  )

  // changes to categories or tags aren't triggering a form change event, so we need to handle this manually
  const customValidation = useCallback(() => {
    return (
      !isEqual(
        selectedCategories.map((cat) => cat.value),
        selectedPermission.categoryIds,
      ) ||
      !isEqual(
        selectedTags.map((tag) => tag.value),
        selectedPermission.tagIds,
      )
    )
  }, [
    selectedCategories,
    selectedTags,
    selectedPermission.categoryIds,
    selectedPermission.tagIds,
  ])

  const loading = categoriesLoading || tagsLoading

  const categoryOptions = useMemo(
    () =>
      categories.map((cat: Category) => ({
        label: cat.title,
        value: cat.id,
        description: cat.description,
      })),
    [categories],
  )

  const tagOptions = useMemo(
    () =>
      tags.map((tag: Tag) => ({
        label: tag.title,
        value: tag.id,
        description: tag.description,
      })),
    [tags],
  )

  const renderTabs = (langKey: Languages) => {
    // Since we transform the Zod schema to strip out the locale prefixed keys then we need to
    // cast the errors to the correct type
    const errors = actionData?.errors as {
      [Key in ErrorKeys]?: string
    }

    return {
      id: langKey,
      label: formatMessage(langKey === Languages.IS ? m.icelandic : m.english),
      content: (
        <Box display="flex" flexDirection="column" rowGap={5}>
          <Stack space={1}>
            <Input
              backgroundColor="blue"
              type="text"
              size="sm"
              name={`${langKey}_displayName`}
              onChange={(e) => {
                setDisplayNames({
                  ...displayNames,
                  [langKey]: e.target.value,
                })
              }}
              value={displayNames[langKey]}
              label={formatMessage(m.displayName)}
              errorMessage={formatErrorMessage(
                errors?.[`${langKey}_displayName`],
              )}
            />
            <Text variant="small">
              {formatMessage(m.displayNameDescription)}
            </Text>
          </Stack>
          <Stack space={1}>
            <Input
              backgroundColor="blue"
              type="text"
              size="sm"
              name={`${langKey}_description`}
              onChange={(e) => {
                setDescriptions({
                  ...descriptions,
                  [langKey]: e.target.value,
                })
              }}
              value={descriptions[langKey]}
              label={formatMessage(m.description)}
              errorMessage={formatErrorMessage(
                errors?.[`${langKey}_description`],
              )}
            />
            <Text variant={'small'}>{formatMessage(m.descriptionInfo)}</Text>
          </Stack>
        </Box>
      ),
    }
  }

  return (
    <FormCard
      title={formatMessage(m.content)}
      intent={PermissionFormTypes.CONTENT}
      inSync={checkEnvironmentsSync(permission.environments, [
        'description',
        'displayName',
        'categoryIds',
        'tagIds',
      ])}
      customValidation={customValidation}
    >
      <Stack space={5}>
        <Tabs
          size="md"
          contentBackground="white"
          selected={activeTab}
          label={formatMessage(m.translations)}
          onChange={() =>
            setActiveTab(
              activeTab === Languages.IS ? Languages.EN : Languages.IS,
            )
          }
          tabs={languages.map(renderTabs)}
        />

        <Divider />

        {/* Categories Section */}
        <Box>
          <Text variant="h4" marginBottom={2}>
            {formatMessage(m.categories)}
          </Text>
          <Text variant="small" marginBottom={3}>
            {formatMessage(m.categoriesDescription)}
          </Text>

          {loading ? (
            <Text>{formatMessage(m.loading)}</Text>
          ) : categories.length === 0 ? (
            <Text>{formatMessage(m.noCategories)}</Text>
          ) : (
            <Stack space={2}>
              {/* Hidden inputs to pass selected and original category IDs */}
              <input
                type="hidden"
                name="categoryIds"
                value={JSON.stringify(
                  selectedCategories.map((cat) => cat.value),
                )}
              />
              <input
                type="hidden"
                name="originalCategoryIds"
                value={JSON.stringify(selectedPermission.categoryIds || [])}
              />
              <Select
                value={selectedCategories}
                options={categoryOptions}
                onChange={(value) => {
                  setSelectedCategories(value as MultiValue<Option>)
                }}
                placeholder={formatMessage(m.selectCategoriesPlaceholder)}
                isMulti
              />
            </Stack>
          )}
        </Box>

        {/* Tags Section */}
        <Box>
          <Text variant="h4" marginBottom={2}>
            {formatMessage(m.tags)}
          </Text>
          <Text variant="small" marginBottom={3}>
            {formatMessage(m.tagsDescription)}
          </Text>

          {loading ? (
            <Text>{formatMessage(m.loading)}</Text>
          ) : tags.length === 0 ? (
            <Text>{formatMessage(m.noTags)}</Text>
          ) : (
            <Stack space={2}>
              {/* Hidden inputs to pass selected and original tag IDs */}
              <input
                type="hidden"
                name="tagIds"
                value={JSON.stringify(selectedTags.map((tag) => tag.value))}
              />
              <input
                type="hidden"
                name="originalTagIds"
                value={JSON.stringify(selectedPermission.tagIds || [])}
              />

              <Select
                value={selectedTags}
                options={tagOptions}
                onChange={(value) => {
                  setSelectedTags(value as MultiValue<Option>)
                }}
                placeholder={formatMessage(m.selectTagsPlaceholder)}
                isMulti
              />
            </Stack>
          )}
        </Box>
      </Stack>
    </FormCard>
  )
}
