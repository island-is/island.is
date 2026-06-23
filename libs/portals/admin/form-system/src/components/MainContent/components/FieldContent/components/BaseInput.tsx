import { FormSystemField } from '@island.is/api/schema'
import { FieldTypesEnum } from '@island.is/form-system/enums'
import { m } from '@island.is/form-system/ui'
import {
  Checkbox,
  GridColumn as Column,
  Input,
  Option,
  GridRow as Row,
  Select,
  Stack,
} from '@island.is/island-ui/core'
import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { SingleValue } from 'react-select'
import { ControlContext } from '../../../../../context/ControlContext'
import { NavbarSelectStatus } from '../../../../../lib/utils/interfaces'

export const BaseInput = () => {
  const {
    control,
    controlDispatch,
    setFocus,
    focus,
    fieldTypes,
    updateActiveItem,
    getTranslation,
    selectStatus,
  } = useContext(ControlContext)
  const { activeItem, form, isReadOnly } = control
  const currentItem = activeItem.data as FormSystemField
  const defaultValue = fieldTypes?.find(
    (fieldType) => fieldType?.id === currentItem.fieldType,
  )
  const defaultOption: Option<string> | undefined = defaultValue
    ? { value: defaultValue.id ?? '', label: defaultValue.name?.is ?? '' }
    : undefined
  const { formatMessage } = useIntl()
  const screen = control.form.screens?.find(
    (s) => s && s.id === currentItem.screenId,
  )

  const hasAssetLookupPermission = fieldTypes?.some(
    (fieldType) =>
      fieldType?.id === FieldTypesEnum.REAL_ESTATE ||
      fieldType?.id === FieldTypesEnum.VEHICLE,
  )

  const excludedFieldTypes = [
    FieldTypesEnum.NATIONAL_ID_WITH_ADDRESS,
    FieldTypesEnum.VEHICLE,
    FieldTypesEnum.REAL_ESTATE,
    ...(!hasAssetLookupPermission ? [FieldTypesEnum.ASSETS] : []),
  ]

  const selectList =
    fieldTypes
      ?.filter((fieldType): fieldType is NonNullable<typeof fieldType> =>
        Boolean(fieldType?.id),
      )
      .filter(
        (fieldType) =>
          form.hasPayment || fieldType.id !== FieldTypesEnum.PAYMENT_QUANTITY,
      )
      .filter(
        (fieldType) =>
          fieldType.id !== FieldTypesEnum.NATIONAL_ID_WITH_ADDRESS &&
          fieldType.id !== FieldTypesEnum.PAYMENT,
      )
      .filter((fieldType) => !excludedFieldTypes.includes(fieldType.id))
      .map((fieldType) => ({
        value: fieldType.id ?? '',
        label: fieldType.name?.is ?? fieldType.id ?? '',
      }))
      .sort((a, b) =>
        a.label.localeCompare(b.label, 'is', { sensitivity: 'base' }),
      ) ?? []

  const renderDescription = () => {
    if (currentItem.fieldType === FieldTypesEnum.MESSAGE) {
      return true
    }
    if (
      currentItem.fieldType === FieldTypesEnum.TEXTBOX &&
      currentItem.fieldSettings?.hasDescription
    ) {
      return true
    }
    return false
  }

  const listItemIds =
    currentItem.list
      ?.map((item) => item?.id)
      .filter((id): id is string => Boolean(id)) ?? []

  const isDependencyParent = (form.dependencies ?? []).some((dep) => {
    const parent = dep?.parentProp
    if (!parent) return false

    if (currentItem.fieldType === FieldTypesEnum.CHECKBOX) {
      return parent === currentItem.id
    }

    if (
      currentItem.fieldType === FieldTypesEnum.RADIO_BUTTONS ||
      currentItem.fieldType === FieldTypesEnum.DROPDOWN_LIST
    ) {
      return listItemIds.includes(parent)
    }

    return false
  })

  return (
    <Stack space={2}>
      <Row>
        <Column span={['10/10', '5/10']}>
          <Select
            label={formatMessage(m.type)}
            name="fieldTypeSelect"
            options={selectList}
            placeholder={formatMessage(m.chooseType)}
            backgroundColor="blue"
            isSearchable
            value={defaultOption}
            isDisabled={
              selectStatus === NavbarSelectStatus.NORMAL || isReadOnly
            }
            onChange={(e: SingleValue<Option<string>>) => {
              controlDispatch({
                type: 'CHANGE_FIELD_TYPE',
                payload: {
                  newValue: e?.value ?? '',
                  fieldSettings:
                    fieldTypes?.find((i) => i?.id === e?.value)
                      ?.fieldSettings ?? {},
                  update: updateActiveItem,
                },
              })
            }}
          />
        </Column>
      </Row>
      <Row>
        <Column span="10/10">
          <Input
            label={formatMessage(m.name)}
            name="name"
            value={currentItem?.name?.is ?? ''}
            backgroundColor="blue"
            readOnly={isReadOnly}
            onChange={(e) =>
              controlDispatch({
                type: 'CHANGE_NAME',
                payload: {
                  lang: 'is',
                  newValue: e.target.value,
                },
              })
            }
            onFocus={(e) => setFocus(e.target.value)}
            onBlur={(e) => e.target.value !== focus && updateActiveItem()}
          />
        </Column>
      </Row>
      <Row>
        <Column span="10/10">
          <Input
            label={formatMessage(m.nameEnglish)}
            name="nameEn"
            value={currentItem?.name?.en ?? ''}
            backgroundColor="blue"
            readOnly={isReadOnly}
            onChange={(e) =>
              controlDispatch({
                type: 'CHANGE_NAME',
                payload: {
                  lang: 'en',
                  newValue: e.target.value,
                },
              })
            }
            onFocus={async (e) => {
              if (!currentItem?.name?.en && currentItem?.name?.is !== '') {
                const translation = await getTranslation(
                  currentItem?.name?.is ?? '',
                )
                controlDispatch({
                  type: 'CHANGE_NAME',
                  payload: {
                    lang: 'en',
                    newValue: translation.translation,
                  },
                })
              }
              setFocus(e.target.value)
            }}
            onBlur={(e) => e.target.value !== focus && updateActiveItem()}
          />
        </Column>
      </Row>
      {/* Description  */}
      {renderDescription() && (
        <>
          <Row>
            <Column span="10/10">
              <Input
                label={formatMessage(m.description)}
                name="description"
                value={currentItem?.description?.is ?? ''}
                textarea
                backgroundColor="blue"
                readOnly={isReadOnly}
                onFocus={(e) => setFocus(e.target.value)}
                onBlur={(e) => e.target.value !== focus && updateActiveItem()}
                onChange={(e) =>
                  controlDispatch({
                    type: 'CHANGE_DESCRIPTION',
                    payload: {
                      lang: 'is',
                      newValue: e.target.value,
                    },
                  })
                }
              />
            </Column>
          </Row>
          <Row>
            <Column span="10/10">
              <Input
                label={formatMessage(m.descriptionEnglish)}
                name="description"
                value={currentItem?.description?.en ?? ''}
                textarea
                backgroundColor="blue"
                readOnly={isReadOnly}
                onFocus={async (e) => {
                  if (
                    !currentItem?.description?.en &&
                    currentItem?.description?.is !== ''
                  ) {
                    const translation = await getTranslation(
                      currentItem?.description?.is ?? '',
                    )
                    controlDispatch({
                      type: 'CHANGE_DESCRIPTION',
                      payload: {
                        lang: 'en',
                        newValue: translation.translation,
                      },
                    })
                  }
                  setFocus(e.target.value)
                }}
                onBlur={(e) => e.target.value !== focus && updateActiveItem()}
                onChange={(e) =>
                  controlDispatch({
                    type: 'CHANGE_DESCRIPTION',
                    payload: {
                      lang: 'en',
                      newValue: e.target.value,
                    },
                  })
                }
              />
            </Column>
          </Row>
        </>
      )}
      {/* Required checkbox */}
      {screen?.isMulti &&
        currentItem.fieldType !== FieldTypesEnum.ISK_SUMBOX &&
        currentItem.fieldType !== FieldTypesEnum.FILE &&
        currentItem.fieldType !== FieldTypesEnum.PAYMENT_QUANTITY && (
          <Row>
            <Column span="5/10">
              <Checkbox
                label={formatMessage(m.isPartOfMulti)}
                checked={currentItem.isPartOfMultiset ?? false}
                disabled={isReadOnly || isDependencyParent}
                tooltip={
                  isDependencyParent
                    ? 'Þetta stýrir tengingum og getur því ekki verið hluti af fjölmengi'
                    : undefined
                }
                onChange={() =>
                  controlDispatch({
                    type: 'CHANGE_IS_PART_OF_MULTI',
                    payload: {
                      update: updateActiveItem,
                    },
                  })
                }
              />
            </Column>
          </Row>
        )}
      {currentItem.fieldType !== FieldTypesEnum.ISK_SUMBOX && (
        <Row>
          <Column span="5/10">
            <Checkbox
              label={formatMessage(m.required)}
              checked={currentItem.isRequired ?? false}
              disabled={isReadOnly}
              onChange={() =>
                controlDispatch({
                  type: 'CHANGE_IS_REQUIRED',
                  payload: {
                    update: updateActiveItem,
                  },
                })
              }
            />
          </Column>
        </Row>
      )}
    </Stack>
  )
}
