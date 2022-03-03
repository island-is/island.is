export const CodeEmailTemplate = (code: string) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html style="background: #f2f7ff !important;">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width">
        <meta name="color-scheme" content="only">
        <title>example</title>
      </head>
    
      <style type="text/css">
    @media only screen {
      html {
        min-height: 100%;
        background: #fff;
      }
    }
    a:active,
    a:hover {
      color: #147dc2;
    }
    a:visited,
    h1 a,
    h1 a:visited,
    h2 a,
    h2 a:visited,
    h3 a,
    h3 a:visited,
    h4 a,
    h4 a:visited,
    h5 a,
    h5 a:visited,
    h6 a,
    h6 a:visited {
      color: #2199e8;
    }
    @media only screen {
      a[x-apple-data-detectors] {
        color: inherit!important;
        text-decoration: none!important;
        font-size: inherit!important;
        font-family: inherit!important;
        font-weight: inherit!important;
        line-height: inherit!important;
      }
    }
    @media only screen and (max-width:620px) {
      table.body img {
        width: auto;
        height: auto;
      }
    
      table.body center {
        min-width: 0!important;
      }
    
      table.body .container {
        width: 100%!important;
      }
    
      table.body .column,
    table.body .columns {
        height: auto!important;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        padding-left: 40px!important;
        padding-right: 40px!important;
      }
    
      table.body .column .column,
    table.body .column .columns,
    table.body .columns .column,
    table.body .columns .columns {
        padding-left: 0!important;
        padding-right: 0!important;
      }
    }
    </style>
      <style type="text/css">
    @media only screen and (max-width: 620px) {
      table.container {
        margin-top: 0 !important;
        margin-bottom: 0 !important;
      }
    }
    @media only screen and (max-width: 620px) {
      .segment {
        padding-left: 20px !important;
        padding-right: 20px !important;
      }
    }
    @media only screen and (max-width: 620px) {
      .section {
        margin-bottom: 1px !important;
        padding-bottom: 20px !important;
      }
    }
    @media only screen and (max-width: 620px) {
      .heading {
        font-size: 26px !important;
        line-height: 32px !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
    
      .heading.size-small {
        font-size: 20px !important;
        line-height: 26px !important;
      }
    }
    @media only screen and (max-width: 620px) {
      .copy {
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-top: 6px !important;
        margin-bottom: 6px !important;
      }
    }
    @media only screen and (max-width: 620px) {
      .copy p {
        font-size: 18px !important;
        line-height: 26px !important;
      }
    
      .copy.size-small p {
        font-size: 16px !important;
        line-height: 24px !important;
      }
    }
    @media only screen and (max-width: 620px) {
      .list {
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-top: 6px !important;
        margin-bottom: 6px !important;
      }
    }
    @media only screen and (max-width: 620px) {
      .list p {
        font-size: 14px !important;
        line-height: 20px !important;
      }
    }
    @media only screen and (max-width: 620px) {
      .image {
        margin-top: 15px !important;
        margin-bottom: 15px !important;
        padding-left: 20px !important;
        padding-right: 20px !important;
      }
    }
    @media only screen and (max-width: 620px) {
      .subtitle {
        font-size: 16px !important;
        line-height: 24px !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
    }
    </style>
      <style type="text/css">
    @font-face {
      font-family: 'IBM Plex Sans';
      font-style: normal;
      font-weight: 300;
      src: local('IBMPlexSans-Light'), url(https://fonts.gstatic.com/s/ibmplexsans/v8/zYX9KVElMYYaJe8bpLHnCwDKjXr8AIFsdP3pBms.woff2) format('woff2');}
    @font-face {
      font-family: 'IBM Plex Sans';
      font-style: normal;
      font-weight: 600;
      src: local('IBMPlexSans-SemiBold'), url(https://fonts.gstatic.com/s/ibmplexsans/v8/zYX9KVElMYYaJe8bpLHnCwDKjQ76AIFsdP3pBms.woff2) format('woff2');}
    </style>
    
      <body style="min-width: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #0a0a0a; font-family: Helvetica,Arial,sans-serif; font-weight: 400; padding: 0; margin: 0; Margin: 0; text-align: left; font-size: 16px; line-height: 130%; width: 100%!important;">
        <table class="body" style="border-spacing: 0; border-collapse: collapse; vertical-align: top; height: 100%; width: 100%; color: #0a0a0a; font-family: Helvetica,Arial,sans-serif; font-weight: 400; padding: 0; margin: 0; Margin: 0; text-align: left; font-size: 16px; line-height: 130%; background: #f2f7ff !important;" width="100%" height="100%" valign="top" align="left">
          <tr style="padding: 0; vertical-align: top; text-align: left;" valign="top" align="left">
            <td class="center" align="left" valign="top" style="word-wrap: break-word; -webkit-hyphens: auto; -moz-hyphens: auto; hyphens: auto; vertical-align: top; color: #0a0a0a; font-family: Helvetica,Arial,sans-serif; font-weight: 400; padding: 0; margin: 0; Margin: 0; text-align: left; font-size: 16px; line-height: 130%; border-collapse: collapse!important;">
              <center style="width: 100%; min-width: 580px;">
                <div align="center" class="float-center">
                  <table align="inherit" class="container" style="border-spacing: 0; border-collapse: collapse; padding: 0; vertical-align: top; background: #fefefe; width: 580px; margin: 0 auto; Margin: 0 auto; text-align: inherit; border-radius: 8px; margin-top: 40px !important; margin-bottom: 40px !important;" width="580" valign="top">
                    <tbody>
                      <tr style="padding: 0; vertical-align: top; text-align: left;" valign="top" align="left">
                        <td style="word-wrap: break-word; -webkit-hyphens: auto; -moz-hyphens: auto; hyphens: auto; vertical-align: top; color: #0a0a0a; font-family: Helvetica,Arial,sans-serif; font-weight: 400; padding: 0; margin: 0; Margin: 0; text-align: left; font-size: 16px; line-height: 130%; border-collapse: collapse!important;" valign="top" align="left">
    <div class="section" style="margin-bottom: 40px; padding-bottom: 40px; background: #ffffff;">
      <div class="segment" style="padding-left: 40px; padding-right: 40px;">
                                <table class="spacer" style="border-spacing: 0; border-collapse: collapse; padding: 0; vertical-align: top; text-align: left; width: 100%;" width="100%" valign="top" align="left">
                                  <tbody>
                                    <tr style="padding: 0; vertical-align: top; text-align: left;" valign="top" align="left">
                                      <td height="30" style="word-wrap: break-word; -webkit-hyphens: auto; -moz-hyphens: auto; hyphens: auto; vertical-align: top; color: #0a0a0a; font-family: Helvetica,Arial,sans-serif; font-weight: 400; padding: 0; margin: 0; Margin: 0; text-align: left; mso-line-height-rule: exactly; font-size: 10px; line-height: 10px; border-collapse: collapse!important;" valign="top" align="left">&nbsp;</td>
                                    </tr>
                                  </tbody>
                                </table>
                                <center style="width: 100%; min-width: 580px;">
          <div align="center" class="float-center">
              <div class="image" style="margin-top: 30px; margin-bottom: 30px; padding-left: 40px; padding-right: 40px;">
                <img src=data:image/jpg;base64,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 alt="Ísland.is logo" style="outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; width: auto; max-width: 100%; clear: both; display: block;">
              </div>
          </div>
        </center>
        <center style="width: 100%; min-width: 580px;">
          <div align="center" class="float-center">
              <h1 class="heading text-center size-small" style="padding: 0; margin: 0; Margin: 0; word-wrap: normal; margin-bottom: 10px; Margin-bottom: 10px; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; padding-left: 40px; padding-right: 40px; font-family: 'IBM Plex Sans', Helvetica, Arial, sans-serif; font-weight: 600; color: #00003c; text-align: center; font-size: 24px; line-height: 34px;">
                Staðfesting á netfangi
              </h1>
          </div>
        </center>
        <center style="width: 100%; min-width: 580px;">
          <div align="center" class="float-center">
              <div class="copy size-small style-normal" style="padding-left: 40px; padding-right: 40px; margin-top: 15px; margin-bottom: 15px;">
                <p class="text-center" style="padding: 0; margin: 0; Margin: 0; margin-bottom: 10px; Margin-bottom: 10px; text-align: center; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; font-family: 'IBM Plex Sans', Helvetica, Arial, sans-serif; font-weight: 300; color: #00003c; font-size: 18px; line-height: 28px;">Öryggiskóðinn þinn</p>
              </div>
          </div>
        </center>
        <center style="width: 100%; min-width: 580px;">
          <div align="center" class="float-center">
              <h1 class="heading text-center size-normal" style="padding: 0; margin: 0; Margin: 0; word-wrap: normal; margin-bottom: 10px; Margin-bottom: 10px; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; padding-left: 40px; padding-right: 40px; font-family: 'IBM Plex Sans', Helvetica, Arial, sans-serif; font-weight: 600; font-size: 34px; line-height: 44px; color: #00003c; text-align: center;">
                ${code}
              </h1>
          </div>
        </center>
        <center style="width: 100%; min-width: 580px;">
          <div align="center" class="float-center">
              <div class="copy size-normal style-normal" style="padding-left: 40px; padding-right: 40px; margin-top: 15px; margin-bottom: 15px;">
                <p class="text-center" style="padding: 0; margin: 0; Margin: 0; margin-bottom: 10px; Margin-bottom: 10px; text-align: center; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; font-family: 'IBM Plex Sans', Helvetica, Arial, sans-serif; font-weight: 300; font-size: 24px; line-height: 34px; color: #00003c;">Þetta er öryggiskóðinn þinn til staðfestingar á netfangi. Hann eyðist sjálfkrafa eftir 5 mín, eftir þann tíma þarftu að láta senda nýjan í sama ferli og þú varst að fara gegnum.</p>
              </div>
          </div>
        </center>
        <center style="width: 100%; min-width: 580px;">
          <div align="center" class="float-center">
              <div class="copy size-normal style-normal" style="padding-left: 40px; padding-right: 40px; margin-top: 15px; margin-bottom: 15px;">
                <p class="text-center" style="padding: 0; margin: 0; Margin: 0; margin-bottom: 10px; Margin-bottom: 10px; text-align: center; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; font-family: 'IBM Plex Sans', Helvetica, Arial, sans-serif; font-weight: 300; font-size: 24px; line-height: 34px; color: #00003c;">Vinsamlegst hunsaðu þennan póst ef þú varst ekki að skrá netfangið þitt á Mínum síðum.</p>
              </div>
          </div>
        </center>
        
      </div>
    </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </center>
            </td>
          </tr>
        </table>
    
        <div style="display:none; white-space:nowrap; font:15px courier; line-height:0;"> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div>
      </body>
    </html>
    `
}
