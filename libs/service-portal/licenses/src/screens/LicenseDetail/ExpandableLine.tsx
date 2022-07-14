import React, { FC, useCallback, useEffect, useState, useRef } from 'react'
import {
  Box,
  Divider,
  FocusableBox,
  Icon,
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
  return (
    <>
      <Box paddingBottom={3} paddingTop={3}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="spaceBetween"
          width="full"
        >
          <Box
            display="flex"
            flexDirection={['column', 'column', 'column', 'row']}
          >
            <Box
              display="flex"
              alignItems={'center'}
              className={isDriversLicense && styles.categoryContainer}
            >
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
            {data.map((item) => {
              return (
                item.label &&
                item.value && (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent={[
                      'flexStart',
                      'flexStart',
                      'flexStart',
                      'center',
                    ]}
                    className={styles.content}
                    marginLeft={[0, 0, 0, 5]}
                  >
                    <>
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
                    </>
                  </Box>
                )
              )
            })}
          </Box>
          {isDriversLicense && (
            <Box
              display="flex"
              justifyContent={[
                'flexStart',
                'flexStart',
                'flexStart',
                'flexEnd',
              ]}
              alignItems="center"
            >
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
          )}
        </Box>
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
