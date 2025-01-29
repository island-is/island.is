import { useNavigate, useParams } from "react-router-dom"
import { useLocale, useLocalizedQuery } from '@island.is/localization'

interface Params {
  slug: string
  id: string
}

export const Applications = () => {
  const { slug, id } = useParams() as unknown as Params
  const navigate = useNavigate()
  const { formatMessage } = useLocale()
  return (
    <>Applications</>
  )
}