export type RoutingKey = GjafakortCompanyApplicationRoutingKey

export type GjafakortCompanyApplicationRoutingKey =
  | 'gjafakort:approved'
  | 'gjafakort:pending'
  | 'gjafakort:rejected'
  | 'gjafakort:manual-approved'
