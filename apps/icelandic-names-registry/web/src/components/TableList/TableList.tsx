import React, { FC, useLayoutEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'

import {
  Button,
  DropdownMenu,
  Icon,
  Text,
  Table as T,
} from '@island.is/island-ui/core'

import * as styles from './TableList.treat'

import { GET_ICELANDIC_NAME_BY_INITIAL_LETTER } from '../../graphql/queries'
import {
  GetIcelandicNameByInitialLetterQuery,
  GetIcelandicNameByInitialLetterQueryVariables,
  IcelandicName,
} from '../../graphql/schema'
import EditModal from '../EditModal/EditModal'

interface TableListProps {}

type TIcelandicName = Pick<
  IcelandicName,
  'id' | 'icelandicName' | 'type' | 'status' | 'visible' | 'description' | 'url'
>

const TableList: FC<TableListProps> = () => {
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
    <div className={styles.container}>
      <EditModal />
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>Nafn</T.HeadData>
            <T.HeadData>Tegund</T.HeadData>
            <T.HeadData>Staða</T.HeadData>
            <T.HeadData>Lýsing</T.HeadData>
            <T.HeadData>Birt</T.HeadData>
            <T.HeadData box={{ textAlign: 'right' }}>Valmynd</T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {loading && (
            <T.Row>
              <T.Data colSpan={6}>Augnablik, sæki lista...</T.Data>
            </T.Row>
          )}
          {!loading &&
            tableData.map((x, index) => {
              return (
                <T.Row key={index}>
                  <T.Data>
                    <Text fontWeight="semiBold">{x.icelandicName}</Text>
                  </T.Data>
                  <T.Data>{x.type}</T.Data>
                  <T.Data>{x.status}</T.Data>
                  <T.Data>{x.description}</T.Data>
                  <T.Data>
                    <Icon
                      title="Birt"
                      icon={!!x.visible ? 'checkmark' : 'close'}
                      color={!!x.visible ? 'blue400' : 'red600'}
                    />
                  </T.Data>
                  <T.Data
                    box={{
                      textAlign: 'right',
                      paddingTop: 'none',
                      paddingBottom: 'none',
                    }}
                  >
                    <DropdownMenu
                      disclosure={
                        <Button
                          icon="ellipsisVertical"
                          circle
                          colorScheme="negative"
                          title="Aðgerðir"
                          inline
                        />
                      }
                      items={[
                        {
                          title: 'Breyta',
                          onClick: () => {
                            console.log('deila')
                          },
                        },
                        {
                          title: 'Eyða',
                          onClick: () => {
                            console.log('skoða')
                          },
                        },
                      ]}
                    />
                  </T.Data>
                </T.Row>
              )
            })}
        </T.Body>
      </T.Table>
    </div>
  )
}

export default TableList
