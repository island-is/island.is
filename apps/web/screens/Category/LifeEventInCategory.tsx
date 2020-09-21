import React, { FC } from 'react'
import {
  Box,
  Typography,
  Link,
  FocusableBox,
  GridContainer,
  GridRow,
  GridColumn,
  Tag,
} from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'

import routeNames from '@island.is/web/i18n/routeNames'

import * as styles from './LifeEventInCategory.treat'

export interface LifeEventInCategoryProps {
  title: string
  slug: string
  intro: string
  image: string
}

const LifeEventInCategory: FC<LifeEventInCategoryProps> = ({
  title,
  slug,
  intro,
  image,
}) => {
  const { activeLocale } = useI18n()
  const { makePath } = routeNames(activeLocale)

  return (
    <FocusableBox
      component={Link}
      href={makePath('lifeEvent', '[slug]')}
      as={makePath('lifeEvent', slug)}
      borderColor="blue200"
      borderWidth="standard"
      height="full"
      borderRadius="large"
      paddingX={[3, 3, 5]}
      paddingY={2}
    >
      <GridContainer>
        <GridRow>
          <GridColumn span={['8/12', '8/12', '6/12', '7/12', '9/12']}>
            <GridRow className={styles.textWrapper}>
              <Typography variant="h4" as="h4" color="blue400">
                {title}
              </Typography>
              <Typography variant="p" paddingBottom={2}>
                {intro}
              </Typography>
              <div className={styles.pushDown}>
                <Tag>{'Lífsviðburður'}</Tag>
              </div>
            </GridRow>
          </GridColumn>
          <GridColumn span={['4/12', '4/12', '6/12', '5/12', '3/12']}>
            <div
              className={styles.thumbnail}
              style={{ backgroundImage: `url(${image})` }}
            />
          </GridColumn>
        </GridRow>
      </GridContainer>
    </FocusableBox>
  )
}

export default LifeEventInCategory
