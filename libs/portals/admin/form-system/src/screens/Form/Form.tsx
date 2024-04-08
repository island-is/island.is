import { useLoaderData } from "react-router-dom"
import { useEffect, useReducer, useState } from "react"
import { NavbarSelectStatus } from "../../lib/utils/interfaces"
import { FormLoaderResponse } from "./Form.loader"
import { ControlState, controlReducer } from "../../hooks/controlReducer"
import { baseSettingsStep } from "../../utils/getBaseSettingsStep"
import { defaultStep } from "../../utils/defaultStep"
import ControlContext, { IControlContext } from "../../context/ControlContext"
import {
  GridRow as Row,
  GridColumn as Column,
  Box,
} from '@island.is/island-ui/core'
import Navbar from "../../components/Navbar/Navbar"
import { FormSystemForm, FormSystemGroup, FormSystemInput } from "@island.is/api/schema"
import MainContent from "../../components/MainContent/MainContent"
import { useFormSystemUpdateGroupMutation } from "../../gql/Group.generated"
import { useFormSystemUpdateStepMutation } from "../../gql/Step.generated"
import { useFormSystemUpdateInputMutation } from "../../gql/Input.generated"
import { updateActiveItemFn } from "../../lib/utils/updateActiveItem"
import { useFormSystemUpdateFormMutation } from "../../gql/Form.generated"
import { ActiveItem, ItemType } from "../../lib/utils/interfaces"
import { updateDnd } from "../../lib/utils/updateDnd"
import { SettingsState, settingsReducer } from "../../hooks/settingsReducer"
import { partialFormUpdate } from "../../lib/utils/updateForm"



const Form = () => {
  const { formBuilder, client } = useLoaderData() as FormLoaderResponse
  const { form, applicantTypes, documentTypes, inputTypes, listTypes } = formBuilder
  const [focus, setFocus] = useState<string>('')
  const [inSettings, setInSettings] = useState(form?.name?.is === '')
  const [selectStatus, setSelectStatus] = useState<NavbarSelectStatus>(NavbarSelectStatus.OFF)

  const [updateStep] = useFormSystemUpdateStepMutation()
  const [updateGroup] = useFormSystemUpdateGroupMutation()
  const [updateInput] = useFormSystemUpdateInputMutation()
  const [updateForm] = useFormSystemUpdateFormMutation()

  const initialControl: ControlState = {
    activeItem: {
      type: 'Step',
      data: inSettings ? baseSettingsStep : form?.stepsList?.find((s) => s?.type === 'Innsláttur') ?? defaultStep
    },
    form: form as FormSystemForm
  }

  const initialSettings: SettingsState = {
    applicantTypes,
    documentTypes,
    inputTypes,
    listTypes
  }
  const [settings, settingsDispatch] = useReducer(settingsReducer, initialSettings)
  const [control, controlDispatch] = useReducer(controlReducer, initialControl)
  const updateActiveItem = (updatedActiveItem?: ActiveItem) => updateActiveItemFn(control.activeItem, updateStep, updateGroup, updateInput, updatedActiveItem)
  const updateDragAndDrop = (type: ItemType) => updateDnd(type, control, updateForm)
  const formSettingsUpdate = (updatedForm?: FormSystemForm) => {
    if (updatedForm) {
      controlDispatch({ type: 'CHANGE_FORM_SETTINGS', payload: { newForm: updatedForm } })
    }
    return partialFormUpdate(control, updateForm, updatedForm)
  }

  const context: IControlContext = {
    control,
    controlDispatch,
    apolloClient: client,
    applicantTypes,
    documentTypes,
    inputTypes,
    listTypes,
    setInSettings,
    inSettings,
    updateActiveItem,
    focus,
    setFocus,
    updateDnD: updateDragAndDrop,
    formSettingsUpdate,
    selectStatus,
    setSelectStatus
  }


  useEffect(() => {
    console.log('loaderData form: ', form)
    console.log('loaderData client: ', client)
    console.log('control: ', control)
  }, [])

  if (!form) {
    return <div>Loading...</div>
  }
  return (
    <ControlContext.Provider value={context}>
      <Row>
        <Column span="3/12">
          {/* {selectStatus !== NavbarSelectStatus.OFF ? <NavbarSelect /> : <Navbar />} */}
          <Navbar />
        </Column>
        <Column span="9/12">
          <Box
            border="standard"
            borderRadius="standard"
            width="full"
            marginTop={5}
            style={{ minHeight: '500px' }}
          >
            <MainContent />
          </Box>
        </Column>
      </Row>
    </ControlContext.Provider>
  )
}

export default Form


