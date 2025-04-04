import {
  DocumentComment,
  DocumentsV2Category,
  DocumentsV2Sender,
  DocumentTicket,
} from '@island.is/api/schema'
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

export interface Comment extends DocumentComment {
  hide: boolean
}

export interface Reply extends DocumentTicket {
  comments?: Comment[]
}

export type DocumentsStateProps = {
  selectedLines: SelectedLineType
  activeDocument: ActiveDocumentStateType
  hideDocument: boolean
  filterValue: FilterValuesType
  page: number
  totalPages: number
  sendersAvailable: DocumentsV2Sender[]
  categoriesAvailable: DocumentsV2Category[]
  docLoading: boolean
  documentDisplayError?: string
  localRead: string[]
  replyable: boolean
  replies?: Reply
  replyOpen: boolean

  setSelectedLines: Dispatch<SetStateAction<SelectedLineType>>
  setActiveDocument: Dispatch<SetStateAction<ActiveDocumentStateType>>
  setHideDocument: Dispatch<SetStateAction<boolean>>
  setFilterValue: Dispatch<SetStateAction<FilterValuesType>>
  setPage: Dispatch<SetStateAction<number>>
  setTotalPages: Dispatch<SetStateAction<number>>
  setSendersAvailable: Dispatch<SetStateAction<DocumentsV2Sender[]>>
  setCategoriesAvailable: Dispatch<SetStateAction<DocumentsV2Category[]>>
  setDocLoading: Dispatch<SetStateAction<boolean>>
  setDocumentDisplayError: Dispatch<SetStateAction<string | undefined>>
  setLocalRead: Dispatch<SetStateAction<string[]>>
  setReplyable: Dispatch<SetStateAction<boolean>>
  setReplies: Dispatch<SetStateAction<Reply | undefined>>
  setReplyOpen: Dispatch<SetStateAction<boolean>>
}

export const DocumentsContext = createContext<DocumentsStateProps>({
  selectedLines: [],
  activeDocument: null,
  hideDocument: false,
  filterValue: defaultFilterValues,
  page: 1,
  totalPages: 0,
  categoriesAvailable: [],
  sendersAvailable: [],
  docLoading: false,
  documentDisplayError: undefined,
  localRead: [],
  replyable: false,
  replies: undefined,
  replyOpen: false,

  setSelectedLines: () => undefined,
  setActiveDocument: () => undefined,
  setHideDocument: () => undefined,
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
  setReplyOpen: () => undefined,
})

export const DocumentsProvider: FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const loaderNumber = useLoaderData() as number
  const [selectedLines, setSelectedLines] = useState<SelectedLineType>([])
  const [activeDocument, setActiveDocument] =
    useState<ActiveDocumentStateType>(null)
  const [hideDocument, setHideDocument] = useState<boolean>(false)
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
  const [replyable, setReplyable] = useState<boolean>(true) // TODO: Set to default false
  const [replyOpen, setReplyOpen] = useState<boolean>(false)
  const [replies, setReplies] = useState<Reply>()

  return (
    <DocumentsContext.Provider
      value={{
        selectedLines,
        activeDocument,
        hideDocument,
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
        replyOpen,

        setSelectedLines,
        setActiveDocument,
        setHideDocument,
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
        setReplyOpen,
      }}
    >
      {children}
    </DocumentsContext.Provider>
  )
}

export const useDocumentContext = () => useContext(DocumentsContext)
