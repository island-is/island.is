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
  ToastContainer,
  toast,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../lib/messages'
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
  const { formatMessage } = useLocale()
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
      try {
        await updateName({
          variables: { input: { id, body } },
        })
        toast.success(formatMessage(m.notificationNameUpdated))
        setIsVisible(false)
        doSearch()
      } catch (e) {
        toast.error(formatMessage(m.notificationError))
      }
    } else {
      try {
        await createName({ variables: { input: body } })
        toast.success(formatMessage(m.notificationNameAdded))
        setIsVisible(false)
        doSearch()
      } catch (e) {
        toast.error(formatMessage(m.notificationError))
      }
    }
  }

  const onConfirmDelete = async () => {
    if (nameToDelete?.id) {
      const body: DeleteIcelandicNameByIdInput = {
        id: nameToDelete.id,
      }

      try {
        await deleteName({
          variables: { input: { id: body.id } },
        })
        setIsConfirmationVisible(false)
        toast.success(formatMessage(m.notificationNameDeleted))
        doSearch()
      } catch (e) {
        toast.error(formatMessage(m.notificationError))
      }
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
      <Stack space={3}>
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
          label={formatMessage(m.searchName)}
          placeholder={formatMessage(m.searchForNameOrPartOfName)}
          size="md"
          onChange={(e) => {
            setNothingFound(false)
            setSearchQuery(e.target.value)
          }}
        />
        <Button variant="ghost" icon="add" size="small" onClick={onAddNewName}>
          {formatMessage(m.addName)}
        </Button>
        {tableData !== null && (
          <>
            {nothingFound ? (
              <Text variant="intro">{`${formatMessage(
                m.searchNothingFound,
              )} „${searchQuery}“.`}</Text>
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
          </>
        )}
      </Stack>
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
        message={`${formatMessage(m.confirmDeleteName)} ${
          nameToDelete?.icelandicName
        }?`}
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
