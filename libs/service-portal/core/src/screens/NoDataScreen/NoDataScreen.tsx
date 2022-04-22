import React, { FC } from 'react'
import {
  Box,
  GridColumn,
  GridRow,
  Tag,
  TagVariant,
  Text,
  Button,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import * as styles from '../ErrorScreen/ErrorScreen.css'
import { Link } from 'react-router-dom'
import { ServicePortalPath } from '../../lib/navigation/paths'

interface Props {
  title: string
  children?: React.ReactNode
  tag?: string
  tagVariant?: TagVariant
  button?: {
    link: ServicePortalPath | string
    internal: boolean
    text: string
    variant: 'primary' | 'ghost'
  }
  figure?: string
}

export const NoDataScreen: FC<Props> = ({
  title,
  children,
  button,
  tag,
  figure,
  tagVariant = 'purple',
}) => {
  const { formatMessage } = useLocale()
  return (
    <GridRow>
      <GridColumn span={['1/1', '10/12']} offset={['0', '0']}>
        <Box
          marginTop={6}
          marginBottom={6}
          textAlign="center"
          justifyContent="center"
        >
          {tag && (
            <Box marginBottom={4}>
              <Tag variant={tagVariant}>{tag}</Tag>
            </Box>
          )}
          <Text variant="h1" as="h1" marginBottom={3}>
            {title}
          </Text>
          <Text variant="default" as="p">
            {children}
          </Text>
          {button && (
            <Box
              marginTop={3}
              marginBottom={3}
              display="flex"
              textAlign="center"
              justifyContent="center"
            >
              {button.internal ? (
                <Link to={button.link}>
                  <Button
                    variant={button.variant}
                    size="small"
                    icon="receipt"
                    iconType="outline"
                  >
                    {button.text}
                  </Button>
                </Link>
              ) : (
                <a href={button.link}>
                  <Button
                    variant={button.variant}
                    size="small"
                    icon="receipt"
                    iconType="outline"
                  >
                    {button?.text}
                  </Button>
                </a>
              )}
            </Box>
          )}
        </Box>
      </GridColumn>

      <GridColumn span={['1/1', '4/12']} offset={['0', '3/12']}>
        <Box display="flex" justifyContent="center">
          <img
            src={figure ? figure : './assets/images/jobsGrid.svg'}
            alt={`${formatMessage(m.altText)} ${title}`}
            className={styles.img}
          />
        </Box>
      </GridColumn>
    </GridRow>
  )
}
