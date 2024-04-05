/* eslint-disable */
//-------------------------------------------------------------
//-----------------Do not edit the XML tags--------------------
//-------------------------------------------------------------

//<Document-Level>
//<ACRO_source>calc_shares</ACRO_source>
//<ACRO_script>
/*********** belongs to: Document-Level:calc_shares ***********/
function calc_shares(postfix) {
  this.getField('5.6_field_' + postfix).value =
    this.getField('5.6_value_' + postfix).value *
    this.getField('5.6_rate_' + postfix).value
}
//</ACRO_script>
//</Document-Level>

//<Document-Level>
//<ACRO_source>calc_tax</ACRO_source>
//<ACRO_script>
/*********** belongs to: Document-Level:calc_tax ***********/
function calc_tax(page) {
  var p = page
  if (p == '_p1') {
    p = ''
  }

  var f =
    Math.round(this.getField('9_tax' + p + '_1').value) +
    Math.round(this.getField('9_tax' + p + '_2').value) +
    Math.round(this.getField('9_tax' + p + '_3').value) +
    Math.round(this.getField('9_tax' + p + '_4').value) +
    Math.round(this.getField('9_tax' + p + '_5').value) +
    Math.round(this.getField('9_tax' + p + '_6').value) +
    Math.round(this.getField('9_tax' + p + '_7').value) +
    Math.round(this.getField('9_tax' + p + '_8').value) +
    Math.round(this.getField('9_tax' + p + '_9').value) +
    Math.round(this.getField('9_tax' + p + '_10').value)

  if (page == '_p1') {
    f = f + this.getField('9_total_tax_p2').value
    this.getField('9_sum_tax').value = f
  } else {
    this.getField('9_sum_tax_p2').value = f
  }
}
//</ACRO_script>
//</Document-Level>

//<Document-Level>
//<ACRO_source>calc_total_perc</ACRO_source>
//<ACRO_script>
/*********** belongs to: Document-Level:calc_total_perc ***********/
function calc_total_perc(page, postfix) {
  var total = 0
  var val
  for (var p = 2; p > 0; --p) {
    for (var i = 1; i < 11; ++i) {
      val = this.getField('9_percentage_p' + p + '_' + i).valueAsString
      val = val.replace(/,/, '.')
      total += val * 1
    }
    if (p == 2) this.getField('9_sum_perc_p2').value = total
  }

  this.getField('9_sum_perc').value = total
  this.getField('9_limit').hidden = total == 100
}
//</ACRO_script>
//</Document-Level>

//<Document-Level>
//<ACRO_source>calc_total_tax</ACRO_source>
//<ACRO_script>
/*********** belongs to: Document-Level:calc_total_tax ***********/
function calc_total_tax(col) {
  var total = 0
  var val
  for (var p = 2; p > 0; --p) {
    for (var i = 1; i < 11; ++i) {
      val = this.getField('9_' + col + '_p' + p + '_' + i).valueAsString
      val = val.replace(/,/, '.')
      total += val * 1
    }
    if (p == 2) this.getField('9_sum_' + col + '_p2').value = total
  }
  this.getField('9_sum_' + col).value = total
}
//</ACRO_script>
//</Document-Level>

