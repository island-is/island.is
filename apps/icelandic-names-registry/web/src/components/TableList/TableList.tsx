import React, { FC, useLayoutEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'

import {
  Button,
  DropdownMenu,
  Icon,
  Text,
  Table as T,
} from '@island.is/island-ui/core'

import { GET_ICELANDIC_NAME_BY_INITIAL_LETTER } from '../../graphql/queries'
import {
  GetIcelandicNameByInitialLetterQuery,
  GetIcelandicNameByInitialLetterQueryVariables,
  IcelandicName,
} from '../../graphql/schema'
import { NameStatusStrings, NameTypeStrings } from '../../constants'

import * as styles from './TableList.treat'

interface TableListProps {
  data: TIcelandicName[]
  loading?: boolean
}

type TIcelandicName = Pick<
  IcelandicName,
  'id' | 'icelandicName' | 'type' | 'status' | 'visible' | 'description' | 'url'
>

const TableList: FC<TableListProps> = ({ data = [], loading }) => {
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
              data.map((x, index) => {
                return (
                  <T.Row key={index}>
                    <T.Data>
                      <Text fontWeight="semiBold">{x.icelandicName}</Text>
                    </T.Data>
                    <T.Data>{x.type ? NameTypeStrings[x.type] : null}</T.Data>
                    <T.Data>
                      {x.status ? NameStatusStrings[x.status] : null}
                    </T.Data>
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
    </>
  )
}

export default TableList
