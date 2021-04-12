import React, { FC } from 'react'

import { Table as T } from '@island.is/island-ui/core'

import * as styles from './TableList.treat'

interface TableListProps {}

const TableList: FC<TableListProps> = () => {
  return (
    <div className={styles.container}>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>Header</T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          <T.Row>
            <T.Data>Data</T.Data>
          </T.Row>
        </T.Body>
        <T.Foot>
          <T.Row>
            <T.Data>Foot</T.Data>
          </T.Row>
        </T.Foot>
      </T.Table>
    </div>
  )
}

export default TableList
