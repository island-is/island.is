import React, { FC, useState } from 'react'

import {
  Box,
  Input,
  ModalBase,
  Button,
  GridContainer,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'

import * as styles from './NamesEditor.treat'
import EditForm from '../EditForm/EditForm'
import EditModal from '../EditModal/EditModal'
import TableList from '../TableList/TableList'

interface NamesEditorProps {}

const NamesEditor: FC<NamesEditorProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <Box marginY={3}>
      <GridContainer className={styles.gridContainer}>
        <GridRow>
          <GridColumn span={['12/12', '8/12']}>
            <Input
              name="q"
              label="Nafn"
              placeholder="Leita að nafni"
              size="md"
              onChange={(e) => console.log(e.target.value)}
            />
          </GridColumn>
          <GridColumn span={['12/12', '4/12']}>
            <EditModal />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span={'12/12'}>
            <TableList />
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}

export default NamesEditor
