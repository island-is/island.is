import { useParams } from "react-router-dom"

type UseParams = {
  slug: string
  id: string
}
export const Application = () => {
  const { slug, id } = useParams() as UseParams
  return (
    <>Application</>
  )
}