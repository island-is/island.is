import { useMutation } from '@apollo/client'
import {
  FormSystemField,
  FormSystemListItem,
  FormSystemScreen,
} from '@island.is/api/schema'
import { FieldTypesEnum } from '@island.is/form-system/enums'
import {
  CREATE_FIELD,
  CREATE_LIST_ITEM,
  CREATE_SCREEN,
  UPDATE_FIELD,
  UPDATE_LIST_ITEM,
} from '@island.is/form-system/graphql'
import { m } from '@island.is/form-system/ui'
import { Box, Icon, Tooltip } from '@island.is/island-ui/core'
import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { ControlContext } from '../../../context/ControlContext'
import { removeTypename } from '../../../lib/utils/removeTypename'

interface Props {
  id: string
  type: 'Section' | 'Screen' | 'Field'
}

export const NavButtons = ({ id, type }: Props) => {
  const { control, controlDispatch, setOpenComponents } =
    useContext(ControlContext)

  const { form, isReadOnly } = control
  const { sections, screens, fields } = form
  const { formatMessage } = useIntl()

  const addHoverText =
    type === 'Section'
      ? formatMessage(m.addScreenHover)
      : formatMessage(m.addFieldHover)

  const copyHoverText = formatMessage(m.copyFieldHover)

  const [createScreen, { loading: createScreenLoading }] =
    useMutation(CREATE_SCREEN)
  const [createField] = useMutation(CREATE_FIELD)
  const [updateField] = useMutation(UPDATE_FIELD)
  const [createListItem] = useMutation(CREATE_LIST_ITEM)
  const [updateListItem] = useMutation(UPDATE_LIST_ITEM)

  const isPayment = (screenId: string) => {
    const screen = screens?.find((screen) => screen?.id === screenId)

    if (!screen) {
      return false
    }

    const section = sections?.find(
      (section) => section?.id === screen.sectionId,
    )

    return section?.sectionType === 'PAYMENT'
  }

  const getNextFieldDisplayOrder = (screenId?: string | null) => {
    const screenFields =
      fields?.filter(
        (field): field is FormSystemField =>
          Boolean(field) && field?.screenId === screenId,
      ) ?? []

    return (
      screenFields.reduce(
        (highestDisplayOrder, field) =>
          Math.max(highestDisplayOrder, field.displayOrder ?? -1),
        -1,
      ) + 1
    )
  }

  const copyListItems = async (
    originalField: FormSystemField,
    copiedFieldId: string,
  ): Promise<FormSystemListItem[]> => {
    const originalListItems =
      originalField.list?.filter((item): item is FormSystemListItem =>
        Boolean(item),
      ) ?? []

    return Promise.all(
      originalListItems.map(async (item, index) => {
        const displayOrder = item.displayOrder ?? index

        const createdListItem = await createListItem({
          variables: {
            input: {
              createListItemDto: {
                fieldId: copiedFieldId,
                displayOrder,
              },
            },
          },
        })

        const newListItem = removeTypename(
          createdListItem.data?.createFormSystemListItem,
        ) as FormSystemListItem

        const copiedListItem: FormSystemListItem = {
          ...newListItem,
          label: removeTypename(item.label),
          description: removeTypename(item.description),
          value: item.value,
          displayOrder,
          isSelected: item.isSelected ?? false,
        }

        await updateListItem({
          variables: {
            input: {
              id: copiedListItem.id,
              updateListItemDto: {
                label: copiedListItem.label,
                description: copiedListItem.description,
                value: copiedListItem.value,
                isSelected: copiedListItem.isSelected,
              },
            },
          },
        })

        return copiedListItem
      }),
    )
  }

  const copyField = async () => {
    const originalField = fields?.find(
      (field): field is FormSystemField => Boolean(field) && field?.id === id,
    )

    if (!originalField?.screenId || !originalField.fieldType) {
      return
    }

    const displayOrder = getNextFieldDisplayOrder(originalField.screenId)

    const createdField = await createField({
      variables: {
        input: {
          createFieldDto: {
            screenId: originalField.screenId,
            fieldType: originalField.fieldType,
            displayOrder,
          },
        },
      },
    })

    const newField = removeTypename(
      createdField.data?.createFormSystemField,
    ) as FormSystemField

    const copiedList = await copyListItems(originalField, newField.id)

    const copiedField: FormSystemField = {
      ...newField,
      screenId: originalField.screenId,
      fieldType: originalField.fieldType,
      displayOrder,
      name: removeTypename(originalField.name),
      description: removeTypename(originalField.description),
      isPartOfMultiset: originalField.isPartOfMultiset ?? false,
      isRequired: originalField.isRequired ?? false,
      isHidden: originalField.isHidden ?? false,
      fieldSettings: removeTypename(originalField.fieldSettings),
      list: copiedList,
    }

    await updateField({
      variables: {
        input: {
          id: copiedField.id,
          updateFieldDto: {
            name: copiedField.name,
            description: copiedField.description,
            isPartOfMultiset: copiedField.isPartOfMultiset,
            fieldSettings: copiedField.fieldSettings,
            fieldType: copiedField.fieldType,
            isRequired: copiedField.isRequired,
            isHidden: copiedField.isHidden,
          },
        },
      },
    })

    controlDispatch({
      type: 'ADD_FIELD',
      payload: {
        field: copiedField,
      },
    })

    setOpenComponents((prev) => ({
      ...prev,
      screens: prev.screens.includes(originalField.screenId as string)
        ? prev.screens
        : [...prev.screens, originalField.screenId as string],
    }))
  }

  const addItem = async () => {
    if (type === 'Section') {
      const newScreen = await createScreen({
        variables: {
          input: {
            createScreenDto: {
              sectionId: id,
              displayOrder: screens?.length,
            },
          },
        },
      })

      if (newScreen && !createScreenLoading) {
        controlDispatch({
          type: 'ADD_SCREEN',
          payload: {
            screen: removeTypename(
              newScreen.data?.createFormSystemScreen,
            ) as FormSystemScreen,
          },
        })

        setOpenComponents((prev) => ({
          ...prev,
          sections: prev.sections.includes(id)
            ? prev.sections
            : [...prev.sections, id],
        }))
      }
    } else if (type === 'Screen') {
      const newField = await createField({
        variables: {
          input: {
            createFieldDto: {
              screenId: id,
              fieldType: isPayment(id)
                ? FieldTypesEnum.PAYMENT
                : FieldTypesEnum.TEXTBOX,
              displayOrder: getNextFieldDisplayOrder(id),
            },
          },
        },
      })

      if (newField) {
        controlDispatch({
          type: 'ADD_FIELD',
          payload: {
            field: removeTypename(
              newField.data?.createFormSystemField,
            ) as FormSystemField,
          },
        })

        setOpenComponents((prev) => ({
          ...prev,
          screens: prev.screens.includes(id)
            ? prev.screens
            : [...prev.screens, id],
        }))
      }
    }
  }

  if (isReadOnly) {
    return null
  }

  return (
    <Box display="flex" flexDirection="row">
      {type === 'Field' && control.activeItem?.data?.id === id && (
        <Box
          style={{ paddingTop: '5px', cursor: 'pointer' }}
          marginRight={1}
          onClick={(e) => {
            e.stopPropagation()
            copyField()
          }}
        >
          <Tooltip text={copyHoverText} color="yellow200">
            <span>
              <Icon icon="copy" color="blue400" size="medium" type="outline" />
            </span>
          </Tooltip>
        </Box>
      )}

      {type !== 'Field' && (
        <Box
          style={{ paddingTop: '5px', cursor: 'pointer' }}
          marginRight={1}
          onClick={(e) => {
            e.stopPropagation()
            addItem()
          }}
        >
          <Tooltip text={addHoverText} color="yellow200">
            <span>
              <Icon icon="add" color="blue400" size="medium" />
            </span>
          </Tooltip>
        </Box>
      )}
    </Box>
  )
}
