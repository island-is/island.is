import React from 'react'
import { Text, Box } from '@island.is/island-ui/core'

import * as styles from './Files.treat'
import cn from 'classnames'
import { getFileType } from '@island.is/financial-aid-web/veita/src/utils/formHelper'
import { ApplicationFile } from '@island.is/financial-aid/shared'

interface Props {
  heading?: string
  className?: string
  filesArray?: ApplicationFile[]
}

const Files = ({ heading, className, filesArray }: Props) => {
  if (filesArray === undefined || filesArray.length === 0) {
    return null
  }
  return (
    <Box className={cn({ [`${className}`]: true })} marginBottom={2}>
      {' '}
      <Text variant="eyebrow" marginBottom={2}>
        {heading}
      </Text>
      {filesArray.map((item, index) => {
        let sizeInKilo = Math.floor(item.size / 1000)

        return (
          <a
            key={'file-' + index}
            href={item.name}
            target="_blank"
            rel="noreferrer noopener"
            className={styles.filesLink}
            download
          >
            <div className={styles.container}>
              <div className={styles.type}>
                <Text color="dark300" fontWeight="semiBold" variant="small">
                  {getFileType(item.name)}
                </Text>
              </div>
              <div className={styles.name}>
                <Text variant="small">{item.name}</Text>
              </div>
              <Text variant="small">{`Skjal • ${sizeInKilo} KB`}</Text>
              <Text variant="small"> {`${item.created}`}</Text>
            </div>
          </a>
        )
      })}
    </Box>
  )
}

export default Files
