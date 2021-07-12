import React from 'react'
import { Text, Box } from '@island.is/island-ui/core'

import * as styles from './Files.treat'
import cn from 'classnames'
import { calcDifferenceInDate, getFileType } from '../../utils/formHelper'
import { ApplicationFile } from '@island.is/financial-aid/shared'

interface Props {
  heading?: string
  className?: string
  filesArray?: ApplicationFile[]
}

const Files: React.FC<Props> = ({ heading, className, filesArray }) => {
  return (
    <Box className={cn({ [`${className}`]: true })} marginBottom={2}>
      {' '}
      <Text variant="eyebrow" marginBottom={2}>
        {heading}
      </Text>
      {filesArray && (
        <>
          {filesArray.map((item) => {
            let sizeInKilo = Math.floor(item.size / 1000)

            return (
              <a
                href={item.name}
                target="_blank"
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
        </>
      )}
    </Box>
  )
}

export default Files
