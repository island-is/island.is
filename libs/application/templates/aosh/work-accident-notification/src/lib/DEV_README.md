# Tilkynning vinnuslyss

##### Dataschema

Er bara búinn að setja upp grunn af datachema, vantar validation, hvað er optional etc.. setti optional á helling bara til að flýta
fyrir dev að þurfa ekki að fylla allt út.

##### Multiselect skjáir

Búið að útfæra fyrsta skjáinn, allir aðrir ættu að vera nánast eins. Vantar að bæta við í logík þegar valið er "alvarlegast" að
ef sá option er svo tekinn út í multiselect þá er hann enn í answers.

##### Allt eftir Multiselect

Allir skjáir eftir multiselect skjáina á eftir að útfæra meðal annars að búa til slys og senda til VER o.s.f.r
Einnig að sækja uppfærslu á core component sem Berglind var að útfæra og uppfæra þannig við notum það, vonandi lítilsháttar breyting
(hugsanlega eitthvað varðandi töggin og/eða gögnin hvort þau séu checked ??)

##### Fyrirtæki vs Einstaklingur

Er ekki búinn að snerta neitt á þeirri lógik, vantar einnig að fylla út upplýsingar um fyrirtæki o.s.fr rétt eftir gagnaöflun.
Á eftir að útfæra skjá nr 2 sem einstaklingur velur fyrir hvaða fyrirtæki hann er að skrá slyss og einnig þá að athuga
hvort það fyrirtæki sé búinn að setja sig á lista yfir fyrirtæki sem leyfa það ekki (held þetta sé ekki ennþá til ?)

##### Fjöldi starfsmanna

Var örlítið búinn að skoða að bæta fyrir fleiri starfsmönnum, þyrfti líklega að hafa condition sem les answers fyrir fjölda starfsmanna (eitthvað sem uppfærist þegar notandi velur "bæta við öðrum starfsmanni") einnig þarf að fara í fjöldi file-a og componenta (sérstaklega custom og bæta við index parameter og index-a öll answer fyrir hvern starfsmann)
