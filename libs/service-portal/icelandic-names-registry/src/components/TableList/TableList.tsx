import React, { FC } from 'react'

import {
  Button,
  DropdownMenu,
  Icon,
  Text,
  Table as T,
} from '@island.is/island-ui/core'

import {
  NameStatusStrings,
  NameTypeStrings,
  NameStatusStringColors,
} from '../../constants'
import { IcelandicNameInputs } from '../../types'

import * as styles from './TableList.treat'

interface TableListProps {
  names: IcelandicNameInputs[]
  setCurrentName: (currentName: IcelandicNameInputs) => void
  setNameToDelete: (currentName: IcelandicNameInputs) => void
  loading?: boolean
}

const TableList: FC<TableListProps> = ({
  names = [],
  setCurrentName,
  setNameToDelete,
  loading,
}) => {
  return (
    <>
      <div className={styles.container}>
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>Nafn</T.HeadData>
              <T.HeadData>Tegund</T.HeadData>
              <T.HeadData>Staða</T.HeadData>
              <T.HeadData>Lýsing</T.HeadData>
              <T.HeadData>Úrskurður</T.HeadData>
              <T.HeadData>Birt</T.HeadData>
              <T.HeadData box={{ textAlign: 'right' }}>Aðgerðir</T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {loading && (
              <T.Row>
                <T.Data colSpan={6}>Augnablik, sæki lista...</T.Data>
              </T.Row>
            )}
            {!loading &&
              names.map((x, index) => {
                return (
                  <T.Row key={index}>
                    <T.Data>
                      <Text fontWeight="semiBold">{x.icelandicName}</Text>
                    </T.Data>
                    <T.Data>{x.type ? NameTypeStrings[x.type] : null}</T.Data>
                    <T.Data>
                      <Text
                        variant="small"
                        color={NameStatusStringColors[x.status]}
                      >
                        {x.status ? NameStatusStrings[x.status] : null}
                      </Text>
                    </T.Data>
                    <T.Data>{x.description}</T.Data>
                    <T.Data>{x.verdict}</T.Data>
                    <T.Data>
                      <Icon
                        title="Birt"
                        icon={x.visible ? 'checkmark' : 'close'}
                        color={x.visible ? 'blue400' : 'red600'}
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
                              setCurrentName(x)
                            },
                          },
                          {
                            title: 'Eyða',
                            onClick: () => {
                              setNameToDelete(x)
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
    </>
  )
}

export default TableList
