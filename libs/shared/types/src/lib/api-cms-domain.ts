export type SystemMetadata<DataType> = DataType & {
  typename: string
}

export enum CustomPageUniqueIdentifier {
  PensionCalculator = 'PensionCalculator',
  OfficialJournalOfIceland = 'OfficialJournalOfIceland',
  Vacancies = 'Vacancies',
}

export interface StatisticSourceValue {
  header: string
  value: number | null
}

export type StatisticSourceData<T extends string = string> = {
  data: Record<T, StatisticSourceValue[]>
}
