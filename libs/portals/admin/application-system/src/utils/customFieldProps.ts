import { createContext } from 'react'
import {
  FieldTypes,
  type ApplicationTypes,
  type FormNode,
  type RecordObject,
  type RoleInState,
} from '@island.is/application/types'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'

export type CustomFieldProps = Record<string, RecordObject>

export type CustomFieldPropsByForm = Record<string, CustomFieldProps>

export const customFieldPropsFormKey = (stateKey: string, roleId: string) =>
  `${stateKey}/${roleId}`

export const CustomFieldPropsContext = createContext<CustomFieldProps>({})

const previewFeatureFlagClient = {
  getValue: () => Promise.resolve(undefined),
}

const collectCustomFieldProps = (node: FormNode, into: CustomFieldProps) => {
  if (
    node.type === FieldTypes.CUSTOM &&
    node.props &&
    typeof node.id === 'string' &&
    !(node.id in into)
  ) {
    into[node.id] = node.props
  }
  for (const child of (node.children ?? []) as FormNode[]) {
    collectCustomFieldProps(child, into)
  }
}

export const loadCustomFieldPropsByForm = async (
  typeId: ApplicationTypes,
): Promise<CustomFieldPropsByForm> => {
  const template = await getApplicationTemplateByTypeId(typeId)
  const states = Object.entries(template.stateMachineConfig.states ?? {}) as [
    string,
    { meta?: { roles?: RoleInState[] } },
  ][]
  const byForm: CustomFieldPropsByForm = {}

  for (const [stateKey, state] of states) {
    for (const role of state.meta?.roles ?? []) {
      if (!role.formLoader) continue
      try {
        const form = await role.formLoader({
          featureFlagClient: previewFeatureFlagClient,
        })
        const props: CustomFieldProps = {}
        collectCustomFieldProps(form, props)
        byForm[customFieldPropsFormKey(stateKey, role.id)] = props
      } catch {
        continue
      }
    }
  }

  return byForm
}
