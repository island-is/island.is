import { DocumentsV2Category, DocumentsV2Sender } from '@island.is/api/schema'
import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState,
} from 'react'
import { useLoaderData } from 'react-router-dom'
import { ActiveDocumentType2 } from '../../lib/types'
import { defaultFilterValues, FilterValuesType } from '../../utils/types'

type SelectedLineType = Array<string>
type ActiveDocumentStateType = ActiveDocumentType2 | null

export type DocumentsStateProps = {
  selectedLines: SelectedLineType
  activeDocument: ActiveDocumentStateType
  filterValue: FilterValuesType
  page: number
  totalPages: number
  sendersAvailable: DocumentsV2Sender[]
  categoriesAvailable: DocumentsV2Category[]
  docLoading: boolean
  documentDisplayError?: string
  localRead: string[]
  replyable: boolean
  replies: {
    id: string
    date: Date
    email: string
    reply: string
    intro?: string
  }[]

  setSelectedLines: Dispatch<SetStateAction<SelectedLineType>>
  setActiveDocument: Dispatch<SetStateAction<ActiveDocumentStateType>>
  setFilterValue: Dispatch<SetStateAction<FilterValuesType>>
  setPage: Dispatch<SetStateAction<number>>
  setTotalPages: Dispatch<SetStateAction<number>>
  setSendersAvailable: Dispatch<SetStateAction<DocumentsV2Sender[]>>
  setCategoriesAvailable: Dispatch<SetStateAction<DocumentsV2Category[]>>
  setDocLoading: Dispatch<SetStateAction<boolean>>
  setDocumentDisplayError: Dispatch<SetStateAction<string | undefined>>
  setLocalRead: Dispatch<SetStateAction<string[]>>
  setReplyable: Dispatch<SetStateAction<boolean>>
  setReplies: Dispatch<
    SetStateAction<
      { id: string; date: Date; email: string; reply: string; intro?: string }[]
    >
  >
}

export const DocumentsContext = createContext<DocumentsStateProps>({
  selectedLines: [],
  activeDocument: null,
  filterValue: defaultFilterValues,
  page: 1,
  totalPages: 0,
  categoriesAvailable: [],
  sendersAvailable: [],
  docLoading: false,
  documentDisplayError: undefined,
  localRead: [],
  replyable: false,
  replies: [],

  setSelectedLines: () => undefined,
  setActiveDocument: () => undefined,
  setFilterValue: () => undefined,
  setPage: () => undefined,
  setTotalPages: () => undefined,
  setSendersAvailable: () => undefined,
  setCategoriesAvailable: () => undefined,
  setDocLoading: () => undefined,
  setDocumentDisplayError: () => undefined,
  setLocalRead: () => undefined,
  setReplyable: () => undefined,
  setReplies: () => undefined,
})

export const DocumentsProvider: FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const loaderNumber = useLoaderData() as number
  const [selectedLines, setSelectedLines] = useState<SelectedLineType>([])
  const [activeDocument, setActiveDocument] =
    useState<ActiveDocumentStateType>(null)
  const [filterValue, setFilterValue] =
    useState<FilterValuesType>(defaultFilterValues)
  const [page, setPage] = useState(loaderNumber)
  const [categoriesAvailable, setCategoriesAvailable] = useState<
    DocumentsV2Category[]
  >([])
  const [sendersAvailable, setSendersAvailable] = useState<DocumentsV2Sender[]>(
    [],
  )
  const [totalPages, setTotalPages] = useState(0)
  const [docLoading, setDocLoading] = useState(false)
  const [documentDisplayError, setDocumentDisplayError] = useState<string>()
  const [localRead, setLocalRead] = useState<string[]>([])
  const [replyable, setReplyable] = useState<boolean>(true) // TODO: Set to false
  const [replies, setReplies] = useState<
    { id: string; date: Date; email: string; reply: string; intro?: string }[]
  >([
    {
      id: '123',
      date: new Date(),
      email: 'lisa@skb.is',
      reply:
        'Þetta er svar 1 við þræðinum. Ég bara skrifa og skrifa og tala, síðan aðeins meira. ',
      intro:
        'Skilaboðin eru móttekin og mál hefur verið stofnað. Þú getur haldið áfram samskiptunum hér eða í gegnum þitt persónulega netfang.',
    },
    {
      id: '124',
      date: new Date(),
      email: 'lisa@skb.is',
      reply:
        'Þetta er svar 2 við þræðinum. Ég bara skrifa og skrifa og tala, síðan aðeins meira.  Ég bara skrifa og skrifa og tala, síðan aðeins meira. ',
    },
  ])

  return (
    <DocumentsContext.Provider
      value={{
        selectedLines,
        activeDocument,
        filterValue,
        page,
        totalPages,
        categoriesAvailable,
        sendersAvailable,
        docLoading,
        documentDisplayError,
        localRead,
        replyable,
        replies,

        setSelectedLines,
        setActiveDocument,
        setFilterValue,
        setPage,
        setTotalPages,
        setCategoriesAvailable,
        setSendersAvailable,
        setDocLoading,
        setDocumentDisplayError,
        setLocalRead,
        setReplyable,
        setReplies,
      }}
    >
      {children}
    </DocumentsContext.Provider>
  )
}

export const useDocumentContext = () => useContext(DocumentsContext)
