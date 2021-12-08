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

export const sambandIcon = `<table class="es-header" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"> 
  <tr> 
   <td align="center" style="padding:0;Margin:0"> 
    <table class="es-header-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"> 
      <tr> 
       <td align="left" style="padding:30px;Margin:0"> 
        <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
          <tr> 
           <td align="center" valign="top" style="padding:0;Margin:0;width:540px"> 
            <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
              <tr> 
               <td align="left" style="padding:0;Margin:0;padding-bottom:40px;font-size:0px"><img class="adapt-img" src="https://orohoy.stripocdn.email/content/guids/CABINET_da4781bc309fc9253f69ae53878fabb3/images/sislogo.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="64"></td> 
              </tr> 
            </table></td> 
          </tr> 
        </table></td> 
      </tr> 
    </table></td> 
  </tr> 
</table> `

export const header = (content: string) => `<tr> 
<td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:41px;color:#0061ff;font-size:34px"><strong>${content}</strong></p></td> 
</tr> `
