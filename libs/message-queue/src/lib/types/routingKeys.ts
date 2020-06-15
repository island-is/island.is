export type RoutingKey =
  | GjafakortCompanyApplicationRoutingKey
  | GjafakortUserApplicationRoutingKey

export type GjafakortCompanyApplicationRoutingKey =
  | 'gjafakort:approved'
  | 'gjafakort:pending'
  | 'gjafakort:rejected'
  | 'gjafakort:manual-approved'

export type GjafakortUserApplicationRoutingKey = 'gjafakort-user:approved'
