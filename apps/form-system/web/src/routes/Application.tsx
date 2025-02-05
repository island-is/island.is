import { useParams } from "react-router-dom"
import { useUserInfo } from '@island.is/react-spa/bff'
import { Form } from "../components/Form/Form"
import { ApplicationLoader, ApplicationProvider } from "../context/ApplicationProvider"


type UseParams = {
  slug: string
  id: string
}

export const Application = () => {
  const { slug, id } = useParams() as UseParams
  // const userInfo = useUserInfo()
  // const nationalRegistryId = userInfo?.profile?.nationalId

  if (!id || !slug) {
    return <></>//<ErrorShell errorType="notFound" />
  }

  return (
    <ApplicationLoader id={id} />
  )
}