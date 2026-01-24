import React from 'react'

import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Pagination,
  SkeletonLoader,
  Text,
} from '@island.is/island-ui/core'

import { DataItem,DatasetCard } from './DatasetCard'
import * as styles from '../Index.css'

interface TranslationFn {
  (key: string, fallback: string): string
}

interface DatasetListProps {
  datasets: DataItem[]
  loading: boolean
  error?: Error
  totalCount: number
  totalPages: number
  selectedPage: number
  onPageChange: (page: number) => void
  gridView: boolean
  onToggleView: () => void
  formatDate: (date: string) => string
  n: TranslationFn
  isMobileScreenWidth: boolean
  isTabletScreenWidth: boolean
  titleRef: React.RefObject<HTMLDivElement>
  itemsPerPage: number
}

export const DatasetList: React.FC<DatasetListProps> = ({
  datasets,
  loading,
  error,
  totalCount,
  totalPages,
  selectedPage,
  onPageChange,
  gridView,
  onToggleView,
  formatDate,
  n,
  isMobileScreenWidth,
  isTabletScreenWidth,
  titleRef,
  itemsPerPage,
}) => {
  // On mobile/tablet, always show grid. On desktop, respect user choice.
  const forceGrid = isMobileScreenWidth || isTabletScreenWidth
  const showGrid = forceGrid || gridView
  const showList = !forceGrid && !gridView

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        style={{ gap: '0.5rem' }}
        marginTop={isTabletScreenWidth || isMobileScreenWidth ? 2 : 5}
        marginBottom={isTabletScreenWidth || isMobileScreenWidth ? 2 : 5}
      >
        <Box
          display="flex"
          flexDirection="row"
          width="full"
          justifyContent="spaceBetween"
        >
          <Box width="full" display="flex" justifyContent="spaceBetween">
            <Box display="flex" flexWrap="wrap" alignItems="center">
              <Text variant="h3" as="p">
                {loading
                  ? n('loadingData', 'Hleð gögn...')
                  : `${n('showingResults', 'Sýnir')} ${totalCount} ${n('datasets', 'gagnasett')}`}
              </Text>
            </Box>
            <Box display="flex" flexDirection="row" justifyContent="flexEnd">
              {/* Only show view toggle on desktop where list view is available */}
              {!forceGrid && (
                <Button
                  variant="utility"
                  icon={gridView ? 'menu' : 'grid'}
                  onClick={onToggleView}
                  title={
                    gridView
                      ? n('switchToList', 'Skipta í lista')
                      : n('switchToGrid', 'Skipta í dálka')
                  }
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {loading && !datasets.length ? (
        <GridContainer className={styles.gridContainer}>
          <GridRow rowGap={3}>
            {Array.from({ length: itemsPerPage }).map((_, i) => (
              <GridColumn
                span={
                  isMobileScreenWidth
                    ? '1/1'
                    : isTabletScreenWidth
                    ? '1/2'
                    : '1/3'
                }
                key={i}
              >
                <Box width="full">
                  <SkeletonLoader height={300} width={'100%'} />
                </Box>
              </GridColumn>
            ))}
          </GridRow>
        </GridContainer>
      ) : error ? (
        <Box padding={4} background="red100" borderRadius="large">
          <Text variant="h3" color="red600">
            {n('errorFetchingDatasets', 'Villa kom upp við að sækja gagnasöfn')}
          </Text>
          <Text>{error.message}</Text>
        </Box>
      ) : (
        <>
          {/* Grid View */}
          <Box style={{ display: showGrid ? 'block' : 'none' }}>
            <GridContainer className={styles.gridContainer}>
              <GridRow rowGap={3}>
                {datasets.map((item: DataItem) => (
                  <GridColumn
                    key={item.id}
                    span={
                      isMobileScreenWidth
                        ? '1/1'
                        : isTabletScreenWidth
                        ? '1/2'
                        : '1/2'
                    }
                  >
                    <DatasetCard
                      item={item}
                      variant="grid"
                      formatDate={formatDate}
                      n={n}
                    />
                  </GridColumn>
                ))}
              </GridRow>
            </GridContainer>
          </Box>

          {/* List View */}
          <Box style={{ display: showList ? 'block' : 'none' }}>
            {datasets.map((item: DataItem) => (
              <Box key={item.id} marginBottom={2}>
                <DatasetCard
                  item={item}
                  variant="list"
                  formatDate={formatDate}
                  n={n}
                />
              </Box>
            ))}
          </Box>
        </>
      )}

      <Box marginTop={2} marginBottom={0}>
        <Pagination
          variant="purple"
          page={selectedPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalCount}
          totalPages={totalPages}
          renderLink={(page, className, children) => (
            <button
              aria-label={selectedPage < page ? 'Next' : 'Previous'}
              onClick={() => {
                onPageChange(page)
                if (titleRef.current) {
                  titleRef.current.scrollIntoView({
                    behavior: 'smooth',
                  })
                }
              }}
            >
              <span className={className}>{children}</span>
            </button>
          )}
        />
      </Box>
    </>
  )
}

export default DatasetList
