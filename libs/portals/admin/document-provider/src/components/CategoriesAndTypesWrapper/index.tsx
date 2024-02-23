import React, { useContext } from 'react'
import { useLocale } from '@island.is/localization'
import {
  Box,
  SkeletonLoader,
  ActionCard,
  Stack,
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { Problem } from '@island.is/react-spa/shared'
import {
  DocumentProviderCategories,
  DocumentProviderTypes,
} from '@island.is/api/schema'
import { ApolloError } from '@apollo/client'
import { TypeCategoryContext } from '../../screens/CategoriesAndTypes/TypeCategoryContext'

interface Props {
  dataArray: Array<DocumentProviderCategories | DocumentProviderTypes>
  loading: boolean
  error?: ApolloError
  callback: () => void
}

const CategoriesAndTypesWrapper = ({
  dataArray,
  loading,
  error,
  callback,
}: Props) => {
  const { formatMessage } = useLocale()
  const { setCurrentTypeCategory } = useContext(TypeCategoryContext)

  if (error) {
    return <Problem error={error} />
  }

  return (
    <>
      {dataArray.length ? (
        <Box marginTop={3} marginBottom={[2, 3]}>
          <Stack space={3}>
            {dataArray.map((item, i) => (
              <ActionCard
                key={i}
                heading={item.name ?? ''}
                tag={
                  item.active
                    ? {
                        label: 'Virkur',
                        variant: 'mint',
                        outlined: false,
                      }
                    : {
                        label: 'Óvirkur',
                        variant: 'red',
                        outlined: false,
                      }
                }
                cta={{
                  label: formatMessage(m.change),
                  variant: 'text',
                  onClick: () => {
                    callback()
                    setCurrentTypeCategory(item)
                  },
                }}
              />
            ))}
          </Stack>
        </Box>
      ) : undefined}
      {loading && (
        <Box marginTop={3} width="full">
          <SkeletonLoader repeat={3} height={40} space={2} />
        </Box>
      )}
      {!loading && !error && !dataArray.length && (
        <Problem type="no_data" noBorder={false} />
      )}
    </>
  )
}

export default CategoriesAndTypesWrapper
