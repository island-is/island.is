import React, { useEffect, useRef, useState } from 'react'
import { useMutation, gql } from '@apollo/client'
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

import EditForm from '../EditForm/EditForm'
import TableList from '../TableList/TableList'
import ConfirmModal from '../ConfirmModal/ConfirmModal'
import { m } from '../../lib/messages'
import {
  UpdateIcelandicNameMutationMutation,
  UpdateIcelandicNameMutationMutationVariables,
  CreateIcelandicNameMutationMutation,
  CreateIcelandicNameMutationMutationVariables,
  DeleteIcelandicNameMutationMutation,
  DeleteIcelandicNameMutationMutationVariables,
  CreateIcelandicNameInput,
  DeleteIcelandicNameByIdInput,
  GetIcelandicNameBySearchQuery,
  GetIcelandicNameBySearchQueryVariables,
} from '../../graphql/schema'
import {
  UPDATE_ICELANDIC_NAME_MUTATION,
  CREATE_ICELANDIC_NAME_MUTATION,
  DELETE_ICELANDIC_NAME_MUTATION,
} from '../../mutations'
import { GET_ICELANDIC_NAME_BY_SEARCH } from '../../queries'
import { IcelandicNameType } from '../../types'

import * as styles from './Editor.css'

const Editor = () => {
  const { formatMessage } = useLocale()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [inputValue, setInputValue] = useState<string>('')
  const [isVisible, setIsVisible] = useState(false)
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false)
  const [currentName, setCurrentName] = useState<IcelandicNameType | null>(null)
  const [nameToDelete, setNameToDelete] = useState<IcelandicNameType | null>(
    null,
  )
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [updateName] = useMutation<
    UpdateIcelandicNameMutationMutation,
    UpdateIcelandicNameMutationMutationVariables
  >(UPDATE_ICELANDIC_NAME_MUTATION)

  const [createName] = useMutation<
    CreateIcelandicNameMutationMutation,
    CreateIcelandicNameMutationMutationVariables
  >(CREATE_ICELANDIC_NAME_MUTATION, {
    update(cache, { data }) {
      const newName = data?.createIcelandicName
      const variables: GetIcelandicNameBySearchQueryVariables = {
        input: { q: searchQuery },
      }

      const existingNames = cache.readQuery<
        GetIcelandicNameBySearchQuery,
        GetIcelandicNameBySearchQueryVariables
      >({
        variables,
        query: GET_ICELANDIC_NAME_BY_SEARCH,
      })

      if (existingNames && newName) {
        cache.writeQuery<
          GetIcelandicNameBySearchQuery,
          GetIcelandicNameBySearchQueryVariables
        >({
          variables,
          query: GET_ICELANDIC_NAME_BY_SEARCH,
          data: {
            getIcelandicNameBySearch: [
              ...(existingNames?.getIcelandicNameBySearch ?? []),
              newName,
            ],
          },
        })
      }
    },
  })

  const [deleteName] = useMutation<
    DeleteIcelandicNameMutationMutation,
    DeleteIcelandicNameMutationMutationVariables
  >(DELETE_ICELANDIC_NAME_MUTATION, {
    update(cache, { data }) {
      const nameToDelete = data?.deleteIcelandicNameById
      const variables: GetIcelandicNameBySearchQueryVariables = {
        input: { q: searchQuery },
      }

      const existingNames = cache.readQuery<
        GetIcelandicNameBySearchQuery,
        GetIcelandicNameBySearchQueryVariables
      >({
        variables,
        query: GET_ICELANDIC_NAME_BY_SEARCH,
      })

      if (existingNames && nameToDelete) {
        cache.writeQuery<
          GetIcelandicNameBySearchQuery,
          GetIcelandicNameBySearchQueryVariables
        >({
          variables,
          query: GET_ICELANDIC_NAME_BY_SEARCH,
          data: {
            getIcelandicNameBySearch:
              existingNames?.getIcelandicNameBySearch.filter(
                (x) => x.id !== nameToDelete.id,
              ),
          },
        })
      }
    },
  })

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

  const onSubmit = async (formState: IcelandicNameType) => {
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
      } catch (e) {
        toast.error(formatMessage(m.notificationError))
      }
    } else {
      try {
        await createName({
          variables: { input: body },
        })
        toast.success(formatMessage(m.notificationNameAdded))
        setIsVisible(false)
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

  return (
    <Box marginY={3}>
      <Stack space={3}>
        <Input
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (inputValue.length > 1) {
                setSearchQuery(inputValue)
              }
            }
          }}
          name="q"
          ref={inputRef}
          label={formatMessage(m.searchName)}
          placeholder={formatMessage(m.searchForNameOrPartOfName)}
          size="xs"
          onChange={(e) => {
            setInputValue(e.target.value)
          }}
        />
        <Button variant="ghost" icon="add" size="small" onClick={onAddNewName}>
          {formatMessage(m.addName)}
        </Button>
        {searchQuery.length > 1 && (
          <TableList
            q={searchQuery}
            setCurrentName={setCurrentName}
            setNameToDelete={setNameToDelete}
          />
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
