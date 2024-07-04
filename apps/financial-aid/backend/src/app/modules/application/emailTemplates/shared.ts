export const fonts = `@font-face {
    font-family: 'IBM Plex Sans';
    font-style: normal;
    font-weight: 300;
    src: local('IBMPlexSans-Light'), url(https://fonts.gstatic.com/s/ibmplexsans/v8/zYX9KVElMYYaJe8bpLHnCwDKjXr8AIFsdP3pBms.woff2) format('woff2');
  }
  @font-face {
    font-family: 'IBM Plex Sans';
    font-style: normal;
    font-weight: 600;
    src: local('IBMPlexSans-SemiBold'), url(https://fonts.gstatic.com/s/ibmplexsans/v8/zYX9KVElMYYaJe8bpLHnCwDKjQ76AIFsdP3pBms.woff2) format('woff2');
  }`

export const header = (content: string) => `<tr> 
<td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:41px;color:#0061ff;font-size:34px"><strong>${content}</strong></p></td> 
</tr> `

export const veitaFooter = (email: string) => `<tr> 
<td align="left" bgcolor="#f8f5fa" style="Margin:0;padding-left:30px;padding-right:30px;padding-top:40px;padding-bottom:40px;background-color:#f8f5fa"> 
 <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
   <tr> 
    <td align="center" valign="top" style="padding:0;Margin:0;width:540px"> 
     <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
       <tr> 
        <td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#00003c;font-size:14px">Þú ert að fá þennan tölvupóst á netfangið&nbsp;${email} vegna þess að þér var bætt við Veitu kerfið sem stjórnandi.</p></td> 
       </tr> 
     </table></td> 
   </tr> 
 </table></td> 
</tr>  `

export const municipalitySettings = (isFirstAdmin: boolean) => {
  return isFirstAdmin
    ? `<tr> 
  <td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#00003c;font-size:18px"><strong>Að virkja Veitu svo hægt sé að taka við umsóknum</strong></p></td> 
 </tr> 
 <tr> 
  <td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#00003c;font-size:18px">Svo hægt sé að taka við umsóknum í gegnum Ósk umsóknarferli þarf að fylla út alla reiti undir Sveitarfélagsstillingar sem þú finnur vinstra megin í viðmótinu:</p></td> 
 </tr> 
 <tr> 
  <td align="left" style="padding:0;Margin:0;font-size:0px"><img class="adapt-img" src="https://orohoy.stripocdn.email/content/guids/CABINET_2da6ab5ca1b75ded0e14919f1227b425/images/virkjaveituexample.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="44"></td> 
 </tr> `
    : `<tr> 
 <td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#00003c;font-size:18px"><strong>Stillingar fyrir sveitarfélagið</strong></p></td> 
</tr> 
<tr> 
 <td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#00003c;font-size:18px">Undir Sveitarfélagsstillingar eru meðal annars skilgreindar upphæðir fjárhagsaðstoðar sem og vefslóðir og netföng sem notendum er bent á sér til upplýsinga í sjálfvirkum tölvupóstum og á stöðusíðum umsókna.</p></td> 
</tr> 
<tr> 
 <td align="left" style="padding:0;Margin:0;font-size:0px"><img class="adapt-img" src="https://orohoy.stripocdn.email/content/guids/CABINET_2da6ab5ca1b75ded0e14919f1227b425/images/virkjaveituexample.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="44"></td> 
</tr> `
}

export const veitaActionComponent = (url: string) => {
  return `<tr> 
  <td align="left" bgcolor="#f8f5fa" style="Margin:0;padding-left:30px;padding-right:30px;padding-top:40px;padding-bottom:40px;background-color:#f8f5fa"> 
   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
     <tr> 
      <td align="center" valign="top" style="padding:0;Margin:0;width:540px"> 
       <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
         <tr> 
          <td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#00003c;font-size:18px">Í þessum pósti finnur þú einfaldar leiðbeiningar um helstu atriði varðandi að koma kerfinu í notkun. Þú getur smellt á takkann hér að neðan til að skrá þig inn í kerfið með rafrænum skilríkjum.</p></td> 
         </tr> 
         <tr> 
          <td align="left" style="padding:0;Margin:0"><span class="es-button-border" style="border-style:solid;border-color:#2CB543;background:#2CB543;border-width:0px 0px 2px 0px;display:inline-block;border-radius:30px;width:auto;border-top-left-radius:8px;border-top-right-radius:8px;border-bottom-right-radius:8px;border-bottom-left-radius:8px;background-color:#0061ff;border-bottom-width:0px"><a href=${url} class="es-button es-button-1" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:18px;border-style:solid;border-color:#0061ff;border-width:18px 24px;display:inline-block;background:#31CB4B;border-radius:30px;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;font-weight:bold;font-style:normal;line-height:22px;width:auto;text-align:center;background-color:#0061ff;border-top-left-radius:8px;border-top-right-radius:8px;border-bottom-right-radius:8px;border-bottom-left-radius:8px">Innskráning 
             <!--[if !mso]><!-- --><img src="https://orohoy.stripocdn.email/content/guids/CABINET_2da6ab5ca1b75ded0e14919f1227b425/images/openiconwhite.png" alt="icon" align="absmiddle" height="24" style="display:inline-block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;vertical-align:middle;margin-left:8px"> 
             <!--<![endif]--></a></span></td> 
         </tr> 
       </table></td> 
     </tr> 
   </table></td> 
 </tr> `
}

