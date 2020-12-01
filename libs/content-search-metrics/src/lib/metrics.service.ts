import {
  Injectable
} from '@nestjs/common'
import { ElasticService, RankEvaluationInput } from '@island.is/content-search-toolkit'
import { SearchIndexes } from '@island.is/content-search-indexer/types'
import { RankEvaluationResponse } from '@island.is/shared/types'

const termsTestData = {
  bál: {
    ratings: [
      { _index: 'island-is-v10', _id: '2mCfmijL65wP7qekLZ2RtH', rating: 3 as const } // Leyfi fyrir brennu
    ],
    testCase: 'Matching on single synonym'
  },
  'bál umsókn': {
    ratings: [
      { _index: 'island-is-v10', _id: '2mCfmijL65wP7qekLZ2RtH', rating: 3 as const }, // Leyfi fyrir brennu
    ],
    testCase: 'Matching on synonym with a common word'
  },
  'Stafrænt ökuskírteini': {
    ratings: [
      { _index: 'island-is-v10', _id: 'fZxwXvRXLTUgfeiQmoR3l', rating: 3 as const }, // Stafrænt ökuskírteini
      { _index: 'island-is-v10', _id: '1Trciz91KZW13hKVrHaHsX', rating: 1 as const }, // Algengar spurningar um þjónustu Ísland.is
      { _index: 'island-is-v10', _id: '7nKD0EiCdhC37T7e7VyUwY', rating: 3 as const }, // Ökuskírteini, almenn umsókn
    ],
    testCase: 'Matching on high profile search term'
  },
  fæðingarorlof: {
    ratings: [
      { _index: 'island-is-v10', _id: '3w3dsda6V9iCPhEP40TpuU', rating: 3 as const }, // Réttindi starfsmanns í fæðingarorlofi
      { _index: 'island-is-v10', _id: '59HH2C3hOLYYhFVY4fiX0G', rating: 3 as const }, // Fæðingarorlof fyrir foreldra á innlendum vinnumarkaði
      { _index: 'island-is-v10', _id: '2Q46wjXrMSL1l5FUlGi5QX', rating: 3 as const }, // Forsjárlausir foreldrar, réttindi til fæðingarorlofs
    ],
    testCase: 'Matching on high profile compound search term'
  },
  orlof: {
    ratings: [
      { _index: 'island-is-v10', _id: '4n0yzq68tt1lHlkW33G4Jg', rating: 3 as const }, // Orlofsréttur
      { _index: 'island-is-v10', _id: '5mr5YSYQLVGHzwS0E9q9Ei', rating: 3 as const }, // Vangreitt orlof
      { _index: 'island-is-v10', _id: '3w3dsda6V9iCPhEP40TpuU', rating: 2 as const }, // Réttindi starfsmanns í fæðingarorlofi
      { _index: 'island-is-v10', _id: '5VJRlfLQmGN5D1bog3dFX0', rating: 2 as const }, // Foreldraorlof án rétts til greiðslna
      { _index: 'island-is-v10', _id: '5yh8KJ7BVr2KeliHlfubTY', rating: 2 as const }, // Ráðningarsamningur við erlenda starfsmenn
      { _index: 'island-is-v10', _id: '3nSvy45isDXUPuMbPApoVP', rating: 2 as const }, // Fósturlát og andvana fæðing, réttindi til fæðingarorlofs
      { _index: 'island-is-v10', _id: '3vTJup1Nk3lwB6AtzhX1ps', rating: 1 as const }, // Að stofna fyrirtæki
      { _index: 'island-is-v10', _id: '2OL9R7dQwIfGHGlbprHe9z', rating: 1 as const }, // Veikindaréttur
      { _index: 'island-is-v10', _id: '2m5aJp95ECqRw9WtuvCIyT', rating: 1 as const }, // Kjarasamningar og aðilar vinnumarkaðarins
      { _index: 'island-is-v10', _id: '2F6n9qoAWTG1ekp12VTQOD', rating: 1 as const }, // Að eignast barn
      { _index: 'island-is-v10', _id: 'VM5OiLpdHHInwHoSJLb53', rating: 1 as const }, // Stofnun fyrirtækis – almennar upplýsingar
    ],
    testCase: 'Matching on part of popular compound words'
  },
  skattur: {
    ratings: [
      { _index: 'island-is-v10', _id: '6rtr288qVOjyddl2LVroNi', rating: 3 as const }, // Skattur af vöxtum og arði
      { _index: 'island-is-v10', _id: '6e3SWIyt0ayXwSuqB4HiiE', rating: 3 as const }, // Persónuafsláttur og skattur af launum
      { _index: 'island-is-v10', _id: '3vTJup1Nk3lwB6AtzhX1ps', rating: 2 as const }, // Að stofna fyrirtæki
      { _index: 'island-is-v10', _id: '723lCFxDq2HT0Ev3T6PpC1', rating: 3 as const }, // Beiðni um vottorð frá Skattinum
      { _index: 'island-is-v10', _id: '5xEWjCVcXPyiiB3TnIKNYV', rating: 3 as const }, // Um skatta, afslætti og frádrátt fyrir fatlað fólk
      { _index: 'island-is-v10', _id: '7sXI0Ni8XNCeiSsqHKVEl2', rating: 2 as const }, // Skattalegt heimilisfesti námsmanna erlendis
      { _index: 'island-is-v10', _id: '3vvl6CJg3e1xaWY2PMQITi', rating: 2 as const }, // Lækkun tekjuskattsstofns
    ],
    testCase: 'Matching on high profile search term'
  },
  krókaaflahlutdeild: {
    ratings: [
      { _index: 'island-is-v10', _id: '2h5ORZuiMEVtyD4cZ9y0lm', rating: 3 as const }, // Flutningur krókaaflahlutdeildar
      { _index: 'island-is-v10', _id: '1ylpI2uwQqe9DGOmN9rGrm', rating: 3 as const }, // Skipti krókaaflamarks og aflamarks
      { _index: 'island-is-v10', _id: '4rVlMI2YRoNhrpdXHjHQuR', rating: 2 as const }, // Flutningur aflahlutdeildar
      { _index: 'island-is-v10', _id: '5HSAXc9bvZ5SAQieDaHdDn', rating: 2 as const }, // Flutningur krókaaflamarks
      { _index: 'island-is-v10', _id: '3GvUzzXXN8pH0hemVZeQ9x', rating: 2 as const }, // Umsókn um rafræna afladagbók fyrir skip
      { _index: 'island-is-v10', _id: 'RxshrDyWeuAVSsDZmrnP9', rating: 1 as const }, // Aflamark til frístundaskipa
      { _index: 'island-is-v10', _id: '4dH6N62YJguMRZysu31xqo', rating: 1 as const }, // Flutningur aflamarks
      { _index: 'island-is-v10', _id: '1rGrVudguQJXzMzdbr9b66', rating: 1 as const }, // Afli uppsjávarveiðiskips
      { _index: 'island-is-v10', _id: '6Z3CrVVjcWDPswYM2RkQr9', rating: 1 as const }, // Áætlaður úthafskarfaafli
    ],
    testCase: 'Matching on highly compound words'
  },
  'stofnun fyrirtækis upplýsingar': {
    ratings: [
      { _index: 'island-is-v10', _id: 'VM5OiLpdHHInwHoSJLb53', rating: 3 as const }, // Stofnun fyrirtækis – almennar upplýsingar
      { _index: 'island-is-v10', _id: '3vTJup1Nk3lwB6AtzhX1ps', rating: 3 as const }, // Að stofna fyrirtæki
      { _index: 'island-is-v10', _id: '33ZXB46KnROb8nyYwRvJ3U', rating: 1 as const }, // Stafrænt ísland
    ],
    testCase: 'Matching on many popular terms'
  },
  'svæðisáætlun sveitarfélag': {
    ratings: [
      { _index: 'island-is-v10', _id: '1TtMsHpkgKjTh8lqVKOIu3', rating: 3 as const }, // Svæðisáætlun sveitarfélaga
    ],
    testCase: 'Matching on specific search query with popular word'
  },
  'félag eldri borgara': {
    ratings: [
      { _index: 'island-is-v10', _id: '5IACQSPuDm0tOazEpVRgfY', rating: 3 as const }, // Félagsstarf og þjónustumiðstöðvar fyrir eldri borgara
      { _index: 'island-is-v10', _id: '6uvcCPQ7VIrMPH6qBlTf0r', rating: 1 as const }, // Styrkir, bætur og kjör
      { _index: 'island-is-v10', _id: '5SMAerVNcWJZ5dsVBLKkAL', rating: 1 as const }, // Að fara á eftirlaun
    ],
    testCase: 'Matching on popular words in context'
  }
}

