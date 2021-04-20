import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import {
  Box,
  Input,
  Text,
  ModalBase,
  Button,
  GridContainer,
  GridColumn,
  GridRow,
  ToastContainer,
  toast,
} from '@island.is/island-ui/core'

import {
  GetIcelandicNameBySearchQuery,
  GetIcelandicNameBySearchQueryVariables,
  UpdateIcelandicNameMutationMutation,
  UpdateIcelandicNameMutationMutationVariables,
  CreateIcelandicNameMutationMutation,
  CreateIcelandicNameMutationMutationVariables,
  DeleteIcelandicNameMutationMutation,
  DeleteIcelandicNameMutationMutationVariables,
  CreateIcelandicNameInput,
  DeleteIcelandicNameByIdInput,
} from '../../queries/schema'
import {
  GET_ICELANDIC_NAME_BY_SEARCH,
  UPDATE_ICELANDIC_NAME_MUTATION,
  CREATE_ICELANDIC_NAME_MUTATION,
  DELETE_ICELANDIC_NAME_MUTATION,
} from '../../queries'
import EditForm from '../EditForm/EditForm'
import TableList from '../TableList/TableList'
import ConfirmModal from '../ConfirmModal/ConfirmModal'
import { IcelandicNameInputs } from '../../types'

import * as styles from './Editor.treat'

const Editor: FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [nothingFound, setNothingFound] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false)
  const [currentName, setCurrentName] = useState<IcelandicNameInputs | null>(
    null,
  )
  const [nameToDelete, setNameToDelete] = useState<IcelandicNameInputs | null>(
    null,
  )
  const [tableData, setTableData] = useState<IcelandicNameInputs[] | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [updateName] = useMutation<
    UpdateIcelandicNameMutationMutation,
    UpdateIcelandicNameMutationMutationVariables
  >(UPDATE_ICELANDIC_NAME_MUTATION)

  const [createName] = useMutation<
    CreateIcelandicNameMutationMutation,
    CreateIcelandicNameMutationMutationVariables
  >(CREATE_ICELANDIC_NAME_MUTATION)

  const [deleteName] = useMutation<
    DeleteIcelandicNameMutationMutation,
    DeleteIcelandicNameMutationMutationVariables
  >(DELETE_ICELANDIC_NAME_MUTATION)

  const [search, { data, loading }] = useLazyQuery<
    GetIcelandicNameBySearchQuery,
    GetIcelandicNameBySearchQueryVariables
  >(GET_ICELANDIC_NAME_BY_SEARCH, {
    fetchPolicy: 'no-cache',
  })

  useLayoutEffect(() => {
    if (data?.getIcelandicNameBySearch) {
      if (data.getIcelandicNameBySearch.length === 0) {
        setNothingFound(true)
      }

      const newTableData = data.getIcelandicNameBySearch.map((x) => {
        return {
          ...x,
          icelandicName:
            x.icelandicName.charAt(0).toUpperCase() + x.icelandicName.slice(1),
        } as IcelandicNameInputs
      })

      setTableData(newTableData)
    }
  }, [data])

  useEffect(() => {
    if (nameToDelete?.id) {
      setIsConfirmationVisible(true)
    }
  }, [nameToDelete])

  useEffect(() => {
    if (currentName?.id) {
      setIsVisible(true)
    }
  }, [currentName])

  const onSubmit = async (formState: IcelandicNameInputs) => {
    const { id, ...rest } = formState

    const body: CreateIcelandicNameInput = {
      ...rest,
      icelandicName: formState.icelandicName.toLowerCase(),
    }

    if (id) {
      await updateName({
        variables: { input: { id, body } },
      })
        .then(() => {
          toast.success(`Nafn var uppfært`)
          setIsVisible(false)
          doSearch()
        })
        .catch(() => {
          toast.error(`Villa kom upp`)
        })
    } else {
      await createName({ variables: { input: body } })
        .then(() => {
          toast.success(`Nafni var bætt við`)
          setIsVisible(false)
          doSearch()
        })
        .catch(() => {
          toast.error(`Villa kom upp`)
        })
    }
  }

  const onConfirmDelete = () => {
    if (nameToDelete?.id) {
      const body: DeleteIcelandicNameByIdInput = {
        id: nameToDelete.id,
      }

      deleteName({ variables: { input: { id: body.id } } })
        .then(() => {
          toast.success(`Nafni var eytt`)
          doSearch()
        })
        .catch(() => {
          toast.error(`Villa kom upp`)
        })
    }
  }

  const onClear = () => {
    setNameToDelete(null)
    setCurrentName(null)
  }

  const onAddNewName = () => {
    onClear()
    setIsVisible(true)
  }

  const doSearch = useCallback(() => {
    search({ variables: { input: { q: searchQuery } } })
    inputRef?.current?.focus()
  }, [search, inputRef, searchQuery])

  return (
    <Box marginY={3}>
      <GridContainer className={styles.gridContainer}>
        <GridRow>
          <GridColumn span={['12/12', '8/12']}>
            <Input
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (searchQuery.length > 1) {
                    doSearch()
                  }
                }
              }}
              name="q"
              ref={inputRef}
              label="Nafn"
              placeholder="Leitaðu að nafni eða hluta af nafni"
              size="md"
              onChange={(e) => {
                setNothingFound(false)
                setSearchQuery(e.target.value)
              }}
            />
          </GridColumn>
          <GridColumn span={['12/12', '4/12']}>
            <Button
              variant="ghost"
              icon="add"
              size="large"
              fluid
              onClick={onAddNewName}
            >
              Bæta við nafni
            </Button>
          </GridColumn>
        </GridRow>
        {tableData !== null && (
          <GridRow>
            <GridColumn span={'12/12'} paddingTop={3}>
              {nothingFound ? (
                <Text variant="intro">{`Ekkert fannst með leitarstrengnum „${searchQuery}“.`}</Text>
              ) : (
                !!tableData.length && (
                  <TableList
                    names={tableData}
                    loading={loading}
                    setCurrentName={setCurrentName}
                    setNameToDelete={setNameToDelete}
                  />
                )
              )}
            </GridColumn>
          </GridRow>
        )}
      </GridContainer>
      <ToastContainer closeButton={true} useKeyframeStyles={false} />
      <ModalBase
        baseId="icelandicNameDialog"
        className={styles.modal}
        isVisible={isVisible}
        hideOnClickOutside={false}
        onVisibilityChange={(visibility) => {
          if (!visibility) {
            onClear()
          }

          setIsVisible(visibility)
        }}
      >
        {({ closeModal }: { closeModal: () => void }) => (
          <Box position="relative" borderRadius="large" background="white">
            {!!isVisible && (
              <EditForm
                onSubmit={onSubmit}
                nameData={currentName ?? undefined}
                closeModal={() => {
                  onClear()
                  closeModal()
                }}
              />
            )}
          </Box>
        )}
      </ModalBase>
      <ConfirmModal
        isVisible={isConfirmationVisible}
        message={`Ertu viss um að þú viljir eyða nafninu ${nameToDelete?.icelandicName}?`}
        onConfirm={onConfirmDelete}
        onVisibilityChange={(visibility: boolean) => {
          if (!visibility) {
            onClear()
          }

          setIsConfirmationVisible(visibility)
        }}
      />
    </Box>
  )
}

export default Editor
