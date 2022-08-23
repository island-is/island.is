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
import AnimateHeight from 'react-animate-height'
import { GenericLicenseDataField } from '@island.is/api/schema'
import format from 'date-fns/format'
import { dateFormat } from '@island.is/shared/constants'
import { GenericLicenseType } from '@island.is/service-portal/graphql'

interface Props {
  data: GenericLicenseDataField[]
  title: string
  type?: string
}

const ExpandableLine: FC<Props> = ({ data, title, type }) => {
  const [expanded, toggleExpand] = useState<boolean>(false)
  const [closed, setClosed] = useState<boolean>(true)
  const ref = useRef<HTMLDivElement>(null)

  const handleAnimationEnd = useCallback((height) => {
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
  const columnSpan: ResponsiveProp<GridColumns> =
    data.length > 0
      ? ['1/1', '1/1', '4/12']
      : data.length === 3
      ? ['1/1', '1/1', '3/12']
      : '1/1'

  return (
    <>
      <Box paddingBottom={3} paddingTop={3}>
        <GridRow>
          <GridColumn
            span={isDriversLicense ? ['1/1', '1/1', '1/1', '2/12'] : columnSpan}
          >
            <Box display="flex" alignItems={'center'}>
              <Text variant="h5" as="span" lineHeight="lg">
                {title}
              </Text>
              {isDriversLicense ? (
                <Box
                  display="flex"
                  justifyContent="flexEnd"
                  alignItems="flexEnd"
                  marginLeft={1}
                  marginRight={3}
                >
                  <LicenseIcon
                    category={mapCategory(title.trim()).icon ?? 'B'}
                  />
                </Box>
              ) : (
                ''
              )}
            </Box>
          </GridColumn>
          {data.map((item) => {
            return (
              item.label && (
                <GridColumn
                  span={[
                    isDriversLicense ? '8/12' : '1/1',
                    isDriversLicense ? '8/12' : '1/1',
                    isDriversLicense ? '8/12' : '1/1',
                    '3/12',
                  ]}
                  key={`expandable-item-${item.label}`}
                >
                  <Box display="flex" alignItems="center" height="full">
                    <Text variant="default">{item.label}</Text>
                    <Box marginLeft={1} />
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
            )
          })}

          {isDriversLicense && (
            <GridColumn span={['4/12', '4/12', '4/12', '1/12']}>
              <Box display="flex" justifyContent="flexEnd" alignItems="center">
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
          )}
        </GridRow>
        {isDriversLicense && (
          <AnimateHeight
            className={expanded ? styles.animatedContent : undefined}
            onAnimationEnd={(props: { newHeight: number }) =>
              handleAnimationEnd(props.newHeight)
            }
            duration={300}
            height={expanded ? 'auto' : 0}
          >
            <Box ref={ref} className={styles.text}>
              {title && ReactHtmlParser(mapCategory(title.trim()).text ?? '')}
            </Box>
          </AnimateHeight>
        )}
      </Box>
      <Divider />
    </>
  )
}

export default ExpandableLine
