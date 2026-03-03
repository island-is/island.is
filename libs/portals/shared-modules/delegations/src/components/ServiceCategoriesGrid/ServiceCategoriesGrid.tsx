import * as styles from './ServiceCategoriesGrid.css'
import { CategoryCard, SkeletonLoader } from '@island.is/island-ui/core'
import { AuthScopeCategoriesQuery } from '../../screens/ServiceCategories/ServiceCategories.generated'
import { DelegationPaths } from '../../lib/paths'

export const ServiceCategoriesGrid = ({
  categories,
  loading,
  error,
}: {
  categories: AuthScopeCategoriesQuery['authScopeCategories']
  loading: boolean
  error: boolean
}) => {
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
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            heading={category.title}
            text={category.description ?? ''}
            href={`/minarsidur${DelegationPaths.CategoryDetails.replace(
              ':slug',
              category.slug,
            )}`}
            headingVariant="h4"
            textVariant="medium"
          />
        ))}
      </div>
    )
  )
}
