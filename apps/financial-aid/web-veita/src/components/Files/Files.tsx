import React from 'react'
import { Text, Box } from '@island.is/island-ui/core'

import * as styles from './Files.treat'
import cn from 'classnames'
import { getFileType } from '@island.is/financial-aid-web/veita/src/utils/formHelper'

interface Props {
  heading?: string
  filesArr?: string[]
  className?: string
}

const Files: React.FC<Props> = ({ heading, filesArr, className }) => {
  return (
    <Box className={cn({ [`${className}`]: true })} marginBottom={2}>
      {' '}
      <Text variant="eyebrow" marginBottom={2}>
        {heading}
      </Text>
      {filesArr && (
        <>
          {filesArr.map((item, index) => {
            return (
              <a
                aria-label={item}
                href={item}
                target="_blank"
                className={styles.filesLink}
                key={'files-' + index}
                // download
              >
                <div className={styles.container}>
                  <div className={styles.type}>
                    <Text color="dark300" fontWeight="semiBold" variant="small">
                      {getFileType(item)}
                    </Text>
                  </div>
                  <div className={styles.name}>
                    <Text variant="small">{item}</Text>
                  </div>
                  <Box className={styles.extraInfo}>
                    <Text variant="small">Skjal • 544 KB</Text>
                  </Box>
                  <Box className={styles.extraInfo}>
                    <Text variant="small">45 mínútur</Text>
                  </Box>
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
