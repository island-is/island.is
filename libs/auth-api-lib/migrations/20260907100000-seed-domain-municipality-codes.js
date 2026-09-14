const MUNICIPALITY_CODES = {
  '@akranes.is': '3000', // Akraneskaupstaður
  '@akureyri.is': '6000', // Akureyrarbær
  '@arborg.is': '8200', // Sveitarfélagið Árborg
  '@bolungarvik.is': '4100', // Bolungarvíkurkaupstaður
  '@borgarbyggd.is': '3609', // Borgarbyggð
  '@dalir.is': '3811', // Dalabyggð
  '@dalvikurbyggd.is': '6400', // Dalvíkurbyggð
  '@esveit.is': '6513', // Eyjafjarðarsveit
  '@fjallabyggd.is': '6250', // Fjallabyggð
  '@fjardabyggd.is': '7300', // Fjarðabyggð
  '@floahreppur.is': '8722', // Flóahreppur
  '@fludir.is': '8710', // Hrunamannahreppur
  '@gardabaer.is': '1300', // Garðabær
  '@grindavik.is': '2300', // Grindavíkurbær
  '@grundarfjordur.is': '3709', // Grundarfjarðarbær
  '@hafnarfjordur.is': '1400', // Hafnarfjarðarkaupstaður
  '@horgarsveit.is': '6515', // Hörgársveit
  '@hornafjordur.is': '8401', // Sveitarfélagið Hornafjörður
  '@hunabyggd.is': '5613', // Húnabyggð
  '@hvalfjardarsveit.is': '3511', // Hvalfjarðarsveit
  '@hveragerdi.is': '8716', // Hveragerðisbær
  '@hvolsvollur.is': '8613', // Rangárþing eystra
  '@isafjordur.is': '4200', // Ísafjarðarbær
  '@kjos.is': '1606', // Kjósarhreppur
  '@klaustur.is': '8509', // Skaftárhreppur
  '@kopavogur.is': '1000', // Kópavogsbær
  '@langanesbyggd.is': '6710', // Langanesbyggð
  '@mos.is': '1604', // Mosfellsbær
  '@mulathing.is': '7400', // Múlaþing
  '@nordurthing.is': '6100', // Norðurþing
  '@olfus.is': '8717', // Sveitarfélagið Ölfus
  '@reykjanesbaer.is': '2000', // Reykjanesbær
  '@reykjavik.is': '0000', // Reykjavíkurborg
  '@ry.is': '8614', // Rangárþing ytra
  '@seltjarnarnes.is': '1100', // Seltjarnarnesbær
  '@skagafjordur.is': '5716', // Skagafjörður
  '@skeidgnup.is': '8720', // Skeiða- og Gnúpverjahreppur
  '@snb.is': '3714', // Snæfellsbær
  '@strandabyggd.is': '4911', // Strandabyggð
  '@sudurnesjabaer.is': '2510', // Suðurnesjabær
  '@thingeyjarsveit.is': '6613', // Þingeyjarsveit
  '@vestmannaeyjar.is': '8000', // Vestmannaeyjabær
  '@vesturbyggd.is': '4604', // Vesturbyggð
  '@vik.is': '8508', // Mýrdalshreppur
  '@vogar.is': '2506', // Sveitarfélagið Vogar
}

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      for (const [name, code] of Object.entries(MUNICIPALITY_CODES)) {
        await queryInterface.sequelize.query(
          `UPDATE domain
             SET municipality_code = :code
           WHERE name = :name
             AND municipality_code IS NULL`,
          { replacements: { name, code }, transaction },
        )
      }
    })
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      for (const [name, code] of Object.entries(MUNICIPALITY_CODES)) {
        await queryInterface.sequelize.query(
          `UPDATE domain
             SET municipality_code = NULL
           WHERE name = :name
             AND municipality_code = :code`,
          { replacements: { name, code }, transaction },
        )
      }
    })
  },
}