//<Document-Level>
//<ACRO_source>checkkennitala</ACRO_source>
//<ACRO_script>
/*********** belongs to: Document-Level:checkkennitala ***********/
function checkkennitala(V) {
  var iHvadaStafur = 2

  if (V.valueAsString != '') {
    if (V.valueAsString.length < 10) {
      // app.alert(
      //   'Ábending. Kennitalan er ekki gild eða ekki rétt skrifuð.\nAthugið að kennitölur þarf að skrifa án bandstriks.',
      // )
      V.valueAsString = ''
      V.setFocus()
      return false
    } else {
      if (
        V.valueAsString.indexOf('-') > 0 ||
        (V.valueAsString.substring(9, 10) != '8' &&
          V.valueAsString.substring(9, 10) != '9' &&
          V.valueAsString.substring(9, 10) != '0')
      ) {
        // app.alert(
        //   'Ábending. Kennitalan er ekki gild eða ekki rétt skrifuð.\nAthugið að kennitölur þarf að skrifa án bandstriks.',
        // )
        V.valueAsString = ''
        V.setFocus()
        return false
      } else {
        //if( parseInt(V.valueAsString.substring(0,2)) >= 40 ) {
        //    app.alert( "Ekki má slá inn kennitölu lögaðila." );
        //    V.valueAsString= "";
        //    V.setFocus( );
        //    return false;
        //}
        let iSumma = parseInt(V.valueAsString.substring(0, 1)) * 3
        iSumma = iSumma + parseInt(V.valueAsString.substring(1, 2)) * 2

        for (var i = 7; i > 0; i--) {
          iSumma =
            iSumma +
            parseInt(
              V.valueAsString.substring(
                iHvadaStafur,
                parseInt(iHvadaStafur) + 1,
              ),
            ) *
              i
          iHvadaStafur++
        }
        let dSumma = iSumma / 11
        iSumma = iSumma / 11
        iSumma = parseInt(iSumma)

        // [BÞG 31.10.2005] Kt sem byrja á 98 eru testkennitölur í raun fyrir lögaðila
        if (
          iSumma != dSumma &&
          V.valueAsString.substring(0, 1) != '8' &&
          V.valueAsString.substring(0, 2) != '98'
        ) {
          // app.alert(
          //   'Ábending. Kennitalan er ekki gild eða ekki rétt skrifuð.\nAthugið að kennitölur þarf að skrifa án bandstriks.',
          // )
          V.valueAsString = ''
          V.setFocus()
          return false
        } else {
          return true
        }
      }
    }
  }
}
//</ACRO_script>
//</Document-Level>

//<Document-Level>
//<ACRO_source>nettax</ACRO_source>
//<ACRO_script>
/*********** belongs to: Document-Level:nettax ***********/
function nettax(page, postfix) {
  this.getField('9_taxable_p' + page + '_' + postfix).value =
    this.getField('9_amount_p' + page + '_' + postfix).value -
    this.getField('9_taxfree_p' + page + '_' + postfix).value
}
//</ACRO_script>
//</Document-Level>

//<Document-Level>
//<ACRO_source>on_type_click</ACRO_source>
//<ACRO_script>
/*********** belongs to: Document-Level:on_type_click ***********/
function on_type_click() {
  var disabled = this.getField('type').value == 'prepaid'
  this.getField('1_date_1').hidden = disabled
  this.getField('1_date_2').hidden = disabled
}

//</ACRO_script>
//</Document-Level>

//<Document-Level>
//<ACRO_source>subsum</ACRO_source>
//<ACRO_script>
/*********** belongs to: Document-Level:subsum ***********/
function subsum(max, cat) {
  var total = 0
  for (var i = 1; i <= max; i++) {
    total += Number(this.getField(cat + '_field_' + i).value)
  }
  this.getField(cat + '_sum').value = total
}
//</ACRO_script>
//</Document-Level>

//<Document-Level>
//<ACRO_source>sum</ACRO_source>
//<ACRO_script>
/*********** belongs to: Document-Level:sum ***********/
function sum(max, cat, subcat) {
  if (cat == 5) {
    if (max != 0) subsum(max, cat + '.' + subcat)
    sumcat(8, cat)
  } else if (cat == 6) {
    if (max != 0) subsum(max, cat + '.' + subcat)
    sumcat(3, cat)
  } else if (cat == 7) {
    if (max != 0) subsum(max, cat + '.' + subcat)
    this.getField('7_sum').value =
      this.getField('7.1_sum').value - this.getField('7.2_sum').value
  }

  this.getField('8.1_net').value =
    this.getField('5_sum').value -
    this.getField('6_sum').value +
    this.getField('7_sum').value
  this.getField('8_sum').value =
    this.getField('8.1_net').value - this.getField('8.2_sub').value
}
//</ACRO_script>
//</Document-Level>

//<Document-Level>
//<ACRO_source>sumcat</ACRO_source>
//<ACRO_script>
/*********** belongs to: Document-Level:sumcat ***********/
function sumcat(max, cat) {
  var total = 0
  for (var i = 1; i <= max; i++) {
    total += Number(this.getField(cat + '.' + i + '_sum').value)
  }
  this.getField(cat + '_sum').value = total
}
//</ACRO_script>
//</Document-Level>

