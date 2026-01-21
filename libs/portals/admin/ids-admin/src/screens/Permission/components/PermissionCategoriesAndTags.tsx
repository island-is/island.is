import React from 'react'
import { useQuery } from '@apollo/client'

import { useLocale } from '@island.is/localization'
import { Box, Checkbox, Stack, Text } from '@island.is/island-ui/core'

import { usePermission } from '../PermissionContext'
import { FormCard } from '../../../components/FormCard/FormCard'
import { m } from '../../../lib/messages'
import { PermissionFormTypes } from '../EditPermission.schema'
import { useEnvironmentState } from '../../../hooks/useEnvironmentState'
import { checkEnvironmentsSync } from '../../../utils/checkEnvironmentsSync'
import {
  GetScopeCategoriesDocument,
  GetScopeCategoriesQuery,
  GetScopeTagsDocument,
  GetScopeTagsQuery,
} from './PermissionCategoriesAndTags.generated'

export const PermissionCategoriesAndTags = () => {
  const { formatMessage, lang } = useLocale()
  const { selectedPermission, permission } = usePermission()

  const { data: categoriesData, loading: categoriesLoading } = useQuery(
    GetScopeCategoriesDocument,
    {
      variables: { lang },
    },
  )

  const { data: tagsData, loading: tagsLoading } = useQuery(GetScopeTagsDocument, {
    variables: { lang },
  })

  const [selectedCategoryIds, setSelectedCategoryIds] = useEnvironmentState<
    string[]
  >(selectedPermission.categoryIds || [])

  const [selectedTagIds, setSelectedTagIds] = useEnvironmentState<string[]>(
    selectedPermission.tagIds || [],
  )

  const categories = categoriesData?.authAdminScopeCategories || []
  const tags = tagsData?.authAdminScopeTags || []
  const loading = categoriesLoading || tagsLoading

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    )
  }

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    )
  }

  return (
    <FormCard
      title={formatMessage(m.categoriesAndTags)}
      intent={PermissionFormTypes.CATEGORIES_AND_TAGS}
      inSync={checkEnvironmentsSync(permission.environments, [
        'categoryIds',
        'tagIds',
      ])}
    >
      <Stack space={5}>
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
                value={JSON.stringify(selectedCategoryIds)}
              />
              <input
                type="hidden"
                name="originalCategoryIds"
                value={JSON.stringify(selectedPermission.categoryIds || [])}
              />

              {categories.map(
                (
                  category: GetScopeCategoriesQuery['authAdminScopeCategories'][number],
                ) => (
                  <Checkbox
                    key={category.id}
                    backgroundColor="blue"
                    large
                    label={category.title}
                    subLabel={category.description}
                    name={`category_${category.id}`}
                    value={category.id}
                    checked={selectedCategoryIds.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                  />
                ),
              )}
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
                value={JSON.stringify(selectedTagIds)}
              />
              <input
                type="hidden"
                name="originalTagIds"
                value={JSON.stringify(selectedPermission.tagIds || [])}
              />

              {tags.map((tag: GetScopeTagsQuery['authAdminScopeTags'][number]) => (
                <Checkbox
                  key={tag.id}
                  backgroundColor="blue"
                  large
                  label={tag.title}
                  subLabel={tag.intro}
                  name={`tag_${tag.id}`}
                  value={tag.id}
                  checked={selectedTagIds.includes(tag.id)}
                  onChange={() => handleTagToggle(tag.id)}
                />
              ))}
            </Stack>
          )}
        </Box>
      </Stack>
    </FormCard>
  )
}
