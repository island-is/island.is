import {
  useState,
  useContext,
  useReducer,
  useRef,
  useEffect,
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
  const [focus, setOnFocus] = useState<string>('')
  const [inSettings, setInSettings] = useState(form.form.name.is === '')
  const [selectStatus, setSelectStatus] = useState<NavbarSelectStatus>(
    NavbarSelectStatus.OFF,
  )
  const [activeListItem, setActiveListItem] = useState<IListItem | null>(null)
  const { infoDispatch } = useContext(LayoutContext)
  const initialNavbar: ILists = {
    activeItem: inSettings
      ? { type: 'Step', data: baseSettingsStep }
      : {
        type: 'Step',
        data:
          form?.form?.stepsList.find((s) => s.type === 'Innsláttur') ||
          defaultStep,
      },
    steps: form.form.stepsList ?? [],
    groups: form.form.groupsList ?? [],
    inputs: form.form.inputsList ?? [],
  }
  const [formBuilder, formDispatch] = useReducer(formReducer, form)
  const [lists, listsDispatch] = useReducer(listsReducer, initialNavbar)
  const { activeItem } = lists

  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true
    infoDispatch({
      type: 'changeOrganization',
      payload: {
        value: formBuilder?.form?.organization.name.is,
      },
    })
    infoDispatch({
      type: 'changeApplicationName',
      payload: {
        value: formBuilder.form.name.is,
      },
    })
  }, [formBuilder, infoDispatch])

  const context: IFormBuilderContext = {
    formBuilder: formBuilder,
    formDispatch: formDispatch,
    lists: lists,
    listsDispatch: listsDispatch,
    formUpdate: formUpdate,
    inSettings: inSettings,
    setInSettings: setInSettings,
    setSelectStatus: setSelectStatus,
    selectStatus: selectStatus,
    activeListItem: activeListItem,
    setActiveListItem: setActiveListItem,
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

  function blur(e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (e.target.value !== focus) {
      setOnFocus('')
      updateItem(activeItem.type, activeItem.data)
    }
  }

  function onFocus(value: string) {
    setOnFocus(value)
  }
}
