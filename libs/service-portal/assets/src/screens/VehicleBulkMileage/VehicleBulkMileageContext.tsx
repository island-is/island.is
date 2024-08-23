import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react'
import { VehicleType } from './types'

export type VehicleBulkMileageStateProps = {
  page: number
  totalPages: number
  vehicles: Array<VehicleType>
  setPage: Dispatch<SetStateAction<number>>
  setTotalPages: Dispatch<SetStateAction<number>>
  setVehicles: Dispatch<SetStateAction<Array<VehicleType>>>
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
  const [vehicles, setVehicles] = useState<Array<VehicleType>>([])

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
