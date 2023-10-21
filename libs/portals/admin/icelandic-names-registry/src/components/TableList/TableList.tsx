import React, { FC } from 'react'
import { useQuery } from '@apollo/client'

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
import { IcelandicNameType } from '../../types'

import {
  GetIcelandicNameBySearchQuery,
  GetIcelandicNameBySearchQueryVariables,
} from '../../graphql/schema'
import { GET_ICELANDIC_NAME_BY_SEARCH } from '../../queries'

import * as styles from './TableList.css'

interface TableListProps {
  q: string
  setCurrentName: (currentName: IcelandicNameType) => void
  setNameToDelete: (currentName: IcelandicNameType) => void
}

const TableList: FC<React.PropsWithChildren<TableListProps>> = ({
  q,
  setCurrentName,
  setNameToDelete,
}) => {
  const { data, loading, error } = useQuery<
    GetIcelandicNameBySearchQuery,
    GetIcelandicNameBySearchQueryVariables
  >(GET_ICELANDIC_NAME_BY_SEARCH, {
    variables: {
      input: {
        q,
      },
    },
  })

  if (loading) {
    return <div>Sæki lista...</div>
  }

  if (error) {
    return <div>Villa kom upp við að sækja nöfn.</div>
  }

  if (data?.getIcelandicNameBySearch?.length === 0) {
    return <div>Ekkert fannst.</div>
  }

  return (
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
            data?.getIcelandicNameBySearch.map((x, index) => {
              return (
                <T.Row key={index}>
                  <T.Data>
                    <Text fontWeight="semiBold">{x.icelandicName}</Text>
                  </T.Data>
                  <T.Data>{x.type ? NameTypeStrings[x.type] : null}</T.Data>
                  <T.Data>
                    <Text
                      variant="small"
                      color={NameStatusStringColors[x.status as string]}
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
                            setCurrentName(x as IcelandicNameType)
                          },
                        },
                        {
                          title: 'Eyða',
                          onClick: () => {
                            setNameToDelete(x as IcelandicNameType)
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
