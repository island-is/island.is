//https://stackoverflow.com/questions/42303770/file-is-not-a-module-on-js-module-declaration

export class MockData {
  static allVehiclesForPersidnoResponse = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
   <soapenv:Body>
      <ns1:allVehiclesForPersidnoResponse soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:ns1="http://vefekja.us.is">
         <allVehiclesForPersidnoReturn xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">
         <![CDATA[<?xml version="1.0" encoding="UTF-8" ?>
<persidnolookup>
             <persidno>1111111111</persidno>
             <name>Batman Jónsson</name>
             <address>Bankastræti 0</address>
             <poststation>101 Reykjavík</poststation>
             <vehicleList>
                           <vehicle>
                                        <isCurrent>1</isCurrent>
                                        <permno>BAT01</permno>
                                        <regno>BAT01</regno>
                                        <vin>WBA2C710207A74485</vin>
                                        <type>Batmobile</type>
                                        <color>Svartur</color>
                                        <firstregdate>28.02.2018</firstregdate>
                                        <modelyear></modelyear>
                                        <productyear></productyear>
                                        <registrationtype>Nýskráð - Almenn</registrationtype>
                                        <role>Eigandi</role>
                                        <startdate>30.06.2020</startdate>
                                        <enddate></enddate>
                                        <outofuse>0</outofuse>
                                        <otherowners>0</otherowners>
                                        <termination>Núverandi eigandi</termination>
                                        <buyerpersidno></buyerpersidno>
                                        <ownerpersidno>1111111111</ownerpersidno>
                                        <vehiclestatus>Í lagi</vehiclestatus>
                                        <usegroup>Almenn notkun</usegroup>
                                        <vehgroup>Fólksbifreið (M1)</vehgroup>
                                        <platestatus>Á ökutæki</platestatus>

                           </vehicle>
             </vehicleList>
</persidnolookup>]]></allVehiclesForPersidnoReturn>
      </ns1:allVehiclesForPersidnoResponse>
   </soapenv:Body>
</soapenv:Envelope>
  `
  static basicVehicleInformationResponse = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
   <soapenv:Body>
      <ns1:basicVehicleInformationResponse soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:ns1="http://vefekja.us.is">
         <basicVehicleInformationReturn xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"><![CDATA[<?xml version="1.0" encoding="UTF-8" ?>
<vehicle>
             <message></message>
             <permno>BAT01</permno>
             <regno>BAT01</regno>
             <vin>VBKEXA4088M456073</vin>
             <typeno>VBKEXA405001</typeno>
             <typeapproval>1161</typeapproval>
           <typeapprovalextension>1</typeapprovalextension>
     <eutypeapproval>e1*02/24*0335*00</eutypeapproval>
             <variant>B</variant>
             <version>A</version>
             <modelcode></modelcode>
             <make>KTM</make>
             <vehcom>530 EXC-R</vehcom>
             <speccom></speccom>
             <color>Rauðgulur</color>
             <productyear></productyear>
             <modelyear></modelyear>
             <preregdate>29.08.2007</preregdate>
             <customsdate>29.08.2007</customsdate>
             <firstregdate>31.08.2007</firstregdate>
             <newregdate>31.08.2007</newregdate>
             <deregdate>25.04.2012</deregdate>
             <reregdate></reregdate>
             <ownregdate>25.04.2012</ownregdate>
             <manufacturer>KTM - Sportmotorcycle</manufacturer>
             <country>Transilvanía</country>
             <formercountry></formercountry>
          <importerpersidno>4802992569</importerpersidno>
             <importername>KTM Ísland ehf.</importername>
             <import>Nýtt gvk.</import>
             <vehiclestatus>Afskráð</vehiclestatus>
             <disastertype></disastertype>
             <hasdisasters>0</hasdisasters>
             <fixed>0</fixed>
             <hasaccidents>0</hasaccidents>
             <usegroup>Almenn notkun</usegroup>
             <regtype>Almenn merki</regtype>
             <platetypefront>Gerð C</platetypefront>
             <platetyperear></platetyperear>
             <platestatus></platestatus>
             <platestoragelocation></platestoragelocation>
             <insurancecompany>Vátryggingafélag Íslands</insurancecompany>
             <insurancestatus>0</insurancestatus>
       <nextinspectiondate>01.07.2012</nextinspectiondate>
<nextinspectiondateIfPassedInspectionToday>01.07.2022</nextinspectiondateIfPassedInspectionToday>
             <rebuilt>0</rebuilt>
             <offroad>0</offroad>
             <taxgroup>Ökutæki án skattflokks</taxgroup>
             <technical>
                           <vehgroup>Þungt bifhjól (L3e)</vehgroup>
                           <vehsubgroup></vehsubgroup>
                           <engine>Bensín</engine>
                           <pass>0</pass>
                           <passbydr>0</passbydr>
                           <engingemanuf>KTM Sportmotorcycle AG</engingemanuf>
                           <enginecode>786</enginecode>
                           <workingpr></workingpr>
                           <directinj>1</directinj>
                           <nocylinders>1</nocylinders>
                           <arrcylinders></arrcylinders>
                           <capacity>510</capacity>
                           <maxnetpow>10.6</maxnetpow>
                           <atmin>6500</atmin>
                           <clutchtype></clutchtype>
                           <gearbox>1</gearbox>
                           <gearratio1>2.570</gearratio1>
                           <gearratio2>1.880</gearratio2>
                           <gearratio3>1.470</gearratio3>
                           <gearratio4>1.180</gearratio4>
                           <gearratio5>0.960</gearratio5>
                           <gearratio6>0.800</gearratio6>
                           <findrivratio></findrivratio>
                           <steermeth>0</steermeth>
                           <typeofbody></typeofbody>
                           <doorsno></doorsno>
                           <seatno></seatno>
                           <standingno></standingno>
                           <maxspeed>100</maxspeed>
                           <soundstat>84.0</soundstat>
                           <sounddrive>80.0</sounddrive>
                           <co>1.170</co>
                           <hc>0.050</hc>
                           <nox>0.050</nox>
                           <hcnox></hcnox>
                           <remark></remark>
                           <roofload></roofload>
                           <noofgears>6</noofgears>
                           <soundatmin>3250.0</soundatmin>
                           <particulates></particulates>
                           <urban></urban>
                           <extraurban></extraurban>
                           <combined></combined>
                           <co2></co2>
                           <weightedco2></weightedco2>
                           <co2_wltp></co2_wltp>
                           <weightedco2_wltp></weightedco2_wltp>
                           <brakedevice></brakedevice>
                           <snumber></snumber>
                           <t_massoftrbr></t_massoftrbr>
                           <t_massoftrunbr></t_massoftrunbr>
                           <tyre>
                                        <tyreaxle1>90/90-21 54M</tyreaxle1>
                                        <tyreaxle2>140/80-18 65M</tyreaxle2>
                                        <tyreaxle3></tyreaxle3>
                                        <tyreaxle4></tyreaxle4>
                                        <tyreaxle5></tyreaxle5>
                           </tyre>
                           <size>
                                        <length>2236</length>
                                        <width>786</width>
                                        <height>1259</height>
                           </size>
                           <axle>
                                        <axleno>2</axleno>
                                        <wheelsno>2</wheelsno>
                                        <axlepow1>0</axlepow1>
                                        <axlepow2>0</axlepow2>
                                        <axlepow3>0</axlepow3>
                                        <axlepow4>0</axlepow4>
                                        <axlepow5>0</axlepow5>
                                        <wheelbase>1481</wheelbase>
                                        <axletrack1></axletrack1>
                                        <axletrack2></axletrack2>
                                        <axletrack3></axletrack3>
                                        <axletrack4></axletrack4>
                                        <axletrack5></axletrack5>
                                        <wheelaxle1></wheelaxle1>
                                        <wheelaxle2></wheelaxle2>
                                        <wheelaxle3></wheelaxle3>
                                        <wheelaxle4></wheelaxle4>
                                        <wheelaxle5></wheelaxle5>
                           </axle>
                           <mass>
                                        <massinro>120</massinro>
                                        <massofveh>113</massofveh>
                                        <massdaxle1></massdaxle1>
                                        <massdaxle2></massdaxle2>
                                        <massdaxle3></massdaxle3>
                                        <massdaxle4></massdaxle4>
                                        <massdaxle5></massdaxle5>
                                        <massmaxle1>145</massmaxle1>
                                        <massmaxle2>190</massmaxle2>
                                        <massmaxle3></massmaxle3>
                                        <massmaxle4></massmaxle4>
                                        <massmaxle5></massmaxle5>
                                        <massladen>335</massladen>
                                        <massoftrbr></massoftrbr>
                                        <massoftrunbr></massoftrunbr>
                                        <massofcomb></massofcomb>
                                        <massatcoup></massatcoup>
                                        <masscapacity>215</masscapacity>
                           </mass>
             </technical>
             <owners>
                           <owner>
                                        <current>1</current>
                                        <anonymous>0</anonymous>
                                        <purchasedate>18.04.2012</purchasedate>
                                        <ownregdate>25.04.2012</ownregdate>
                                        <receptiondate>25.04.2012</receptiondate>
                                        <persidno>1111111111</persidno>
                                        <fullname>Vátryggingafélag Íslands hf.</fullname>
                                        <address>Ármúla 3</address>
                                        <postalcode>108</postalcode>
                                        <city>Reykjavík</city>
                                       <ownerinsurancecode>6090</ownerinsurancecode>
                                        <co-owners>
                                        </co-owners>
                           </owner>
                           <owner>
                                        <current>0</current>
                                        <anonymous>0</anonymous>
                                        <purchasedate>25.05.2009</purchasedate>
                                        <ownregdate>03.06.2009</ownregdate>
                                        <receptiondate>02.06.2009</receptiondate>
                                        <persidno>1111111111</persidno>
                                        <fullname>Jón Jónsson</fullname>
                                        <address>Bankastræti 0</address>
                                        <postalcode>101</postalcode>
                                        <city>Reykjavík</city>
                                       <ownerinsurancecode>6090</ownerinsurancecode>
                                        <co-owners>
                                        </co-owners>
                           </owner>
                           <owner>
                                        <current>0</current>
                                        <anonymous>0</anonymous>
                                        <purchasedate>31.08.2007</purchasedate>
                                        <ownregdate>31.08.2007</ownregdate>
                                        <receptiondate>31.08.2007</receptiondate>
                                        <persidno>1111111111</persidno>
                                        <fullname>Aron Aronsson</fullname>
                                        <address>Bankastræti 0</address>
                                        <postalcode>101</postalcode>
                                        <city>Reykjavík</city>
                                       <ownerinsurancecode>6080</ownerinsurancecode>
                                        <co-owners>
                                        </co-owners>
                           </owner>
             </owners>
             <operators>
                           <operator>
                                        <current>0</current>
                                        <mainoperator>1</mainoperator>
                                        <serial>0</serial>
                                        <startdate>29.08.2007</startdate>
                                        <enddate>03.06.2009</enddate>
                                        <persidno>1111111111</persidno>
                                        <fullname>KTM Ísland ehf.</fullname>
                                        <address>Bankastræti 0</address>
                                        <postalcode>112</postalcode>
                                        <city>Reykjavík</city>
                           </operator>
             </operators>
             <plates>
                           <plate>
                                        <date>31.08.2007</date>
                                        <regno>BAT01</regno>
                                        <reggroup>N1</reggroup>
                                        <reggroupname>Almenn merki</reggroupname>
                           </plate>
             </plates>
             <disasters>
             </disasters>
             <registrations>
                           <registration>
                                        <date>25.04.2012</date>
                                        <type>Afskráð</type>
                                        <subtype>Týnt</subtype>
                           </registration>
                           <registration>
                                        <date>31.08.2007</date>
                                        <type>Nýskráð</type>
                                        <subtype>Almenn</subtype>
                           </registration>
                           <registration>
                                        <date>29.08.2007</date>
                                        <type>Forskráð</type>
                                        <subtype>Almenn</subtype>
                           </registration>
                           <registration>
                                        <date>29.08.2007</date>
                                        <type>Tollafgreitt</type>
                                        <subtype>Almenn</subtype>
                           </registration>
             </registrations>
             <outofuses>
                           <outofuse>
                                        <date>26.05.2009</date>
                                        <type>Í umferð (úttekt)</type>
                                        <station>Samgöngustofa - Ármúla</station>
                           </outofuse>
                           <outofuse>
                                        <date>10.09.2007</date>
                                        <type>Úr umferð (innlögn)</type>
                                        <station>Aðalskoðun Hafnarfirði</station>
                           </outofuse>
             </outofuses>
             <updatelocks>
                           <updatelock>
                                        <startdate>28.09.2017</startdate>
                                        <enddate>28.09.2017</enddate>
                                        <type>2 Lögreglulás</type>
                           </updatelock>
                           <updatelock>
                                        <startdate>28.09.2017</startdate>
                                        <enddate>28.09.2017</enddate>
                                        <type>2 Lögreglulás</type>
                           </updatelock>
                           <updatelock>
                                        <startdate>02.11.2014</startdate>
                                        <enddate>02.11.2014</enddate>
                                        <type>2 Lögreglulás</type>
                           </updatelock>
             </updatelocks>
             <stolens>
                           <stolen>
                                        <startdate>28.09.2017</startdate>
                                        <enddate></enddate>
                                        <explanation>Lögreglustjórinn á höfuðborgarsvæðinu 444 1000</explanation>
                           </stolen>
                           <stolen>
                                        <startdate>04.11.2014</startdate>
                                        <enddate>28.09.2017</enddate>
                                        <explanation>Engin skýring</explanation>
                           </stolen>
                           <stolen>
                                        <startdate>27.09.2011</startdate>
                                        <enddate>02.11.2014</enddate>
                                        <explanation>Engin skýring</explanation>
                           </stolen>
             </stolens>
             <remarks>
             </remarks>
             <inspections>
                           <inspection>
                                        <date>29.09.2010</date>
                                        <reinspectiondate></reinspectiondate>
                                        <station>Frumherji</station>
                                        <type>Aðalskoðun</type>
                                        <officer>Óskar Óskarsson</officer>
                                        <result>Lagfæring</result>
                                        <odometer>4530</odometer>
                                        <remarks>
                                                      <remark>
                                                                   <itemcode>109</itemcode>
                                                                   <itemname>Speglar</itemname>
                                                                   <resultcode>2</resultcode>
                                                                   <resultname>Frestur</resultname>
                                                      </remark>
                                        </remarks>
                           </inspection>
                           <inspection>
                                        <date>31.08.2007</date>
                                        <reinspectiondate></reinspectiondate>
                                        <station>KTM Ísland ehf.</station>
                                        <type>Fulltrúaskoðun</type>
                                        <officer>Karl Karlsson</officer>
                                        <result>Án athugasemda</result>
                                        <odometer>1</odometer>
                                        <remarks>
                                        </remarks>
                           </inspection>
             </inspections>
             <ownerregistrationerrors>
             </ownerregistrationerrors>
             <vehicleChanges>
                           <vehicleChange>
                                        <date>31.08.2007</date>
                                        <changes>
                                        </changes>
                           </vehicleChange>
             </vehicleChanges>
             <typeChanges>
             </typeChanges>
             <specialEquipmentChanges>
             </specialEquipmentChanges>
             <addonsChanges>
             </addonsChanges>
             <superstructureChanges>
             </superstructureChanges>
             <adrs>
             </adrs>
</vehicle>]]></basicVehicleInformationReturn>
      </ns1:basicVehicleInformationResponse>
   </soapenv:Body>
</soapenv:Envelope>
`
}