export const addUsers = `<tr> 
<td align="center" style="padding:0;Margin:0;padding-top:40px;padding-bottom:40px;font-size:0"> 
 <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
   <tr> 
    <td style="padding:0;Margin:0;border-bottom:1px solid #cccccc;background:none;height:1px;width:100%;margin:0px"></td> 
   </tr> 
 </table>
 </td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#00003c;font-size:18px"><strong>Að bæta við notendum</strong></p></td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#00003c;font-size:18px">Til að bæta við notendum/vinnsluaðilum til að vinna umsóknir smellir þú á Notendur vinstra megin í viðmótinu:</p></td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;font-size:0px"><img class="adapt-img" src="https://orohoy.stripocdn.email/content/guids/CABINET_2da6ab5ca1b75ded0e14919f1227b425/images/baetavidnotendumexample.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="44"></td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;padding-top:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#00003c;font-size:18px">Þar smellir þú á takkann <em>Stofna notanda </em>og fyllir út kennitölu, fullt nafn og netfang viðkomandi. Einnig þarft þú að gera grein fyrir því hvort viðkomandi eigi að hafa aðgang að stjórnendastillingum þar sem hægt er að breyta stillingum fyrir sveitafélagið eins og upphæðum fjárhagsaðstoða og hlekkjum á reglur um fjárhagsaðstoð fyrir sveitarfélagið.</p></td> 
</tr> `

export const handleApplications = (copy: string) => `<tr> 
<td align="center" style="padding:0;Margin:0;padding-top:40px;padding-bottom:40px;font-size:0"> 
 <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
   <tr> 
    <td style="padding:0;Margin:0;border-bottom:1px solid #cccccc;background:none;height:1px;width:100%;margin:0px"></td> 
   </tr> 
 </table></td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#00003c;font-size:18px"><strong>Vilt þú sem stjórnandi einnig geta sýslað með umsóknir?</strong></p></td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;padding-top:20px;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#00003c;font-size:18px">${copy}</p></td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;font-size:0px"><img class="adapt-img" src="https://orohoy.stripocdn.email/content/guids/CABINET_2da6ab5ca1b75ded0e14919f1227b425/images/minastillingar.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="44"></td> 
</tr> `

export const groups = `<tr> 
<td align="center" style="padding:0;Margin:0;padding-top:40px;padding-bottom:40px;font-size:0"> 
 <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
   <tr> 
    <td style="padding:0;Margin:0;border-bottom:1px solid #cccccc;background:none;height:1px;width:100%;margin:0px"></td> 
   </tr> 
 </table></td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#00003c;font-size:18px"><strong>Flokkar</strong></p></td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#00003c;font-size:18px">Flokkarnir <em>Innhólf</em>, <em>Mitt</em> og <em>Teymið</em> eru notaðar til að aðgreina mál. Undir Innhólf eru umsóknir sem enginn vinnsluaðili hefur tekið að sér. Mitt inniheldur mál sem þú ert með í vinnslu og undir <em>Teymi</em> finnur þú allar umsóknir um fjárhagsaðstoð í vinnslu hjá þér og þínu samstarfsfólki.</p></td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;font-size:0px"><img class="adapt-img" src="https://orohoy.stripocdn.email/content/guids/CABINET_98cd192cefa70d01d96d6fcdc856173f/images/vinnsluadiliflokkar.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="32"></td> 
</tr>`

export const newApplications = `<tr> 
<td align="center" style="padding:0;Margin:0;padding-top:40px;padding-bottom:40px;font-size:0"> 
 <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
   <tr> 
    <td style="padding:0;Margin:0;border-bottom:1px solid #cccccc;background:none;height:1px;width:100%;margin:0px"></td> 
   </tr> 
 </table></td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#00003c;font-size:18px"><strong>Nýjar umsóknir</strong></p></td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#00003c;font-size:18px">Allar nýjar umsóknir sem koma inn í Veitu úr umsóknarflæðinu Ósk raðast í lista undir valmöguleikanum <em>Ný mál</em> í vinstri fleka kerfisins. Þar getur þú sem vinnsluaðili skoðað umsóknir og ákveðið hvort þú ætlir að taka að þér vinnslu málsins.</p></td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;font-size:0px"><img class="adapt-img" src="https://orohoy.stripocdn.email/content/guids/CABINET_98cd192cefa70d01d96d6fcdc856173f/images/vinnsluadilinyjarumsoknir.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="44"></td> 
</tr> `

