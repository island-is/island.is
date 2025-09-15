export const environment = {
  chargeFjs: {
    systemId: 'ISL',
    returnUrl: process.env.INVOICE_RETURN_URL,
  },
  port: process.env.PORT ? Number(process.env.PORT) : 5555,
}

export type Environment = typeof environment
