import { useContext } from "react"
import { FormsContext } from "../../context/FormsContext"
import { FormsHeader } from "./components/FormsHeader"
import { Forms } from "../Forms/Forms"
import { Admin } from "../Admin/Admin"
import { Applications } from "../Applications/Applications"


export const FormsLayout = () => {
  const { location } = useContext(FormsContext)
  return (
    <>
      <FormsHeader />
      {
        location === 'forms' ? (<Forms />)
          : location === 'applications' ? (<Applications />)
            : location === 'admin' ? (<Admin />) : null
      }
    </>
  )
}