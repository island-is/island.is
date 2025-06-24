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
import { ActiveDocumentType2, ReplyState } from '../../lib/types'
import { defaultFilterValues, FilterValuesType } from '../../utils/types'

type SelectedLineType = Array<string>
type ActiveDocumentStateType = ActiveDocumentType2 | null

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
  replyState?: ReplyState

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
  setReplyState: Dispatch<SetStateAction<ReplyState | undefined>>
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
  replyState: undefined,

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
  setReplyState: () => undefined,
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

  const [replyState, setReplyState] = useState<ReplyState | undefined>(
    undefined,
  )

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
        replyState,

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
        setReplyState,
      }}
    >
      {children}
    </DocumentsContext.Provider>
  )
}

export const useDocumentContext = () => useContext(DocumentsContext)
