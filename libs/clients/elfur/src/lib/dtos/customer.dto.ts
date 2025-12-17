import { CustomerResponseDto } from '../../../gen/fetch'

export interface CustomerDto {
  id: number
  name: string
}

export const mapCustomerDto = (
  customer: CustomerResponseDto,
): CustomerDto | null => {
  if (!customer.id || !customer.name) {
    return null
  }

  return {
    id: customer.id,
    name: customer.name,
  }
}
