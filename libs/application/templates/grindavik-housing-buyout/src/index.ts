import GrindavikHousingBuyoutTemplate from './lib/GrindavikHousingBuyoutTemplate'
import { GrindavikHousingBuyout } from './lib/dataSchema'

export const getDataProviders = () => import('./dataProviders/')
export type GrindavikHousingBuyoutAnswers = GrindavikHousingBuyout

export default GrindavikHousingBuyoutTemplate
