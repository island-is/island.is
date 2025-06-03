import React, { useState } from 'react'
import { pdf } from '@react-pdf/renderer'

import {
  Box,
  Button,
  GridContainer,
  Inline,
  Input,
  Pagination,
  Stack,
  Table,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { Modal } from '@island.is/react/components'

import { formatCurrency } from '../../../utils/currency'
import { StyledMemorialCard } from './MemorialCardPdf'

const PAGE_SIZE = 4

interface MemorialCard {
  hasBeenProcessed: boolean

  id: number

  date: string

  // Memorial details
  fund: string
  inMemoryOf: string
  amountISK: number

  senderSignature: string

  // Recipient information
  recipientName: string
  recipientAddress: string
  recipientPostalCode: string
  recipientPlace: string

  // Sender information
  senderName: string
  senderNationalId: string
  senderAddress: string
  senderPostalCode: string
  senderPlace: string
}

const data: MemorialCard[] = [
  {
    id: 0,
    date: '2025-01-01',
    fund: 'Minningagjafasjóður Landspítala Íslands',
    inMemoryOf: 'test',
    amountISK: 1000,
    senderSignature: 'test',
    recipientName: 'test',
    recipientAddress: 'test',
    recipientPostalCode: 'test',
    recipientPlace: 'test',
    senderName: 'test',
    senderNationalId: 'test',
    senderAddress: 'test',
    senderPostalCode: 'test',
    senderPlace: 'test',
    hasBeenProcessed: true,
  },
  {
    id: 1,
    date: '2025-01-01',
    fund: 'Minningarsjóður blóð- og krabbameinslækningadeilda',
    inMemoryOf: 'test',
    amountISK: 2000,
    senderSignature: 'test',
    recipientName: 'test',
    recipientAddress: 'test',
    recipientPostalCode: 'test',
    recipientPlace: 'test',
    senderName: 'test',
    senderNationalId: 'test',
    senderAddress: 'test',
    senderPostalCode: 'test',
    senderPlace: 'test',
    hasBeenProcessed: true,
  },
  {
    id: 2,
    date: '2025-01-01',
    fund: 'Minningarsjóður blóð- og krabbameinslækningadeilda',
    inMemoryOf: 'test',
    amountISK: 5000,
    senderSignature: 'test',
    recipientName: 'test',
    recipientAddress: 'test',
    recipientPostalCode: 'test',
    recipientPlace: 'test',
    senderName: 'test',
    senderNationalId: 'test',
    senderAddress: 'test',
    senderPostalCode: 'test',
    senderPlace: 'test',
    hasBeenProcessed: true,
  },
  {
    id: 3,
    date: '2025-01-01',
    fund: 'Minningarsjóður blóð- og krabbameinslækningadeilda',
    inMemoryOf: 'test',
    amountISK: 5000,
    senderSignature: 'test',
    recipientName: 'test',
    recipientAddress: 'test',
    recipientPostalCode: 'test',
    recipientPlace: 'test',
    senderName: 'test',
    senderNationalId: 'test',
    senderAddress: 'test',
    senderPostalCode: 'test',
    senderPlace: 'test',
    hasBeenProcessed: false,
  },
  {
    id: 4,
    date: '2025-01-01',
    fund: 'Minningarsjóður blóð- og krabbameinslækningadeilda',
    inMemoryOf: 'test',
    amountISK: 5000,
    senderSignature: 'test',
    recipientName: 'test',
    recipientAddress: 'test',
    recipientPostalCode: 'test',
    recipientPlace: 'test',
    senderName: 'test',
    senderNationalId: 'test',
    senderAddress: 'test',
    senderPostalCode: 'test',
    senderPlace: 'test',
    hasBeenProcessed: false,
  },
  {
    id: 5,
    date: '2025-01-01',
    fund: 'Minningarsjóður blóð- og krabbameinslækningadeilda',
    inMemoryOf: 'test',
    amountISK: 4000,
    senderSignature: 'test',
    recipientName: 'test',
    recipientAddress: 'test',
    recipientPostalCode: 'test',
    recipientPlace: 'test',
    senderName: 'test',
    senderNationalId: 'test',
    senderAddress: 'test',
    senderPostalCode: 'test',
    senderPlace: 'test',
    hasBeenProcessed: false,
  },
  {
    id: 6,
    date: '2025-01-01',
    fund: 'Minningarsjóður blóð- og krabbameinslækningadeilda',
    inMemoryOf: 'test',
    amountISK: 5000,
    senderSignature: 'test',
    recipientName: 'test',
    recipientAddress: 'test',
    recipientPostalCode: 'test',
    recipientPlace: 'test',
    senderName: 'test',
    senderNationalId: 'test',
    senderAddress: 'test',
    senderPostalCode: 'test',
    senderPlace: 'test',
    hasBeenProcessed: false,
  },
  {
    id: 7,
    date: '2025-01-01',
    fund: 'Minningarsjóður blóð- og krabbameinslækningadeilda',
    inMemoryOf: 'test',
    amountISK: 3000,
    senderSignature: 'test',
    recipientName: 'test',
    recipientAddress: 'test',
    recipientPostalCode: 'test',
    recipientPlace: 'test',
    senderName: 'test',
    senderNationalId: 'test',
    senderAddress: 'test',
    senderPostalCode: 'test',
    senderPlace: 'test',
    hasBeenProcessed: false,
  },
]

export const MemorialCardOverview = () => {
  const [modalState, setModalState] = useState({
    isVisible: false,
    selectedItem: {
      fund: '',
      senderSignature: '',
      inMemoryOf: '',
      id: -1,
    },
  })
  const [confirmModalState, setConfirmModalState] = useState({
    itemId: -1,
    isVisible: false,
  })
  const [dataState, setDataState] = useState(data)
  const [page, setPage] = useState(1)
  const [tag, setTag] = useState<'all' | 'processed' | 'notProcessed'>('all')
  const pageOffset = (page - 1) * PAGE_SIZE

  const items = dataState.filter((item) => {
    if (tag === 'all') return true
    if (tag === 'processed') return item.hasBeenProcessed
    return !item.hasBeenProcessed
  })

  return (
    <Box paddingTop={3}>
      <Modal
        closeButtonLabel="Loka"
        label="Breyta"
        id="edit"
        isVisible={modalState.isVisible}
        onClose={() =>
          setModalState((prevState) => ({ ...prevState, isVisible: false }))
        }
      >
        <GridContainer>
          <Box>
            <Stack space={5}>
              <Stack space={3}>
                <Input
                  name="fund"
                  onChange={(ev) => {
                    setModalState((prevState) => ({
                      ...prevState,
                      selectedItem: {
                        ...prevState.selectedItem,
                        fund: ev.target.value,
                      },
                    }))
                  }}
                  value={modalState.selectedItem.fund}
                  size="xs"
                  label="Sjóður"
                />
                <Input
                  name="senderSignature"
                  onChange={(ev) => {
                    setModalState((prevState) => ({
                      ...prevState,
                      selectedItem: {
                        ...prevState.selectedItem,
                        senderSignature: ev.target.value,
                      },
                    }))
                  }}
                  value={modalState.selectedItem.senderSignature}
                  size="xs"
                  label="Sendandi"
                />
                <Input
                  name="inMemoryOf"
                  onChange={(ev) => {
                    setModalState((prevState) => ({
                      ...prevState,
                      selectedItem: {
                        ...prevState.selectedItem,
                        inMemoryOf: ev.target.value,
                      },
                    }))
                  }}
                  value={modalState.selectedItem.inMemoryOf}
                  size="xs"
                  label="Til minningar um"
                />
              </Stack>
              <Box display="flex" justifyContent="flexEnd">
                <Button
                  size="small"
                  onClick={() => {
                    setDataState((prevState) => {
                      return prevState.map((item) => {
                        if (item.id === modalState.selectedItem.id) {
                          return { ...item, ...modalState.selectedItem }
                        }
                        return item
                      })
                    })
                    setModalState((prevState) => ({
                      ...prevState,
                      isVisible: false,
                    }))
                  }}
                >
                  Vista breytingar
                </Button>
              </Box>
            </Stack>
          </Box>
        </GridContainer>
      </Modal>
      <Modal
        id="confirm"
        label="Staðfesting á afgreiðslu"
        closeButtonLabel="Loka"
        isVisible={confirmModalState.isVisible}
        onClose={() =>
          setConfirmModalState((prevState) => ({
            ...prevState,
            isVisible: false,
          }))
        }
      >
        <GridContainer>
          <Stack space={3}>
            <Text>Ertu viss um þú viljir afgreiða kortið?</Text>
            <Inline align="center" alignY="center" space={5}>
              <Button
                size="small"
                variant="utility"
                onClick={() => {
                  setConfirmModalState((prevState) => ({
                    ...prevState,
                    isVisible: false,
                  }))
                }}
              >
                Hætta við
              </Button>
              <Button
                size="small"
                onClick={() => {
                  setDataState((prevState) =>
                    prevState.map((prevItem) => {
                      if (prevItem.id === confirmModalState.itemId)
                        return { ...prevItem, hasBeenProcessed: true }
                      return prevItem
                    }),
                  )
                  setConfirmModalState((prevState) => ({
                    ...prevState,
                    isVisible: false,
                  }))
                }}
              >
                Afgreiða
              </Button>
            </Inline>
          </Stack>
        </GridContainer>
      </Modal>
      <GridContainer>
        <Stack space={2}>
          <Text variant="h1">Yfirlit kortastyrkja</Text>
          <Inline alignY="center" space={3}>
            <Tag
              onClick={() => {
                setTag('all')
                setPage(1)
              }}
              active={tag === 'all'}
            >
              Allt
            </Tag>
            <Tag
              onClick={() => {
                setTag('processed')
                setPage(1)
              }}
              active={tag === 'processed'}
            >
              Afgreidd
            </Tag>
            <Tag
              onClick={() => {
                setTag('notProcessed')
                setPage(1)
              }}
              active={tag === 'notProcessed'}
            >
              Ekki afgreidd
            </Tag>
          </Inline>
          <Table.Table>
            <Table.Head>
              <Table.HeadData>Dagsetning</Table.HeadData>
              <Table.HeadData>Upphæð</Table.HeadData>
              <Table.HeadData>Sjóður</Table.HeadData>
              <Table.HeadData>Sendandi</Table.HeadData>
              <Table.HeadData>Til minningar um</Table.HeadData>
              <Table.HeadData>Kort</Table.HeadData>
              <Table.HeadData>Umslag</Table.HeadData>
              <Table.HeadData />
              {tag === 'notProcessed' && <Table.HeadData />}
            </Table.Head>
            <Table.Body>
              {items.slice(pageOffset, pageOffset + PAGE_SIZE).map((item) => (
                <Table.Row key={item.id}>
                  <Table.Data>
                    {new Date(item.date).toLocaleDateString()}
                  </Table.Data>
                  <Table.Data>{formatCurrency(item.amountISK)}</Table.Data>
                  <Table.Data>{item.fund}</Table.Data>
                  <Table.Data>{item.senderSignature}</Table.Data>
                  <Table.Data>{item.inMemoryOf}</Table.Data>
                  <Table.Data>
                    <Button
                      variant="text"
                      size="small"
                      icon="document"
                      iconType="outline"
                      nowrap={true}
                      onClick={async () => {
                        const blob = await pdf(
                          <StyledMemorialCard
                            date={new Date(item.date).toLocaleDateString()}
                            fund={item.fund}
                            inMemoryOf={item.inMemoryOf}
                            senderSignature={item.senderSignature}
                          />,
                        ).toBlob()

                        const url = URL.createObjectURL(blob)
                        const link = document.createElement('a')
                        link.href = url
                        link.download = 'minningarkort.pdf'
                        link.click()

                        // Clean up
                        URL.revokeObjectURL(url)
                      }}
                    >
                      Útbúa
                    </Button>
                  </Table.Data>
                  <Table.Data>
                    <Button
                      variant="text"
                      size="small"
                      icon="document"
                      iconType="outline"
                      nowrap={true}
                    >
                      Útbúa
                    </Button>
                  </Table.Data>
                  <Table.Data>
                    <Button
                      variant="text"
                      size="small"
                      icon="pencil"
                      iconType="outline"
                      nowrap={true}
                      onClick={() => {
                        setModalState({
                          selectedItem: {
                            id: item.id,
                            fund: item.fund,
                            inMemoryOf: item.inMemoryOf,
                            senderSignature: item.senderSignature,
                          },
                          isVisible: true,
                        })
                      }}
                    >
                      Breyta
                    </Button>
                  </Table.Data>
                  <Table.Data>
                    {tag === 'notProcessed' && (
                      <Button
                        size="small"
                        variant="utility"
                        nowrap={true}
                        onClick={() => {
                          setConfirmModalState({
                            isVisible: true,
                            itemId: item.id,
                          })
                        }}
                      >
                        Afgreiða
                      </Button>
                    )}
                  </Table.Data>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Table>
          <Pagination
            page={page}
            renderLink={(page, className, children) => (
              <button onClick={() => setPage(page)}>
                <span className={className}>{children}</span>
              </button>
            )}
            itemsPerPage={PAGE_SIZE}
            totalItems={items.length}
            variant="blue"
          />
        </Stack>
      </GridContainer>
    </Box>
  )
}
