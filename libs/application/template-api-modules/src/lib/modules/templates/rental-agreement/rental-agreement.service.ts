import { Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  OtherFeesPayeeOptions,
  RentalAmountPaymentDateOptions,
  RentalPaymentMethodOptions,
  SecurityDepositAmountOptions,
  SecurityDepositTypeOptions,
} from '../../../../../../../application/templates/rental-agreement/src/utils/enums'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { generateRentalAgreementEmail } from './rental-agreement-email'
import { applicationAnswers } from './utils'

@Injectable()
export class RentalAgreementService extends BaseTemplateApiService {
  constructor(
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
      categoryType,
      categoryClass,
      units,
      description,
      rules,
      conditionDescription,
      inspector,
      inspectorName,
      files,
      fireBlankets,
      smokeDetectors,
      fireExtinguisher,
      emergencyExits,
      startDate,
      endDate,
      rentalAmount,
      isIndexConnected,
      indexType,
      indexRate,
      paymentMethod,
      paymentMethodOther,
      paymentDay,
      paymentDayOther,
      bankAccountNumber,
      nationalIdOfAccountOwner,
      securityDepositType,
      bankGuaranteeInfo,
      thirdPartyGuaranteeInfo,
      insuranceCompanyInfo,
      landlordsMutualFundInfo,
      otherInfo,
      securityDepositAmount,
      securityDepositAmountOther,
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

    const formattedLandlords = landlords?.map((landlord) => {
      const isRep = landlord.isRepresentative.includes('isRepresentative')
        ? true
        : false
      return {
        NationalId: landlord.nationalIdWithName.nationalId,
        Name: landlord.nationalIdWithName.name,
        Email: landlord.email,
        Phone: landlord.phone,
        Address: landlord.address,
        IsRepresentative: isRep,
      }
    })

    const formattedTenants = tenants?.map((tenant) => {
      const isRep = tenant.isRepresentative.includes('isRepresentative')
        ? true
        : false
      return {
        NationalId: tenant.nationalIdWithName.nationalId,
        Name: tenant.nationalIdWithName.name,
        Email: tenant.email,
        Phone: tenant.phone,
        Address: tenant.address,
        IsRepresentative: isRep,
      }
    })

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
        Size: propertySize,
        ApartmentNumber: apartmentNumber,
        Rooms: unit.numOfRooms,
      }
    })

    const otherFeesOtherCostItems = otherCostItems?.map((item) => {
      return {
        Name: item.description,
        Amount: item.amount,
      }
    })

    const getSecurityDepositTypeDescription = (type: string) => {
      if (type === 'Capital' || type === 'None' || type === '') {
        return ''
      }

      switch (type) {
        case 'BankGuarantee':
          return bankGuaranteeInfo
        case 'ThirdPartyGuarantee':
          return thirdPartyGuaranteeInfo
        case 'InsuranceCompany':
          return insuranceCompanyInfo
        case 'LandlordMutualFund':
          return landlordsMutualFundInfo
        case 'Other':
          return otherInfo
        default:
          return ''
      }
    }

    const propertyId = units && units.length > 0 ? units[0].propertyCode : ''

    // TODO: Check if mapping is correct, are types corresponding to the API?
    const applicationToRentalRegistry = {
      ApplicationId: id,
      InitiatorNationalId: applicant,
      Landlords: formattedLandlords,
      Tenants: formattedTenants,
      Property: {
        Address: searchResults?.address || '',
        Municipality: searchResults?.municipalityName || '',
        Zip: searchResults?.postalCode?.toString() || '',
        PropertyId: propertyId,
        AppraisalUnits: appraisalUnits || [],
        Part: '', // Whole | Part // TODO: We do not check for this in the application.
        Type: categoryType || '', // House_Apartment | Room | Commercial
        SpecialGroup: categoryClass || 'No', // No | Student | Elderly | Disabled | HalfwayHouse | IncomeRestricted
      },
      Lease: {
        Description: description,
        Rules: rules,
        Condition: conditionDescription, // TODO: Check if this is correct?
        InspectorType: inspector,
        IndipendantInspector: inspectorName,
        HasInspectionFiles: files && files.length > 0 ? true : false,
        FireProtections: {
          FireBlanket: fireBlankets || 0,
          EmergencyExits: emergencyExits || 0,
          SmokeDetectors: smokeDetectors || 0,
          FireExtinguisher: fireExtinguisher || 0,
        },
        StartDate: startDate || '', // yyyy-MM-dd
        EndDate: endDate || '', // yyyy-MM-dd
        IsFixedTerm: endDate ? true : false,
        Rent: {
          Amount: rentalAmount || 0,
          Index: isIndexConnected ? indexType : 'None', // None | ConsumerPriceIndex
          IndexRate: indexRate || 0,
        },
        Payment: {
          Method: paymentMethod, // BankTransfer | PaymentSlip | Other
          OtherMethod:
            paymentMethod === RentalPaymentMethodOptions.OTHER
              ? paymentMethodOther
              : '',
          PaymentDay: paymentDay, // First | Last | Other
          OtherPaymentDay:
            paymentDay === RentalAmountPaymentDateOptions.OTHER
              ? paymentDayOther
              : '',
          BankAccountNumber:
            paymentMethod === RentalPaymentMethodOptions.BANK_TRANSFER
              ? bankAccountNumber
              : '',
          NationalIdOfAccountOwner:
            paymentMethod === RentalPaymentMethodOptions.BANK_TRANSFER
              ? nationalIdOfAccountOwner
              : '',
        },
        SecurityDeposit: {
          Type: securityDepositType || 'None', // None | BankGuarantee | Capital | ThirdPartyGuarantee | InsuranceCompany | LandlordMutualFund | Other
          OtherType:
            securityDepositType === SecurityDepositTypeOptions.OTHER
              ? otherInfo
              : '',
          Description: getSecurityDepositTypeDescription(
            securityDepositType || '',
          ),
          Amount: securityDepositAmount, // OneMonth | TwoMonths | ThreeMonths | Other
          OtherAmount:
            securityDepositAmount === SecurityDepositAmountOptions.OTHER
              ? securityDepositAmountOther
              : '',
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
            MeterNumber: electricityCostMeterNumber || '',
            MeterStatus: electricityCostMeterStatus || '',
            MeterStatusDate: electricityCostMeterStatusDate || '', // yyyy-MM-dd
          },
          HeatingCost: {
            PayedBy:
              heatingCostPayee === OtherFeesPayeeOptions.TENANT
                ? 'Tenant'
                : 'Landlord',
            MeterNumber: heatingCostMeterNumber || '',
            MeterStatus: heatingCostMeterStatus || '',
            MeterStatusDate: heatingCostMeterStatusDate || '', // yyyy-MM-dd
          },
          MiscellaneousFees: otherFeesOtherCostItems,
        },
      },
    }

    console.log(
      '-------------------- Answers to send to RentalService: ',
      applicationToRentalRegistry,
    )
  }
}
