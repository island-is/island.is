import { useParams } from "react-router-dom"
import { ApplicationLoader } from "../context/ApplicationProvider"

type UseParams = {
  slug: string
  id: string
}

export const Application = () => {
  const { slug, id } = useParams() as UseParams

  if (!id || !slug) {
    return <>Error</>
  }

  return (
    <ApplicationLoader id={id} />
  )
}