import * as styles from './ServiceCategoriesGrid.css'
import { CategoryCard, SkeletonLoader } from '@island.is/island-ui/core'
import {
  AuthScopeCategoriesQuery,
  AuthScopeTagsQuery,
} from '../../screens/ServiceCategories/ServiceCategories.generated'
import { DelegationPaths } from '../../lib/paths'
import { useNavigate } from 'react-router-dom'

export const ServiceCategoriesGrid = ({
  categories,
  loading,
  error,
}: {
  categories:
    | AuthScopeCategoriesQuery['authScopeCategories']
    | AuthScopeTagsQuery['authScopeTags']
  loading: boolean
  error: boolean
}) => {
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className={styles.categoriesGrid}>
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonLoader key={index} height={200} borderRadius="large" />
        ))}
      </div>
    )
  }

  return (
    !error &&
    categories.length > 0 && (
      <div className={styles.categoriesGrid}>
        {categories.map((category) => {
          const slug =
            category.__typename === 'AuthScopeCategory'
              ? category.slug
              : category.title.toLowerCase().replace(/ /g, '-')
          return (
            <button
              key={category.id}
              className={styles.categoryCard}
              onClick={(e) => {
                e.preventDefault()
                navigate(DelegationPaths.CategoryDetails.replace(':slug', slug))
              }}
            >
              <CategoryCard
                heading={category.title}
                text={category.description ?? ''}
                headingVariant="h4"
                textVariant="medium"
              />
            </button>
          )
        })}
      </div>
    )
  )
}