export const mySettings = `<tr> 
<td align="center" style="padding:0;Margin:0;padding-top:40px;padding-bottom:40px;font-size:0"> 
 <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
   <tr> 
    <td style="padding:0;Margin:0;border-bottom:1px solid #cccccc;background:none;height:1px;width:100%;margin:0px"></td> 
   </tr> 
 </table></td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#00003c;font-size:18px"><strong>Hvernig tek ég að mér mál til að vinna úr því?</strong></p></td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#00003c;font-size:18px">Ef umsókn er ný og enginn vinnsluaðili hefur tekið að sér málið getur þú smellt á <em>Sjá um</em> á yfirlitsskjánum <em>Ný mál</em>.<br><br>Ef annar vinnsluaðili hefur tekið að sér mál og þú vilt taka yfir málið getur þú opnað umsóknina og smellt á <em>Sjá um</em> við hliðina á nafni vinnsluaðilans ofarlega í umsókninni.</p></td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;font-size:0px"><img class="adapt-img" src="https://orohoy.stripocdn.email/content/guids/CABINET_fefcb1c3a0709260819ee122acfdf4b2/images/minastillingar.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="44"></td> 
</tr>`

export const applicationStatus = `<tr> 
<td align="center" style="padding:0;Margin:0;padding-top:40px;padding-bottom:40px;font-size:0"> 
 <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
   <tr> 
    <td style="padding:0;Margin:0;border-bottom:1px solid #cccccc;background:none;height:1px;width:100%;margin:0px"></td> 
   </tr> 
 </table></td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#00003c;font-size:18px"><strong>Stöður umsókna</strong></p></td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#00003c;font-size:18px">Á yfirlitssíðum mála getur þú séð stöðu umsóknarinnar í tögum. Stöðum umsókna má breyta í umsókninni sjálfri með því að smella á <em>Breyta stöðu</em>. Stundum breytist staða umsóknar án þess að vinnsluaðili breyti henni sjálf/ur, til dæmis þegar umsækjandi skilar inn gögnum sem vantaði; þá myndi staða umsóknar breytast úr <em>Vantar upplýsingar</em> í <em>Nýjar upplýsingar</em>.</p></td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;padding-bottom:10px;font-size:0px"><img class="adapt-img" src="https://orohoy.stripocdn.email/content/guids/CABINET_98cd192cefa70d01d96d6fcdc856173f/images/nyumsokntag.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="32"></td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;padding-bottom:25px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#00003c;font-size:14px">Umsókn er ný í kerfinu og enginn vinnsluaðili hefur tekið málið að sér.</p></td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;padding-bottom:10px;font-size:0px"><img class="adapt-img" src="https://orohoy.stripocdn.email/content/guids/CABINET_98cd192cefa70d01d96d6fcdc856173f/images/urvinnslatag.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="32"></td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;padding-bottom:25px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#00003c;font-size:14px">Vinnsluaðili hefur tekið málið að sér. </p></td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;padding-bottom:10px;font-size:0px"><img class="adapt-img" src="https://orohoy.stripocdn.email/content/guids/CABINET_98cd192cefa70d01d96d6fcdc856173f/images/samthykkttag.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="32"></td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;padding-bottom:25px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#00003c;font-size:14px">Umsókn hefur verið samþykkt.</p></td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;padding-bottom:10px;font-size:0px"><img class="adapt-img" src="https://orohoy.stripocdn.email/content/guids/CABINET_98cd192cefa70d01d96d6fcdc856173f/images/synjadtag.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="32"></td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;padding-bottom:25px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#00003c;font-size:14px">Umsókn hefur verið synjað.</p></td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;padding-bottom:10px;font-size:0px"><img class="adapt-img" src="https://orohoy.stripocdn.email/content/guids/CABINET_98cd192cefa70d01d96d6fcdc856173f/images/vantargogn.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="32"></td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;padding-bottom:25px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#00003c;font-size:14px">Í umsóknina vantar upplýsingar. Þegar þessi staða er valin er umsækjanda send skilaboð og gert grein fyrir hvaða gögn vantar svo hægt sé að vinna umsóknina.</p></td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;padding-bottom:10px;font-size:0px"><img class="adapt-img" src="https://orohoy.stripocdn.email/content/guids/CABINET_98cd192cefa70d01d96d6fcdc856173f/images/nygogntag.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="32"></td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;padding-bottom:25px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#00003c;font-size:14px">Umsækjandi hefur svarað stöðunni <em>Vantar upplýsingar</em> með því að hlaða upp upplýsingum í gegnum stöðusíðu umsóknarinnar. Þetta er í raun sama staða og staðan Úrvinnsla og textinn í taginu Nýjar upplýsingar birtist eingöngu ef ekki hefur verið smellt á umsóknina eftir að nýjar upplýsingar bárust.</p></td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;padding-bottom:10px;font-size:0px"><img class="adapt-img" src="https://orohoy.stripocdn.email/content/guids/CABINET_98cd192cefa70d01d96d6fcdc856173f/images/utrunninumsokntag.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="32"></td> 
</tr> 
<tr> 
<td align="left" style="padding:0;Margin:0;padding-bottom:25px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#00003c;font-size:14px">Umsókn hefur runnið út á tíma. Þetta getur til dæmis gerst ef nauðsynleg gögn bárust ekki svo hægt væri að vinna úr umsókninni.</p></td> 
</tr>`
