import React, { FC } from 'react'
import {
  Box,
  GridColumn,
  GridRow,
  Tag,
  TagVariant,
  Text,
  Button,
  IconProps,
} from '@island.is/island-ui/core'
import * as styles from '../ErrorScreen/ErrorScreen.css'
import { Link } from 'react-router-dom'
import { ServicePortalPath } from '../../lib/navigation/paths'

interface ButtonType {
  link?: ServicePortalPath | string
  onClick?: () => void
  icon?: Pick<IconProps, 'icon' | 'type'>
  type: 'internal' | 'external' | 'click'
  text: string
  variant: 'primary' | 'ghost'
}
interface Props {
  title: string
  children?: React.ReactNode
  tag?: string
  tagVariant?: TagVariant
  button?: ButtonType
  secondaryButton?: ButtonType
  figure?: string
}

export const NoDataScreen: FC<React.PropsWithChildren<Props>> = ({
  title,
  children,
  button,
  secondaryButton,
  tag,
  figure,
  tagVariant = 'purple',
}) => {
  const renderButton = (button: ButtonType) => {
    return (
      <>
        {button.type === 'internal' && button.link && (
          <Link to={button.link}>
            <Button
              as="span"
              variant={button.variant}
              size="small"
              icon={button.icon ? button.icon.icon : undefined}
              iconType={button.icon ? button.icon.type : undefined}
            >
              {button.text}
            </Button>
          </Link>
        )}
        {button.type === 'external' && button.link && (
          <a href={button.link}>
            <Button
              as="span"
              variant={button.variant}
              size="small"
              icon={button.icon ? button.icon.icon : undefined}
              iconType={button.icon ? button.icon.type : undefined}
            >
              {button?.text}
            </Button>
          </a>
        )}
        {button.type === 'click' && button.onClick && (
          <Button
            variant={button.variant}
            size="small"
            icon={button.icon ? button.icon.icon : undefined}
            iconType={button.icon ? button.icon.type : undefined}
            onClick={button.onClick}
          >
            {button?.text}
          </Button>
        )}
      </>
    )
  }
  return (
    <GridRow>
      <GridColumn span={['1/1', '6/12']} offset={['0', '3/12']}>
        <Box
          marginTop={[3, 6]}
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
          <Text variant="default" as="div">
            {children}
          </Text>
          <Box
            display="flex"
            flexDirection={['column', 'row']}
            justifyContent="center"
            alignItems="center"
            marginTop={4}
          >
            {button && (
              <Box display="flex" justifyContent="center" alignItems="center">
                {renderButton(button)}
              </Box>
            )}
            {secondaryButton && (
              <Box
                marginLeft={[0, 2]}
                marginTop={[3, 0]}
                display="flex"
                textAlign="center"
                justifyContent="center"
              >
                {renderButton(secondaryButton)}
              </Box>
            )}
          </Box>
        </Box>
        <Box display="flex" justifyContent="center" marginTop={[3, 5]}>
          <img
            src={figure ? figure : './assets/images/jobsGrid.svg'}
            alt=""
            className={styles.img}
          />
        </Box>
      </GridColumn>
    </GridRow>
  )
}
