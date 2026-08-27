import { FormSystemField } from '@island.is/api/schema'
import { useLazyQuery, useMutation } from '@apollo/client'
import {
  GET_ORGANIZATION_ZENDESK_INSTANCE,
  UPDATE_ORGANIZATION_ZENDESK_INSTANCE,
} from '@island.is/form-system/graphql'
import { FieldTypesEnum, ListTypesEnum } from '@island.is/form-system/enums'
import { m } from '@island.is/form-system/ui'
import {
  Button,
  GridColumn as Column,
  GridRow as Row,
  Input,
  RadioButton,
  Select,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useContext, useEffect, useState } from 'react'
import { ControlContext } from '../../../../../../../context/ControlContext'
import { ListFromUrl } from './ListFromUrl'

type ZendeskInstanceConfig = {
  serviceSystemInstance: string
  serviceSystemBrandID: string
}

const parseZendeskBrandIds = (brandIds?: string | null) =>
  brandIds
    ?.split(';')
    .map((brandId) => brandId.trim())
    .filter(Boolean) ?? []

const formatZendeskInstance = (zendeskInstance?: string | null) =>
  zendeskInstance ? `${zendeskInstance}.zendesk.com` : ''

const unsupportedZendeskInstanceMessage =
  'Zendesk instance er ekki gilt. Athugaðu skráningu þína í Contentful.'