//<Document-Level>
//<ACRO_source>tax</ACRO_source>
//<ACRO_script>
/*********** belongs to: Document-Level:tax ***********/
function tax(page, postfix) {
  var val1 = this.getField(
    '9_percentage_p' + page + '_' + postfix,
  ).valueAsString
  val1 = val1.replace(/,/, '.')
  this.getField('9_amount_p' + page + '_' + postfix).value =
    (1 * val1 * (1 * this.getField('8_sum').value)) / 100

  var amount = (1 * val1 * (1 * this.getField('8_sum').value)) / 100
  var perc = this.getField(
    '9_percentage_p' + page + '_' + postfix,
  ).valueAsString
  perc = perc.replace(/,/, '.')
  var sum = this.getField('8_sum').value

  this.getField('d_date_dis_error').value = ''

  let dis = 0
  if (this.getField('type').value == 'prepaid') {
    dis = 0

    this.getField('year_sel').value = '0'
    this.getField('dis_amount').value = '0'
  } else {
    dis = 0
    var dis_year = 0

    var d_date_1 = this.getField('1_date_1').value
    var d_date_2 = this.getField('1_date_2').value

    if (d_date_1 != '') {
      dis_year = d_date_1.substr(-4)
    }

    if (d_date_2 != '') {
      if (d_date_2.substr(-4) > d_date_1.substr(-4)) {
        dis_year = d_date_2.substr(-4)
      }
    }

    if (dis_year == '2024') {
      dis = 6203409
    } else if (dis_year == '2023') {
      dis = 5757759
    } else if (dis_year == '2022') {
      dis = 5255000
    } else if (dis_year == '2021') {
      dis = 5000000
    } else if (dis_year >= 2011 && dis_year <= '2020') {
      dis = 1500000
    } else if ((dis_year > '1' && dis_year < '2011') || dis_year > '2022') {
      this.getField('d_date_dis_error').value = 'Villa: Óskattskyldur arfur.'
    }

    this.getField('year_sel').value = dis_year
    this.getField('dis_amount').value = dis
  }

  if (sum < dis) {
    dis = sum
  }

  if (
    this.getField('9_relations_p' + page + '_' + postfix).value == 'spouse' &&
    this.getField('type').value != 'prepaid'
  ) {
    let val = 0
    this.getField('9_taxfree_p' + page + '_' + postfix).value = amount
  } else {
    this.getField('9_taxfree_p' + page + '_' + postfix).value =
      dis * (perc / 100)
  }

  nettax(page, postfix)
  let val =
    (this.getField('9_taxable_p' + page + '_' + postfix).value * 10) / 100

  if (val < 0) val = 0

  this.getField('9_tax_p' + page + '_' + postfix).value = val

  calc_total_perc(page, postfix)
  calc_total_tax('amount')
  calc_total_tax('taxfree')
  calc_total_tax('taxable')
  calc_total_tax('tax')

  validate_taxfree(page, postfix)
}
//</ACRO_script>
//</Document-Level>

//<Document-Level>
//<ACRO_source>validate_taxfree</ACRO_source>
//<ACRO_script>
/*********** belongs to: Document-Level:validate_taxfree ***********/
function validate_taxfree(page, postfix) {
  var a = this.getField('9_amount_p' + page + '_' + postfix).value
  var b = this.getField('9_taxfree_p' + page + '_' + postfix).value
  var perc = this.getField('9_percentage_p' + page + '_' + postfix).value

  if (a <= 0) {
    this.getField('9_taxfree_p' + page + '_' + postfix).value = a
    this.getField('9_taxable_p' + page + '_' + postfix).value = 0
  }

  if (this.getField('9_percentage_p' + page + '_' + postfix).value > 100) {
    this.getField('9_olimit_p' + page + '_' + postfix).hidden = false
    this.getField('9_taxable_p' + page + '_' + postfix).hidden = true
    this.getField('9_tax_p' + page + '_' + postfix).hidden = true
    this.getField('9_amount_p' + page + '_' + postfix).hidden = true
    this.getField('9_taxfree_p' + page + '_' + postfix).hidden = true
  } else {
    this.getField('9_olimit_p' + page + '_' + postfix).hidden = true
    this.getField('9_taxable_p' + page + '_' + postfix).hidden = false
    this.getField('9_tax_p' + page + '_' + postfix).hidden = false
    this.getField('9_amount_p' + page + '_' + postfix).hidden = false
    this.getField('9_taxfree_p' + page + '_' + postfix).hidden = false
  }
}
//</ACRO_script>
//</Document-Level>

