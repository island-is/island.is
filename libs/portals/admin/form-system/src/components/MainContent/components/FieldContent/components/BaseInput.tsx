import { FormSystemField } from '@island.is/api/schema'
import { FieldTypesEnum } from '@island.is/form-system/enums'
import { m } from '@island.is/form-system/ui'
import {
  Accordion,
  AccordionItem,
  Bullet,
  BulletList,
  Checkbox,
  GridColumn as Column,
  DatePicker,
  Input,
  Option,
  GridRow as Row,
  Select,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
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
    FieldTypesEnum.NATIONAL_ID_ESTATE,
    FieldTypesEnum.VEHICLE,
    FieldTypesEnum.REAL_ESTATE,
    FieldTypesEnum.CHILD,
    FieldTypesEnum.SPOUSE,
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
      {currentItem.fieldType === FieldTypesEnum.DATE_PICKER && (
        <Stack space={2}>
          <Accordion dividerOnBottom={false}>
            <AccordionItem
              key={currentItem.id}
              id={`date-settings-${currentItem.id}`}
              label="Ítarlegar stillingar"
            >
              <Row>
                <Column span="10/10">
                  <Stack space={2}>
                    <Text>
                      Eftirfarandi stillingar eru valfrjálsar og hægt er að nota
                      þær saman eða í sitthvoru lagi.
                    </Text>
                    <BulletList color="dark400" space={0}>
                      <Bullet>
                        <strong>Fastar dagsetningar:</strong> Veldu fyrstu
                        og/eða síðustu leyfilegu dagsetningu.
                      </Bullet>
                      <Bullet>
                        <strong>Fjöldi daga:</strong> Tilgreindu fjölda daga sem
                        bætist við dagsetninguna þegar umsækjandi fyllir út
                        umsóknina.
                        <BulletList color="dark400" space={0}>
                          <Bullet>
                            <code>0</code> merkir daginn í dag.
                          </Bullet>
                          <Bullet>
                            <code>7</code> merkir eftir sjö daga.
                          </Bullet>
                          <Bullet>
                            <code>-7</code> merkir fyrir sjö dögum.
                          </Bullet>
                        </BulletList>
                      </Bullet>
                      <Bullet>
                        <strong>Samspil stillinga:</strong> Ef bæði föst
                        dagsetning og dagafjöldi eru tilgreind gilda
                        eftirfarandi takmarkanir:
                        <BulletList color="dark400" space={0}>
                          <Bullet>
                            Fyrsta leyfilega dagsetning getur aldrei verið fyrr
                            en föst upphafsdagsetning.
                          </Bullet>
                          <Bullet>
                            Síðasta leyfilega dagsetning getur aldrei verið
                            síðar en föst lokadagsetning.
                          </Bullet>
                        </BulletList>
                      </Bullet>
                    </BulletList>
                  </Stack>
                </Column>
              </Row>
            </AccordionItem>
          </Accordion>
          <Row>
            {(['minDate', 'maxDate'] as const).map((property) => (
              <Column key={property} span={['10/10', '5/10']}>
                <DatePicker
                  name={property}
                  label={
                    property === 'minDate'
                      ? 'Fyrsta leyfilega dagsetning'
                      : 'Síðasta leyfilega dagsetning'
                  }
                  placeholderText={formatMessage(m.chooseDate)}
                  locale="is"
                  backgroundColor="blue"
                  disabled={isReadOnly}
                  selected={
                    currentItem.fieldSettings?.[property]
                      ? parseISO(currentItem.fieldSettings[property])
                      : null
                  }
                  handleChange={(date) =>
                    controlDispatch({
                      type: 'SET_ANY_FIELD_SETTING',
                      payload: {
                        property,
                        value: date ? format(date, 'yyyy-MM-dd') : null,
                        update: updateActiveItem,
                      },
                    })
                  }
                  handleClear={() =>
                    controlDispatch({
                      type: 'SET_ANY_FIELD_SETTING',
                      payload: {
                        property,
                        value: null,
                        update: updateActiveItem,
                      },
                    })
                  }
                  isClearable
                />
              </Column>
            ))}
          </Row>
          <Row>
            {(['minDateDaysFromToday', 'maxDateDaysFromToday'] as const).map(
              (property) => (
                <Column key={property} span={['10/10', '5/10']}>
                  <Input
                    name={property}
                    label={
                      property === 'minDateDaysFromToday'
                        ? 'Fyrsta leyfilega dagsetning: dagar frá deginum í dag'
                        : 'Síðasta leyfilega dagsetning: dagar frá deginum í dag'
                    }
                    type="number"
                    step="1"
                    backgroundColor="blue"
                    readOnly={isReadOnly}
                    value={currentItem.fieldSettings?.[property] ?? ''}
                    onChange={(e) =>
                      controlDispatch({
                        type: 'SET_ANY_FIELD_SETTING',
                        payload: {
                          property,
                          value:
                            e.target.value === ''
                              ? null
                              : Number(e.target.value),
                        },
                      })
                    }
                    onFocus={(e) => setFocus(e.target.value)}
                    onBlur={(e) =>
                      e.target.value !== focus && updateActiveItem()
                    }
                  />
                </Column>
              ),
            )}
          </Row>
        </Stack>
      )}
    </Stack>
  )
}
