import { MaritimeBookDto } from '../../../gen/fetch'
import { parseDate } from '../utils'

export interface SailorMaritimeBookDto {
  id: string
  type?: string
  dateFrom?: Date
  dateTo?: Date
}

export const mapMaritimeBook = (
  dto: MaritimeBookDto,
  index: number,
): SailorMaritimeBookDto => ({
  id: dto.maritimeBookSerial || String(index),
  type: dto.maritimeBookType || undefined,
  dateFrom: dto.dateFrom ? parseDate(dto.dateFrom) ?? undefined : undefined,
  dateTo: dto.dateTo ? parseDate(dto.dateTo) ?? undefined : undefined,
})