//<AcroForm>
//<ACRO_source>1_no_1:Annot1:OnBlur:Action1</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:1_no_1:Annot1:OnBlur:Action1 ***********/
checkkennitala(this.getField('1_no_1'))
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>1_no_2:Annot1:OnBlur:Action1</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:1_no_2:Annot1:OnBlur:Action1 ***********/
checkkennitala(this.getField('1_no_2'))
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>5.1_sum:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:5.1_sum:Calculate ***********/
sum(4, 5, 1)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>5.2_sum:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:5.2_sum:Calculate ***********/
sum(4, 5, 2)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>5.3_sum:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:5.3_sum:Calculate ***********/
sum(0, 5, 3)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>5.4_sum:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:5.4_sum:Calculate ***********/
sum(7, 5, 4)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>5.5_sum:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:5.5_sum:Calculate ***********/
sum(4, 5, 5)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>5.6_field_1:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:5.6_field_1:Calculate ***********/
calc_shares(1)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>5.6_field_2:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:5.6_field_2:Calculate ***********/
calc_shares(2)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>5.6_field_3:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:5.6_field_3:Calculate ***********/
calc_shares(3)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>5.6_field_4:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:5.6_field_4:Calculate ***********/
calc_shares(4)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>5.6_sum:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:5.6_sum:Calculate ***********/
sum(4, 5, 6)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>5.7_sum:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:5.7_sum:Calculate ***********/
sum(0, 5, 7)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>5.8_sum:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:5.8_sum:Calculate ***********/
sum(3, 5, 8)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>6.1_sum:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:6.1_sum:Calculate ***********/
sum(5, 6, 1)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>6.2_sum:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:6.2_sum:Calculate ***********/
sum(0, 6, 2)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>6.3_sum:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:6.3_sum:Calculate ***********/
sum(6, 6, 3)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>7.1_sum:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:7.1_sum:Calculate ***********/
sum(6, 7, 1)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>7.2_sum:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:7.2_sum:Calculate ***********/
sum(6, 7, 2)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_no_1:Annot1:OnBlur:Action1</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_no_1:Annot1:OnBlur:Action1 ***********/
checkkennitala(this.getField('9_no_1'))
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_no_10:Annot1:OnBlur:Action1</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_no_10:Annot1:OnBlur:Action1 ***********/
checkkennitala(this.getField('9_no_10'))
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_no_2:Annot1:OnBlur:Action1</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_no_2:Annot1:OnBlur:Action1 ***********/
checkkennitala(this.getField('9_no_2'))
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_no_3:Annot1:OnBlur:Action1</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_no_3:Annot1:OnBlur:Action1 ***********/
checkkennitala(this.getField('9_no_3'))
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_no_4:Annot1:OnBlur:Action1</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_no_4:Annot1:OnBlur:Action1 ***********/
checkkennitala(this.getField('9_no_4'))
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_no_5:Annot1:OnBlur:Action1</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_no_5:Annot1:OnBlur:Action1 ***********/
checkkennitala(this.getField('9_no_5'))
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_no_6:Annot1:OnBlur:Action1</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_no_6:Annot1:OnBlur:Action1 ***********/
checkkennitala(this.getField('9_no_6'))
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_no_7:Annot1:OnBlur:Action1</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_no_7:Annot1:OnBlur:Action1 ***********/
checkkennitala(this.getField('9_no_7'))
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_no_8:Annot1:OnBlur:Action1</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_no_8:Annot1:OnBlur:Action1 ***********/
checkkennitala(this.getField('9_no_8'))
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_no_9:Annot1:OnBlur:Action1</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_no_9:Annot1:OnBlur:Action1 ***********/
checkkennitala(this.getField('9_no_9'))
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_no_p2_1:Annot1:OnBlur:Action1</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_no_p2_1:Annot1:OnBlur:Action1 ***********/
checkkennitala(this.getField('9_no_1'))
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_no_p2_10:Annot1:OnBlur:Action1</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_no_p2_10:Annot1:OnBlur:Action1 ***********/
checkkennitala(this.getField('9_no_10'))
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_no_p2_2:Annot1:OnBlur:Action1</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_no_p2_2:Annot1:OnBlur:Action1 ***********/
checkkennitala(this.getField('9_no_2'))
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_no_p2_3:Annot1:OnBlur:Action1</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_no_p2_3:Annot1:OnBlur:Action1 ***********/
checkkennitala(this.getField('9_no_3'))
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_no_p2_4:Annot1:OnBlur:Action1</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_no_p2_4:Annot1:OnBlur:Action1 ***********/
checkkennitala(this.getField('9_no_4'))
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_no_p2_5:Annot1:OnBlur:Action1</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_no_p2_5:Annot1:OnBlur:Action1 ***********/
checkkennitala(this.getField('9_no_5'))
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_no_p2_6:Annot1:OnBlur:Action1</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_no_p2_6:Annot1:OnBlur:Action1 ***********/
checkkennitala(this.getField('9_no_6'))
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_no_p2_7:Annot1:OnBlur:Action1</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_no_p2_7:Annot1:OnBlur:Action1 ***********/
checkkennitala(this.getField('9_no_7'))
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_no_p2_8:Annot1:OnBlur:Action1</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_no_p2_8:Annot1:OnBlur:Action1 ***********/
checkkennitala(this.getField('9_no_8'))
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_no_p2_9:Annot1:OnBlur:Action1</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_no_p2_9:Annot1:OnBlur:Action1 ***********/
checkkennitala(this.getField('9_no_9'))
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_percentage_p1_1:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_percentage_p1_1:Calculate ***********/
tax(1, 1)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_percentage_p1_10:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_percentage_p1_10:Calculate ***********/
tax(1, 10)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_percentage_p1_2:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_percentage_p1_2:Calculate ***********/
tax(1, 2)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_percentage_p1_3:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_percentage_p1_3:Calculate ***********/
tax(1, 3)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_percentage_p1_4:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_percentage_p1_4:Calculate ***********/
tax(1, 4)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_percentage_p1_5:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_percentage_p1_5:Calculate ***********/
tax(1, 5)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_percentage_p1_6:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_percentage_p1_6:Calculate ***********/
tax(1, 6)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_percentage_p1_7:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_percentage_p1_7:Calculate ***********/
tax(1, 7)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_percentage_p1_8:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_percentage_p1_8:Calculate ***********/
tax(1, 8)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_percentage_p1_9:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_percentage_p1_9:Calculate ***********/
tax(1, 9)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_percentage_p2_1:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_percentage_p2_1:Calculate ***********/
tax(2, 1)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_percentage_p2_10:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_percentage_p2_10:Calculate ***********/
tax(2, 10)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_percentage_p2_2:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_percentage_p2_2:Calculate ***********/
tax(2, 2)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_percentage_p2_3:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_percentage_p2_3:Calculate ***********/
tax(2, 3)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_percentage_p2_4:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_percentage_p2_4:Calculate ***********/
tax(2, 4)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_percentage_p2_5:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_percentage_p2_5:Calculate ***********/
tax(2, 5)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_percentage_p2_6:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_percentage_p2_6:Calculate ***********/
tax(2, 6)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_percentage_p2_7:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_percentage_p2_7:Calculate ***********/
tax(2, 7)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_percentage_p2_8:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_percentage_p2_8:Calculate ***********/
tax(2, 8)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>9_percentage_p2_9:Calculate</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:9_percentage_p2_9:Calculate ***********/
tax(2, 9)
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>type:Annot1:MouseUp:Action1</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:type:Annot1:MouseUp:Action1 ***********/
on_type_click()
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>type:Annot2:MouseUp:Action1</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:type:Annot2:MouseUp:Action1 ***********/
on_type_click()
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>type:Annot3:MouseUp:Action1</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:type:Annot3:MouseUp:Action1 ***********/
on_type_click()
//</ACRO_script>
//</AcroForm>

//<AcroForm>
//<ACRO_source>type:Annot4:MouseUp:Action1</ACRO_source>
//<ACRO_script>
/*********** belongs to: AcroForm:type:Annot4:MouseUp:Action1 ***********/
on_type_click()
//</ACRO_script>
//</AcroForm>