interface GetCMSRankEvaluationInput {
  display: 'raw' | 'minimal'
}

type searchTermsUnion = keyof typeof termsTestData

export interface RankEvaluationFormattedResponse {
  totalScore: number,
  terms: {
    [term in searchTermsUnion]: { score: number, dcg: number, testCase: string }
  }
}

@Injectable()
export class MetricsService {
  constructor(
    private readonly elasticService: ElasticService,
  ) { }

  getTermRatings = (index: SearchIndexes) => {
    return Object.entries(termsTestData)
      .reduce((testTerms: RankEvaluationInput['termRatings'], [searchTerm, rankingData]) => {
        testTerms[searchTerm] = rankingData.ratings
        return testTerms
      }, {})
  }

  formatRankEvaluationResponse(response: RankEvaluationResponse<searchTermsUnion>): RankEvaluationFormattedResponse {
    return {
      totalScore: response.metric_score,
      terms: Object.entries(response.details).reduce((terms, [term, result]) => {
        terms[term as searchTermsUnion] = {
          score: result.metric_score,
          dcg: result.metric_details.dcg.normalized_dcg,
          testCase: termsTestData[term as searchTermsUnion]?.testCase ?? ''
        }
        return terms
      }, {} as RankEvaluationFormattedResponse['terms'])
    }
  }

  async getCMSRankEvaluation({ display }: GetCMSRankEvaluationInput) {
    const index = SearchIndexes['is'] // we only perform test on icelandic for simplicity
    const response = await this.elasticService.getRankEvaluation<searchTermsUnion>(index, { termRatings: this.getTermRatings(index) })
    if (display === 'raw') {
      return response
    } else {
      return this.formatRankEvaluationResponse(response)
    }
  }
}
