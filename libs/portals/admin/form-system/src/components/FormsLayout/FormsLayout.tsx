import { useContext } from "react"
import { FormsContext } from "../../context/FormsContext"
import { FormsHeader } from "./components/FormsHeader"
import { Applications } from "../../screens/Applications/Applications"
import { Forms } from "../Forms/Forms"
import { Admin } from "../Admin/Admin"


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