import { FC } from 'react'
import { motion } from 'motion/react'

import { AlertMessage } from '@island.is/island-ui/core'

import * as styles from './TableInfoContainer.css'

interface TableInfoContainerProps {
  title: string
  message: string
}

const TableInfoContainer: FC<TableInfoContainerProps> = (props) => {
  const { title, message } = props
  return (
    <motion.div
      className={styles.infoContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AlertMessage type="info" title={title} message={message} />
    </motion.div>
  )
}

export default TableInfoContainer
