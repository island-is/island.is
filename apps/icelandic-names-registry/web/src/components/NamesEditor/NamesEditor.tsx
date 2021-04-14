import React, { FC, useLayoutEffect, useState } from 'react'

import {
  Box,
  Input,
  ModalBase,
  Button,
  GridContainer,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'

import EditForm from '../EditForm/EditForm'
import EditModal from '../EditModal/EditModal'
import TableList from '../TableList/TableList'
import {
  GetIcelandicNameByInitialLetterQuery,
  GetIcelandicNameByInitialLetterQueryVariables,
  IcelandicName,
} from '../../graphql/schema'
import { GET_ICELANDIC_NAME_BY_INITIAL_LETTER } from '../../graphql/queries'
import { useLazyQuery } from '@apollo/client'

import * as styles from './NamesEditor.treat'

interface NamesEditorProps {}

type TIcelandicName = Pick<
  IcelandicName,
  'id' | 'icelandicName' | 'type' | 'status' | 'visible' | 'description' | 'url'
>

const NamesEditor: FC<NamesEditorProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [tableData, setTableData] = useState<TIcelandicName[]>([])
  const [retreive, { data, loading }] = useLazyQuery<
    GetIcelandicNameByInitialLetterQuery,
    GetIcelandicNameByInitialLetterQueryVariables
  >(GET_ICELANDIC_NAME_BY_INITIAL_LETTER, {
    variables: {
      input: {
        initialLetter: 'Æ',
      },
    },
  })

  useLayoutEffect(() => {
    retreive()
  }, [])

  useLayoutEffect(() => {
    if (data?.getIcelandicNameByInitialLetter) {
      const newTableData = data.getIcelandicNameByInitialLetter.map((x) => {
        return {
          ...x,
          icelandicName:
            x.icelandicName.charAt(0).toUpperCase() + x.icelandicName.slice(1),
        }
      })

      setTableData(newTableData)
    }
  }, [data])

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
            <Button
              variant="ghost"
              icon="add"
              size="small"
              onClick={() => {
                setIsVisible(true)
              }}
            >
              Bæta við nafni
            </Button>
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span={'12/12'}>
            <TableList data={tableData} loading={loading} />
          </GridColumn>
        </GridRow>
      </GridContainer>
      <EditModal isVisible={isVisible} setIsVisible={setIsVisible} />
    </Box>
  )
}

export default NamesEditor
