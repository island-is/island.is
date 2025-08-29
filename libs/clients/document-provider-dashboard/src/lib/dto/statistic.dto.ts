export interface StatisticDto {
  /**
   *
   * @type {number}
   * @memberof Statistics
   */
  published?: number
  /**
   *
   * @type {number}
   * @memberof Statistics
   */
  notifications?: number
  /**
   *
   * @type {number}
   * @memberof Statistics
   */
  opened?: number
  /**
   *
   * @type {number}
   * @memberof Statistics
   */
  failures?: number
}

export const mapToStatistic = (
  statistic: StatisticDto,
): StatisticDto | null => {
  if (
    !statistic.failures ||
    !statistic.notifications ||
    !statistic.opened ||
    !statistic.published
  ) {
    return null
  }

  return {
    failures: statistic.failures,
    notifications: statistic.notifications,
    opened: statistic.opened,
    published: statistic.published,
  }
}
