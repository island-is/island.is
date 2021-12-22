import { useContext } from "react"
import { UserContext } from "@island.is/air-discount-scheme-web/context"

export const useAuth = () => useContext(UserContext)