import GrindavikHousingBuyoutTemplate from './lib/GrindavikHousingBuyoutTemplate'
import { GrindavikHousingBuyout } from './lib/dataSchema'

export const getDataProviders = () => import('./dataProviders/')
export type GrindavikHousingBuyoutAnswers = GrindavikHousingBuyout

export * from './lib/messages'

export default GrindavikHousingBuyoutTemplate
