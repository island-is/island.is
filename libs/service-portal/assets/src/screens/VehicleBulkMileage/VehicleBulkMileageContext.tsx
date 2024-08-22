import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react'

export type SubmissionState =
  | 'submitting'
  | 'initial'
  | 'submitting-success'
  | 'submitting-failure'

export type VehicleType = Array<{
  canSubmitMileage: boolean
  permNo: string
  submissionState: SubmissionState
}>

export type VehicleBulkMileageStateProps = {
  page: number
  totalPages: number
  vehicles: VehicleType
  setPage: Dispatch<SetStateAction<number>>
  setTotalPages: Dispatch<SetStateAction<number>>
  setVehicles: Dispatch<SetStateAction<VehicleType>>
}

export const VehicleBulkMileageContext =
  createContext<VehicleBulkMileageStateProps>({
    page: 1,
    totalPages: 0,
    vehicles: [],

    setPage: () => undefined,
    setTotalPages: () => undefined,
    setVehicles: () => undefined,
  })

interface Props {
  children: ReactNode
}

export const VehicleBulkMileageProvider = ({ children }: Props) => {
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [vehicles, setVehicles] = useState<VehicleType>([])

  return (
    <VehicleBulkMileageContext.Provider
      value={{
        page,
        totalPages,
        vehicles,

        setPage,
        setTotalPages,
        setVehicles,
      }}
    >
      {children}
    </VehicleBulkMileageContext.Provider>
  )
}

export const useVehicleBulkMileageContext = () =>
  useContext(VehicleBulkMileageContext)
