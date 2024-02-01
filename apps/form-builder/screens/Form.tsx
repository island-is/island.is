import {
  useState,
  useContext,
  useReducer,
  useRef,
  useEffect,
  ChangeEvent,
  FocusEvent,
} from 'react'
import FormBuilderContext from '../context/FormBuilderContext'
import LayoutContext from '../context/LayoutContext'
import { formReducer } from '../hooks/formReducer'
import { listsReducer } from '../hooks/listsReducer'
import { updateForm, updateItem } from '../services/apiService'
import {
  IFormBuilder,
  IFormBuilderContext,
  IListItem,
  ILists,
  NavbarSelectStatus,
} from '../types/interfaces'
import { defaultStep } from '../utils/defaultStep'
import { baseSettingsStep } from '../utils/getBaseSettingsStep'
import {
  GridRow as Row,
  GridColumn as Column,
  Box,
} from '@island.is/island-ui/core'
import Navbar from '../components/Navbar/Navbar'
import NavbarSelect from '../components/NavbarSelect/NavbarSelect'
import MainContent from '../components/MainContent/MainContent'

type Props = {
  form: IFormBuilder
}

export default function Form({ form }: Props) {
  const [isTyping, setIsTyping] = useState(false)
  const [focus, setOnFocus] = useState(null)
  const [inSettings, setInSettings] = useState(form.form.name.is === '')
  const [selectStatus, setSelectStatus] = useState<NavbarSelectStatus>(
    NavbarSelectStatus.OFF,
  )
  console.log('THE FORM: ', form)
  const [activeListItem, setActiveListItem] = useState<IListItem | null>(null)
  const { infoDispatch } = useContext(LayoutContext)
  const initialNavbar: ILists = {
    activeItem: inSettings
      ? { type: 'Step', data: baseSettingsStep }
      : {
          type: 'Step',
          data:
            form.form.stepsList.find((s) => s.type === 'Innsláttur') ||
            defaultStep,
        },
    steps: form.form.stepsList,
    groups: form.form.groupsList,
    inputs: form.form.inputsList,
  }

  const [formBuilder, formDispatch] = useReducer(formReducer, form)
  const [list, listsDispatch] = useReducer(
    listsReducer,
    initialNavbar,
    undefined,
  )
  const lists = list as ILists
  const { activeItem } = lists

  const isMounted = useRef(false)
  useEffect(() => {
    if (isMounted.current) {
      if (!isTyping) {
        //formUpdate()
      }
    } else {
      isMounted.current = true
      infoDispatch({
        type: 'changeOrganization',
        data: formBuilder?.form?.organization.name.is,
      })
      infoDispatch({
        type: 'changeApplicationName',
        data: formBuilder.form.name.is,
      })
    }
  }, [formBuilder, infoDispatch, isTyping])

  const context: IFormBuilderContext = {
    formBuilder: formBuilder,
    formDispatch: formDispatch,
    lists: lists,
    listsDispatch: listsDispatch,
    formUpdate: formUpdate,
    setIsTyping: setIsTyping,
    inSettings: inSettings,
    setInSettings: setInSettings,
    setSelectStatus: setSelectStatus,
    selectStatus: selectStatus,
    activeListItem: activeListItem,
    setActiveListItem: setActiveListItem,
    changeHandler: changeHandler,
    changeSelectHandler: changeSelectHandler,
    blur: blur,
    onFocus: onFocus,
  }

  if (formBuilder.form && activeItem) {
    return (
      <Row>
        <FormBuilderContext.Provider value={context}>
          <Column span="3/12">
            {selectStatus !== NavbarSelectStatus.OFF ? (
              <NavbarSelect />
            ) : (
              <Navbar />
            )}
          </Column>
          <Column span="9/12">
            <Box
              border="standard"
              borderRadius="standard"
              width="full"
              marginTop={5}
              style={{ minHeight: '500px' }}
            >
              {activeItem?.data && <MainContent />}
            </Box>
          </Column>
        </FormBuilderContext.Provider>
      </Row>
    )
  }
  return <>Loading</>
  async function formUpdate() {
    updateForm(formBuilder.form, lists.steps, lists.groups, lists.inputs)
  }

  function changeHandler(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    propertyName: string,
  ) {
    if (!isTyping) setIsTyping(true)
    if (propertyName === 'name' || propertyName === 'nameEn') {
      const lang = propertyName === 'name' ? 'is' : 'en'
      const index = getIndex()
      listsDispatch({
        type: 'changeName',
        payload: {
          activeType: activeItem.type,
          index: index,
          lang: lang,
          newValue: e.target.value,
        },
      })
    }
  }

  function changeSelectHandler(e) {
    if ('value' in e) {
      const index = getIndex()
      listsDispatch({
        type: 'changeInputType',
        payload: {
          index: index,
          newValue: e.value,
          inputSettings:
            formBuilder?.inputTypes?.find(
              (inputType) => inputType?.type === e.value,
            )?.inputSettings ?? null,
        },
      })
    }
    //updateItem(activeItem.type, activeItem.data)
  }

  function blur(e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    // Check whether value has changed
    if (e.target.value !== focus) {
      //saveItem()
      setOnFocus(null)
      //formUpdate()
      updateItem(activeItem.type, activeItem.data)
    }
    setIsTyping(false)
  }

  function onFocus(value: string) {
    setIsTyping(true)
    setOnFocus(value)
  }

  function getIndex(): number {
    if (activeItem.type === 'Step') {
      const index = lists.steps.findIndex(
        (s) => s.guid === activeItem.data.guid,
      )
      return index ? index : -1
    }
    if (activeItem.type === 'Group') {
      const index = lists.groups.findIndex(
        (g) => g.guid === activeItem.data.guid,
      )
      return index ? index : -1
    }
    if (activeItem.type === 'Input') {
      const index = lists.inputs.findIndex(
        (i) => i.guid === activeItem.data.guid,
      )
      return index ? index : -1
    }
    return -1
  }
}
