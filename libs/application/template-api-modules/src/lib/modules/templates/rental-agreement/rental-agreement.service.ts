import { Injectable } from '@nestjs/common'
import { YesOrNoEnum } from '@island.is/application/core'
import { ApplicationTypes } from '@island.is/application/types'
import { HomeApi } from '@island.is/clients/hms-rental-agreement'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  OtherFeesPayeeOptions,
  RentalAmountPaymentDateOptions,
  RentalHousingCategoryClass,
  RentalPaymentMethodOptions,
  SecurityDepositAmountOptions,
  SecurityDepositTypeOptions,
} from '../../../../../../../application/templates/rental-agreement/src/utils/enums'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { generateRentalAgreementEmail } from './rental-agreement-email'
import { applicationAnswers, formatPhoneNumber } from './utils'

@Injectable()
export class RentalAgreementService extends BaseTemplateApiService {
  constructor(
    private readonly homeApi: HomeApi,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {
    super(ApplicationTypes.RENTAL_AGREEMENT)
  }

  async sendApplicationSummary({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.sendEmail(
      generateRentalAgreementEmail,
      application,
    )
    return
  }

  async submitApplicationToHmsRentalService({
    application,
  }: TemplateApiModuleActionProps) {
    const { id, applicant, answers } = application

    const {
      landlords,
      tenants,
      searchResults,
      units,
      categoryType,
      categoryClass,
      categoryClassGroup,
      description,
      rules,
      conditionDescription,
      inspector,
      inspectorName,
      files,
      fireBlanket,
      smokeDetectors,
      fireExtinguisher,
      emergencyExits,
      startDate,
      endDate,
      rentalAmount,
      isIndexConnected,
      indexType,
      paymentMethod,
      paymentMethodOther,
      paymentDay,
      paymentDayOther,
      bankAccountNumber,
      nationalIdOfAccountOwner,
      securityDepositType,
      securityDepositAmount,
      securityDepositAmountOther,
      otherInfo,
      bankGuaranteeInfo,
      thirdPartyGuaranteeInfo,
      insuranceCompanyInfo,
      landlordsMutualFundInfo,
      housingFundPayee,
      housingFundAmount,
      electricityCostPayee,
      electricityCostMeterNumber,
      electricityCostMeterStatus,
      electricityCostMeterStatusDate,
      heatingCostPayee,
      heatingCostMeterNumber,
      heatingCostMeterStatus,
      heatingCostMeterStatusDate,
      otherCostItems,
    } = applicationAnswers(answers)

    const landlordsArray = landlords?.map((landlord) => {
      return {
        NationalId: landlord.nationalIdWithName.nationalId,
        Name: landlord.nationalIdWithName.name,
        Email: landlord.email,
        Phone: formatPhoneNumber(landlord.phone),
        Address: landlord.address,
        IsRepresentative: Boolean(
          landlord.isRepresentative.includes('isRepresentative'),
        ),
      }
    })

    const tenantsArray = tenants?.map((tenant) => {
      return {
        NationalId: tenant.nationalIdWithName.nationalId,
        Name: tenant.nationalIdWithName.name,
        Email: tenant.email,
        Phone: formatPhoneNumber(tenant.phone),
        Address: tenant.address,
        IsRepresentative: Boolean(
          tenant.isRepresentative.includes('isRepresentative'),
        ),
      }
    })

    const propertyId = units && units.length > 0 ? units[0].propertyCode : ''

    const appraisalUnits = units?.map((unit) => {
      const propertySize =
        unit.changedSize && unit.changedSize >= 3 ? unit.changedSize : unit.size
      const apartmentFloor =
        unit.unitCode && parseInt(unit.unitCode.substring(2, 4), 10).toString()
      const apartmentNumber =
        unit.unitCode && parseInt(unit.unitCode.slice(-2), 10).toString()

      return {
        AppraisalUnitId: unit.unitCode,
        Floor: apartmentFloor,
        ApartmentNumber: apartmentNumber,
        Size: propertySize,
        Rooms: unit.numOfRooms,
      }
    })

    const parseToNumber = (value: string): number => {
      const parsed = parseInt(value, 10)
      return isNaN(parsed) ? 0 : parsed
    }

    const getSecurityDepositTypeDescription = (type: string) => {
      if (
        type === SecurityDepositTypeOptions.CAPITAL ||
        type === SecurityDepositTypeOptions.OTHER ||
        type === ''
      ) {
        return null
      }

      switch (type) {
        case SecurityDepositTypeOptions.BANK_GUARANTEE:
          return bankGuaranteeInfo
        case SecurityDepositTypeOptions.THIRD_PARTY_GUARANTEE:
          return thirdPartyGuaranteeInfo
        case SecurityDepositTypeOptions.INSURANCE_COMPANY:
          return insuranceCompanyInfo
        case SecurityDepositTypeOptions.LANDLORDS_MUTUAL_FUND:
          return landlordsMutualFundInfo
        default:
          return null
      }
    }

    const newApplication = {
      ApplicationId: id,
      InitiatorNationalId: applicant,
      Landlords: landlordsArray,
      Tenants: tenantsArray,
      Property: {
        Address: searchResults?.address || '',
        Municipality: searchResults?.municipalityName || '',
        Zip: searchResults?.postalCode?.toString() || '',
        PropertyId: propertyId?.toString(),
        AppraisalUnits: appraisalUnits || [],
        Part: 'Whole', // Whole | Part // TODO: Should this be added or do we make an assumption. We do not ask about this in the application.
        Type: categoryType || '',
        SpecialGroup:
          categoryClass === RentalHousingCategoryClass.SPECIAL_GROUPS
            ? categoryClassGroup
            : 'No',
      },
      Lease: {
        Description: description,
        Rules: rules,
        Condition: conditionDescription || 'See files for info', // TODO: Check if this is ok?
        InspectorType: inspector,
        IndipendantInspector: inspectorName,
        HasInspectionFiles: files && files.length > 0 ? true : false,
        FireProtections: {
          FireBlanket: parseToNumber(fireBlanket || '0'),
          EmergencyExits: parseToNumber(emergencyExits || '0'),
          SmokeDetectors: parseToNumber(smokeDetectors || '0'),
          FireExtinguisher: parseToNumber(fireExtinguisher || '0'),
        },
        StartDate: startDate,
        EndDate: endDate || null,
        IsFixedTerm: endDate ? true : false,
        Rent: {
          Amount: parseToNumber(rentalAmount || '0'),
          Index: isIndexConnected === YesOrNoEnum.YES ? indexType : 'None',
          IndexRate: null, // TODO: add the index rate when it has been implemented in the application
        },
        Payment: {
          Method: paymentMethod,
          OtherMethod:
            paymentMethod === RentalPaymentMethodOptions.OTHER
              ? paymentMethodOther
              : null,
          PaymentDay: paymentDay,
          OtherPaymentDay:
            paymentDay === RentalAmountPaymentDateOptions.OTHER
              ? paymentDayOther
              : null,
          BankAccountNumber:
            paymentMethod === RentalPaymentMethodOptions.BANK_TRANSFER
              ? bankAccountNumber
              : null,
          NationalIdOfAccountOwner:
            paymentMethod === RentalPaymentMethodOptions.BANK_TRANSFER
              ? nationalIdOfAccountOwner
              : null,
        },
        SecurityDeposit: {
          Type: securityDepositType || 'None',
          OtherType:
            securityDepositType === SecurityDepositTypeOptions.OTHER
              ? otherInfo
              : null,
          Description: securityDepositType
            ? getSecurityDepositTypeDescription(securityDepositType)
            : null,
          Amount: securityDepositAmount,
          OtherAmount:
            securityDepositAmount === SecurityDepositAmountOptions.OTHER
              ? parseToNumber(securityDepositAmountOther || '0')
              : 0,
        },
        OtherFees: {
          HousingFund: {
            PayedBy:
              housingFundPayee === OtherFeesPayeeOptions.TENANT
                ? 'Tenant'
                : 'Landlord',
            Amount: housingFundAmount || 0,
          },
          ElectricityCost: {
            PayedBy:
              electricityCostPayee === OtherFeesPayeeOptions.TENANT
                ? 'Tenant'
                : 'Landlord',
            MeterNumber: electricityCostMeterNumber || null,
            MeterStatus: electricityCostMeterStatus || null,
            MeterStatusDate: electricityCostMeterStatusDate || null,
          },
          HeatingCost: {
            PayedBy:
              heatingCostPayee === OtherFeesPayeeOptions.TENANT
                ? 'Tenant'
                : 'Landlord',
            MeterNumber: heatingCostMeterNumber || null,
            MeterStatus: heatingCostMeterStatus || null,
            MeterStatusDate: heatingCostMeterStatusDate || null,
          },
          MiscellaneousFees: otherCostItems
            ? Object.values(otherCostItems)
                .filter(
                  (item) => item.description && item.description.trim() !== '',
                )
                .map((item) => ({
                  Name: item.description,
                  Amount: Number(item.amount) || 0,
                }))
            : [],
        },
      },
    }

    return await this.homeApi.contractPost({
      leaseApplication: newApplication,
    })

    console.log(
      '-------------------- Answers sent to RentalService --------------------: ',
      newApplication,
    )
  }
}
