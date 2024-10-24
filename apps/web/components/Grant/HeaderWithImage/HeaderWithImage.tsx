import { ReactNode } from 'react'

import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'

import * as styles from './HeaderWithImage.css'

export type HeaderWithImageProps = {
  title: string
  description?: string
  imageLayout?: 'left' | 'right'
  breadcrumbs: ReactNode
  featuredImage?: string
  children?: ReactNode
}

export const HeaderWithImage = (props: HeaderWithImageProps) => {
  if (props.imageLayout !== 'left') {
    return (
      <GridContainer>
        <GridRow>
          <GridColumn
            offset={['0', '0', '0', '0', '1/12']}
            span={['1/1', '1/1', '1/1', '9/12', '7/12']}
            paddingTop={[0, 0, 0, 8]}
            paddingBottom={2}
          >
            {props.breadcrumbs}

            <Text as="h1" variant="h1" marginTop={2} marginBottom={2}>
              {props.title}
            </Text>

            {props.description && (
              <Text variant="default">{props.description}</Text>
            )}

            {props.children}
          </GridColumn>
          <GridColumn span="3/12" hiddenBelow="lg" paddingTop={[0, 0, 0, 2]}>
            <Box
              display="flex"
              height="full"
              justifyContent="center"
              alignItems="center"
            >
              <img
                className={styles.introImage}
                src={props.featuredImage}
                alt="todo"
              />
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    )
  }

  return (
    <GridContainer>
      <GridRow>
        <GridColumn span="3/12" hiddenBelow="lg" paddingTop={[0, 0, 0, 2]}>
          <Box
            display="flex"
            height="full"
            justifyContent="center"
            alignItems="center"
          >
            <img
              className={styles.introImage}
              src={props.featuredImage}
              alt="todo"
            />
          </Box>
        </GridColumn>
        <GridColumn
          offset={['0', '0', '0', '0', '1/12']}
          span={['1/1', '1/1', '1/1', '9/12', '7/12']}
          paddingTop={[0, 0, 0, 8]}
          paddingBottom={2}
        >
          {props.breadcrumbs}

          <Text as="h1" variant="h1" marginTop={2} marginBottom={2}>
            {props.title}
          </Text>

          {props.description && (
            <Text variant="default">{props.description}</Text>
          )}

          {props.children}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}