export const ListSettings = () => {
  const {
    control,
    setInListBuilder,
    controlDispatch,
    setFocus,
    focus,
    updateActiveItem,
  } = useContext(ControlContext)
  const { activeItem, isReadOnly, form } = control
  const currentItem = activeItem.data as FormSystemField
  const [isCustom, setIsCustom] = useState(
    !currentItem.fieldSettings?.listType ||
      currentItem.fieldSettings?.listType === ListTypesEnum.CUSTOM,
  )
  const [unsupportedZendeskInstance, setUnsupportedZendeskInstance] = useState<
    string | undefined
  >()
  const [contentfulZendeskInstance, setContentfulZendeskInstance] = useState<
    string | undefined
  >()
  const [getZendeskInstance] = useLazyQuery(GET_ORGANIZATION_ZENDESK_INSTANCE, {
    fetchPolicy: 'no-cache',
  })
  const [updateOrganizationZendeskInstance] = useMutation(
    UPDATE_ORGANIZATION_ZENDESK_INSTANCE,
  )

  const { formatMessage } = useLocale()

  const predeterminedLists = [
    { label: 'Landalisti', value: ListTypesEnum.COUNTRIES },
    { label: 'Sveitarfélög', value: ListTypesEnum.MUNICIPALITIES },
    { label: 'Póstnúmer', value: ListTypesEnum.POSTAL_CODES },
    { label: 'Gjaldmiðlar', value: ListTypesEnum.CURRENCIES },
    { label: 'Stofnanir', value: ListTypesEnum.ORGANIZATIONS },
    { label: 'Listi frá slóð', value: ListTypesEnum.LIST_FROM_URL },
    {
      label: 'Zendesk forhlaðinn listi',
      value: ListTypesEnum.ZENDESK_FIELD_OPTIONS,
    },
    {
      label: 'Zendesk sérsniðinn hlutur',
      value: ListTypesEnum.ZENDESK_CUSTOM_OBJECT,
    },
  ]

  const selectedPredetermined =
    predeterminedLists.find(
      (o) => o.value === currentItem.fieldSettings?.listType,
    ) ?? null

  const selectCustomRadio = () => {
    if (isReadOnly) return
    setIsCustom(true)
    controlDispatch({
      type: 'SET_LIST_TYPE',
      payload: { listType: ListTypesEnum.CUSTOM, update: updateActiveItem },
    })
  }

  const selectPredeterminedRadio = () => {
    if (isReadOnly) return
    setIsCustom(false)
  }

  const updateZendeskInstance = async () => {
    const data = await getZendeskInstance({
      variables: {
        input: { nationalId: form.organizationNationalId },
      },
    })
    const zendeskInstanceInfo =
      data?.data?.formSystemOrganizationZendeskInstance

    if (!zendeskInstanceInfo) {
      return
    }

    let parsed: ZendeskInstanceConfig
    try {
      parsed = JSON.parse(zendeskInstanceInfo)
    } catch {
      return
    }
    setContentfulZendeskInstance(parsed.serviceSystemInstance)

    const brandIdOptions = parseZendeskBrandIds(parsed.serviceSystemBrandID)
    const nextZendeskBrandId =
      brandIdOptions.length === 1
        ? brandIdOptions[0]
        : brandIdOptions.includes(
            form.organizationZendeskInstance?.zendeskBrandId ?? '',
          )
        ? form.organizationZendeskInstance?.zendeskBrandId ?? ''
        : ''

    try {
      await updateOrganizationZendeskInstance({
        variables: {
          input: {
            zendeskInstance: parsed.serviceSystemInstance,
            zendeskBrandId: nextZendeskBrandId,
            organizationId: form.organizationId,
            formId: form.id,
          },
        },
      })
    } catch {
      setUnsupportedZendeskInstance(parsed.serviceSystemInstance)
      return
    }

    if (
      parsed.serviceSystemInstance ===
        form.organizationZendeskInstance?.zendeskInstance &&
      nextZendeskBrandId === form.organizationZendeskInstance?.zendeskBrandId
    ) {
      return
    }

    controlDispatch({
      type: 'CHANGE_ORGANIZATION_ZENDESK_INSTANCE',
      payload: {
        zendeskInstance: parsed.serviceSystemInstance,
        zendeskBrandId: nextZendeskBrandId,
      },
    })
    setUnsupportedZendeskInstance(undefined)
  }

  useEffect(() => {
    const listType = currentItem.fieldSettings?.listType
    setIsCustom(!listType || listType === ListTypesEnum.CUSTOM)
  }, [currentItem.id])

  useEffect(() => {
    const listType = currentItem.fieldSettings?.listType

    if (
      listType === ListTypesEnum.ZENDESK_FIELD_OPTIONS ||
      listType === ListTypesEnum.ZENDESK_CUSTOM_OBJECT
    ) {
      updateZendeskInstance()
    }
  }, [currentItem.fieldSettings?.listType])

  const radioName = `listTypeMode-${currentItem.id}`
  const zendeskInstance = form.organizationZendeskInstance?.zendeskInstance
  const zendeskInstanceValue = formatZendeskInstance(
    contentfulZendeskInstance ?? zendeskInstance,
  )
  const zendeskInstanceError =
    unsupportedZendeskInstance || !zendeskInstanceValue
      ? unsupportedZendeskInstanceMessage
      : undefined

  return (
    <Stack space={2}>
      {currentItem.fieldType === FieldTypesEnum.DROPDOWN_LIST && (
        <>
          <Column span="3/10">
            <RadioButton
              id={`${radioName}-custom`}
              name={radioName}
              label={formatMessage(m.customList)}
              disabled={isReadOnly}
              checked={isCustom}
              onChange={selectCustomRadio}
            />
          </Column>
          <Column span="3/10">
            <RadioButton
              id={`${radioName}-predetermined`}
              name={radioName}
              label={formatMessage(m.predeterminedLists)}
              disabled={
                isReadOnly ||
                !!(currentItem.list && currentItem.list.length > 0)
              }
              tooltip={
                !isReadOnly && currentItem.list && currentItem.list.length > 0
                  ? 'Óvirkt þar sem reiturinn er nú þegar með sérsniðinn lista. Tæmdu listann (Listasmiður) til að virkja tilbúna fellilista.'
                  : undefined
              }
              checked={!isCustom}
              onChange={selectPredeterminedRadio}
            />
          </Column>
        </>
      )}
      {isCustom && (
        <Button variant="ghost" onClick={() => setInListBuilder(true)}>
          {formatMessage(m.listBuilder)}
        </Button>
      )}
      {!isCustom && (
        <>
          <Row>
            <Column span="5/10">
              <Select
                placeholder={formatMessage(m.chooseListType)}
                name="predeterminedLists"
                label={formatMessage(m.predeterminedLists)}
                options={predeterminedLists}
                value={selectedPredetermined}
                isDisabled={isReadOnly}
                backgroundColor="blue"
                onChange={(option) => {
                  controlDispatch({
                    type: 'SET_LIST_TYPE',
                    payload: {
                      listType: option?.value ?? ListTypesEnum.CUSTOM,
                      update: updateActiveItem,
                    },
                  })
                }}
              />
            </Column>
            {currentItem.fieldSettings?.listType ===
              ListTypesEnum.ZENDESK_FIELD_OPTIONS && (
              <Column span="5/10">
                <Input
                  label="Zendesk ticket field ID"
                  name="zendeskTicketFieldId"
                  type="text"
                  value={
                    currentItem.fieldSettings?.zendeskTicketFieldId
                      ? String(currentItem.fieldSettings.zendeskTicketFieldId)
                      : ''
                  }
                  backgroundColor="blue"
                  readOnly={isReadOnly}
                  onChange={(e) => {
                    controlDispatch({
                      type: 'SET_ANY_FIELD_SETTING',
                      payload: {
                        property: 'zendeskTicketFieldId',
                        value: e.target.value,
                      },
                    })
                  }}
                  onFocus={(e) => setFocus(e.target.value)}
                  onBlur={(e) => e.target.value !== focus && updateActiveItem()}
                />
              </Column>
            )}
            {currentItem.fieldSettings?.listType ===
              ListTypesEnum.ZENDESK_CUSTOM_OBJECT && (
              <Column span="5/10">
                <Input
                  label="Zendesk custom object key"
                  name="zendeskCustomObjectKey"
                  type="text"
                  value={
                    currentItem.fieldSettings?.zendeskCustomObjectKey
                      ? String(currentItem.fieldSettings.zendeskCustomObjectKey)
                      : ''
                  }
                  backgroundColor="blue"
                  readOnly={isReadOnly}
                  onChange={(e) => {
                    controlDispatch({
                      type: 'SET_ANY_FIELD_SETTING',
                      payload: {
                        property: 'zendeskCustomObjectKey',
                        value: e.target.value,
                      },
                    })
                  }}
                  onFocus={(e) => setFocus(e.target.value)}
                  onBlur={(e) => e.target.value !== focus && updateActiveItem()}
                />
              </Column>
            )}
          </Row>

          {(currentItem.fieldSettings?.listType ===
            ListTypesEnum.ZENDESK_FIELD_OPTIONS ||
            currentItem.fieldSettings?.listType ===
              ListTypesEnum.ZENDESK_CUSTOM_OBJECT) && (
            <Row>
              <Column span="5/10">
                <Input
                  label="Zendesk instance"
                  name="zendeskInstance"
                  type="text"
                  value={zendeskInstanceValue}
                  backgroundColor="blue"
                  readOnly
                  errorMessage={zendeskInstanceError}
                />
              </Column>
            </Row>
          )}
          {currentItem.fieldSettings?.listType ===
            ListTypesEnum.LIST_FROM_URL && <ListFromUrl />}
        </>
      )}
    </Stack>
  )
}
