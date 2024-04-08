import { useContext } from "react"
import ControlContext from "../../../../context/ControlContext"
import { Stack } from "@island.is/island-ui/core"
import BaseInput from "./components/BaseInput"
import Preview from "../Preview/Preveiw"
import { FormSystemInput } from "@island.is/api/schema"



const InputContent = () => {
  const { control, selectStatus, setSelectStatus } = useContext(ControlContext)
  const currentItem = control.activeItem.data as FormSystemInput
  return (
    <Stack space={2}>
      <BaseInput />

      <Preview data={currentItem} />
    </Stack>
  )
}

export default InputContent
