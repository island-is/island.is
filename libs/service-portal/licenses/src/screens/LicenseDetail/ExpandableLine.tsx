import React, { FC, useCallback, useEffect, useState, useRef } from 'react'

import {
  Box,
  Divider,
  FocusableBox,
  GridColumn,
  GridColumns,
  GridRow,
  Icon,
  ResponsiveProp,
  Text,
} from '@island.is/island-ui/core'
import ReactHtmlParser from 'react-html-parser'
import * as styles from './LicenseDetail.css'
import { mapCategory } from '../../utils/dataMapper'
import LicenseIcon from '../../components/LicenseIcon/LicenseIcon'
import AnimateHeight, { Height } from 'react-animate-height'
import { GenericLicenseDataField } from '@island.is/api/schema'
import format from 'date-fns/format'
import { dateFormat } from '@island.is/shared/constants'
import { GenericLicenseType } from '@island.is/service-portal/graphql'

interface Props {
  data: GenericLicenseDataField[]
  title: string
  type?: string
  description?: string
}

const ExpandableLine: FC<React.PropsWithChildren<Props>> = ({
  data,
  title,
  type,
  description,
}) => {
  const [expanded, toggleExpand] = useState<boolean>(false)
  const [closed, setClosed] = useState<boolean>(true)
  const ref = useRef<HTMLDivElement>(null)

  const handleAnimationEnd = useCallback((height: Height) => {
    if (height === 0) {
      setClosed(true)
    } else {
      setClosed(false)
    }
  }, [])

  useEffect(() => {
    if (!closed)
      ref.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [closed])

  function onExpandButton() {
    toggleExpand(!expanded)
  }

  const isJSONDate = (str: string) =>
    str && !!str.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)

  const isDriversLicense = type === GenericLicenseType.DriversLicense
  const dataLenghtThree = data.length === 3
  const columnSpan: ResponsiveProp<GridColumns> =
    data.length > 0
      ? ['1/1', '1/1', '1/1', '2/12']
      : dataLenghtThree
      ? ['1/1', '1/1', '1/1', '3/12']
      : '1/1'

  return (
    <>
      <Box paddingBottom={3} paddingTop={3}>
        <GridRow className={styles.gridWrapper}>
          <Box className={styles.gridRow}>
            <GridColumn className={styles.centerColumn}>
              <Box display="flex" columnGap={1} marginBottom={[1, 1, 1, 1, 0]}>
                <Text variant="h5" as="span">
                  {title}
                </Text>
                {isDriversLicense && (
                  <LicenseIcon
                    category={mapCategory(title.trim()).icon ?? 'B'}
                  />
                )}
              </Box>
            </GridColumn>
            {data.map((item) => {
              return (
                <GridColumn
                  className={styles.centerColumn}
                  key={`expandable-item-${item.label}`}
                >
                  <Box display="flex" columnGap={1}>
                    <Text variant="default">{item.label}</Text>
                    <Text variant="default" fontWeight="semiBold">
                      {String(item.value ?? '')
                        .split(' ')
                        .map((part) =>
                          isJSONDate(part)
                            ? format(+new Date(part).getTime(), dateFormat.is)
                            : part,
                        )
                        .join(' ')}
                    </Text>
                  </Box>
                </GridColumn>
              )
            })}
          </Box>

          {isDriversLicense && (
            <Box className={styles.expandButtonWrapper}>
              <GridColumn>
                <Box>
                  <FocusableBox
                    borderRadius="circle"
                    background="blue100"
                    onClick={onExpandButton}
                    padding={1}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    cursor="pointer"
                  >
                    <Icon
                      type="filled"
                      icon={expanded ? 'remove' : 'add'}
                      color="blue400"
                    />
                  </FocusableBox>
                </Box>
              </GridColumn>
            </Box>
          )}
        </GridRow>

        <AnimateHeight
          className={
            expanded || !isDriversLicense ? styles.animatedContent : undefined
          }
          onHeightAnimationEnd={(newHeight) => handleAnimationEnd(newHeight)}
          duration={300}
          height={expanded || !isDriversLicense ? 'auto' : 0}
        >
          <Text>{description}</Text>
          {isDriversLicense && (
            <Box ref={ref} className={styles.text}>
              {title && ReactHtmlParser(mapCategory(title.trim()).text ?? '')}
            </Box>
          )}
        </AnimateHeight>
      </Box>
      <Divider />
    </>
  )
}

export default ExpandableLine
