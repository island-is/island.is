import { PdfResponse, DirectTaxPaymentResponse } from '../responses'
import { PdfDto, DirectTaxPaymentDto } from '../dto'

export function pdfResponseToDto(response: PdfResponse): PdfDto {
  const result =
    response['s:Envelope']['s:Body'].SaekjaPDFAfritFramtalsEinstaklingsResponse
      .SaekjaPDFAfritFramtalsEinstaklingsResult
  return {
    success: result['b:Tokst'],
    errorText: result['b:Villubod'],
    content: result['b:PDFAfritFramtals'],
  }
}

export function directTaxPaymentResponseToDto(
  response: DirectTaxPaymentResponse,
): DirectTaxPaymentDto {
  const result =
    response['s:Envelope']['s:Body'].SaekjaSundurlidanirResponse
      .SaekjaSundurlidanirResult

  const totalSalary = result['b:_launagr_re']?.['b:ReiknadEndurgjaldDetail']

  const spouseTotalSalary =
    result['b:_launagr_re_Maki']?.['b:ReiknadEndurgjaldDetail']

  const salaryBreakdown =
    result['b:_launasundurlidanir']?.['b:Launasundurlidun']

  const salaryBreakdownToArray =
    Array.isArray(salaryBreakdown) && salaryBreakdown?.length
      ? salaryBreakdown
      : salaryBreakdown && !Array.isArray(salaryBreakdown)
      ? [salaryBreakdown]
      : undefined

  return {
    remark: result['b:_abendingar'],
    payerNationalId: result['b:_kennitalaLaunamanns'],
    paymentCode: result['b:_kodiLaunagreidslna'],
    totalSalary: totalSalary
      ? {
          transactionDate: totalSalary['b:_faersludagsetning'],
          category: totalSalary['b:_flokkur'],
          isat: totalSalary['b:_isat'],
          monthsFromTo: totalSalary['b:_manFraTil'],
          receiptDate: totalSalary['b:_mottokudagsetning'],
          transactionNumber: totalSalary['b:_nrFaerslu'],
          calculatedSalary: totalSalary['b:_reiknadEndurgjald'],
          spouseCalculatedSalary: totalSalary['b:_reiknadEndurgjaldMaka'],
          salaryWithheldAtSource: totalSalary['b:_stadgreidsla'],
          year: totalSalary['b:_tekjuar'],
        }
      : undefined,
    spouseTotalSalary: spouseTotalSalary
      ? {
          transactionDate: spouseTotalSalary['b:_faersludagsetning'],
          category: spouseTotalSalary['b:_flokkur'],
          isat: spouseTotalSalary['b:_isat'],
          monthsFromTo: spouseTotalSalary['b:_manFraTil'],
          receiptDate: spouseTotalSalary['b:_mottokudagsetning'],
          transactionNumber: spouseTotalSalary['b:_nrFaerslu'],
          calculatedSalary: spouseTotalSalary['b:_reiknadEndurgjald'],
          spouseCalculatedSalary: spouseTotalSalary['b:_reiknadEndurgjaldMaka'],
          salaryWithheldAtSource: spouseTotalSalary['b:_stadgreidsla'],
          year: spouseTotalSalary['b:_tekjuar'],
        }
      : undefined,
    salaryBreakdown: salaryBreakdownToArray?.map((salary) => {
      return {
        privatePensionSavings: salary['b:_Tharaf_gr_sereignarsparnadur'],
        year: salary['b:_ar'],
        carBenefits: salary['b:_bifreidahlunnindi'],
        dailyAllowance: salary['b:_dagpeningar'],
        breakdownDate: salary['b:_dagsetningSundurlidunar'],
        transactionDate: salary['b:_faersludagsetning'],
        pensionSavingDeduction: salary['b:_fradr_gr_lifeyrissj'],
        basicSalary: salary['b:_grunnlaun'],
        salaryTotal: salary['b:_heildarlaun'],
        payerNationalId: salary['b:_kennitalaLaunagreidanda'],
        isat: salary['b:_isat'],
        carAllowance: salary['b:_okutaekjastyrkur'],
        personalAllowance: salary['b:_personuafslattur'],
        spousePersonalAllowance: salary['b:_personuafslattur_maka'],
        salaryWithheldAtSource: salary['b:_stadgreidsla'],
        workingPercentage: salary['b:_starfshlutfall'],
        period: salary['b:_timabil'],
      }
    }),
    success: result['b:_saekjaGognTokst'],
    timeStamp: result['b:_timastimpill'],
    errorText: result['b:_villubod'],
  }
}
