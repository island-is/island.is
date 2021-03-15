import React from 'react'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Link,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './Districts.treat'

export interface DistrictsProps {
  title: string
  description: string
  links: Array<{
    text: string
    url: string
  }>
  image: {
    url: string
  }
}

export const Districts: React.FC<DistrictsProps> = ({
  title,
  description,
  links,
  image,
}) => {
  return (
    <Box
      borderTopWidth="standard"
      borderColor="standard"
      paddingTop={[8, 6, 10]}
      paddingBottom={[4, 5, 10]}
    >
      <Text variant="h3" as="h2">
        {title}
      </Text>
      <GridRow>
        <GridColumn span={['10/10', '10/10', '5/10']}>
          {description && (
            <Box paddingRight={[0, 0, 6]}>
              <Text marginTop={3}>{description}</Text>
            </Box>
          )}
          <Box
            component="ul"
            marginTop={5}
            marginBottom={5}
            className={styles.districtsList}
          >
            {links.map((link, index) => (
              <Box component="li" key={index} marginBottom={4}>
                <Link href={link.url}>
                  <Button variant="text">{link.text}</Button>
                </Link>
              </Box>
            ))}
          </Box>
        </GridColumn>
        {!!image && (
          <GridColumn span={['10/10', '10/10', '5/10']}>
            {image.url.split('.').pop() === 'svg' ? (
              <object data={image.url} type="image/svg+xml">
                <img src={image.url} alt="" />
              </object>
            ) : (
              <img src={image.url} alt="" />
            )}
          </GridColumn>
        )}
      </GridRow>
    </Box>
  )
}
