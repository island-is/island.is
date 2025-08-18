const calculateVikmork = (tala: number) => {
  let vikmork = 0
  if (tala) {
    if (tala === 0) {
      vikmork = 0
    } else if (tala >= 1 && tala <= 100) {
      vikmork = 3
    } else if (tala >= 101 && tala <= 133) {
      vikmork = 4
    } else if (tala >= 134 && tala <= 167) {
      vikmork = 5
    } else if (tala >= 168) {
      vikmork = 6
    } else {
      vikmork = 0
    }
  } else {
    vikmork = 0
  }
  return vikmork
}

/** Implementation was taken from https://sektir.logreglan.is on the 28th of May 2025 */
export const calculateSpeedMeasurementFine = (
  aa: number,
  b: number,
  over3500kgOrWithTrailer: boolean,
) => {
  const vidmid = calculateVikmork(aa)
  const a = aa - vidmid
  let sekt = 0
  let punktar = 0
  let manudurmissa = 0
  let akaera = 0
  if (b === 15) {
    if (a >= 16 && a <= 30) {
      sekt = 20000
      punktar = 0
      manudurmissa = 0
      akaera = 0
    } else if (a >= 31 && a <= 40) {
      sekt = 30000
      punktar = 3
      manudurmissa = 0
      akaera = 0
    } else if (a >= 41 && a <= 45) {
      sekt = 40000
      punktar = 3
      manudurmissa = 0
      akaera = 0
    } else if (a >= 46 && a <= 50) {
      sekt = 50000
      punktar = 3
      manudurmissa = 0
      akaera = 0
    } else if (a >= 51) {
      sekt = 50000
      punktar = 3
      manudurmissa = 0
      akaera = 1
    }
  } else if (b === 30) {
    if (a >= 36 && a <= 40) {
      sekt = 10000
      punktar = 0
      manudurmissa = 0
      akaera = 0
    } else if (a >= 41 && a <= 45) {
      sekt = 20000
      punktar = 0
      manudurmissa = 0
      akaera = 0
    } else if (a >= 46 && a <= 50) {
      sekt = 30000
      punktar = 1
      manudurmissa = 0
      akaera = 0
    } else if (a >= 51 && a <= 55) {
      sekt = 40000
      punktar = 2
      manudurmissa = 0
      akaera = 0
    } else if (a >= 56 && a <= 60) {
      sekt = 50000
      punktar = 3
      manudurmissa = 0
      akaera = 0
    } else if (a >= 61 && a <= 65) {
      sekt = 70000
      punktar = 3
      manudurmissa = 3
      akaera = 0
    } else if (a >= 66 && a <= 70) {
      sekt = 90000
      punktar = 3
      manudurmissa = 3
      akaera = 0
    } else if (a >= 71 && a <= 75) {
      sekt = 120000
      punktar = 3
      manudurmissa = 3
      akaera = 0
    } else if (a >= 76) {
      sekt = 120000
      punktar = 3
      manudurmissa = 3
      akaera = 1
    }
  } else if (b === 40) {
    if (a >= 46 && a <= 50) {
      sekt = 10000
      punktar = 0
      manudurmissa = 0
      akaera = 0
    } else if (a >= 51 && a <= 55) {
      sekt = 20000
      punktar = 1
      manudurmissa = 0
      akaera = 0
    } else if (a >= 56 && a <= 60) {
      sekt = 30000
      punktar = 2
      manudurmissa = 0
      akaera = 0
    } else if (a >= 61 && a <= 65) {
      sekt = 40000
      punktar = 3
      manudurmissa = 0
      akaera = 0
    } else if (a >= 66 && a <= 70) {
      sekt = 50000
      punktar = 3
      manudurmissa = 0
      akaera = 0
    } else if (a >= 71 && a <= 75) {
      sekt = 60000
      punktar = 3
      manudurmissa = 0
      akaera = 0
    } else if (a >= 76 && a <= 80) {
      sekt = 80000
      punktar = 3
      manudurmissa = 3
      akaera = 0
    } else if (a >= 81 && a <= 85) {
      sekt = 90000
      punktar = 3
      manudurmissa = 3
      akaera = 0
    } else if (a >= 86 && a <= 90) {
      sekt = 120000
      punktar = 3
      manudurmissa = 3
      akaera = 0
    } else if (a >= 91) {
      sekt = 120000
      punktar = 3
      manudurmissa = 3
      akaera = 1
    }
  } else if (b === 50) {
    if (a >= 56 && a <= 60) {
      sekt = 10000
      punktar = 0
      manudurmissa = 0
      akaera = 0
    } else if (a >= 61 && a <= 65) {
      sekt = 20000
      punktar = 0
      manudurmissa = 0
      akaera = 0
    } else if (a >= 66 && a <= 70) {
      sekt = 30000
      punktar = 0
      manudurmissa = 0
      akaera = 0
    } else if (a >= 71 && a <= 75) {
      sekt = 40000
      punktar = 0
      manudurmissa = 0
      akaera = 0
    } else if (a >= 76 && a <= 80) {
      sekt = 50000
      punktar = 1
      manudurmissa = 0
      akaera = 0
    } else if (a >= 81 && a <= 85) {
      sekt = 60000
      punktar = 2
      manudurmissa = 0
      akaera = 0
    } else if (a >= 86 && a <= 90) {
      sekt = 70000
      punktar = 3
      manudurmissa = 0
      akaera = 0
    } else if (a >= 91 && a <= 95) {
      sekt = 80000
      punktar = 3
      manudurmissa = 0
      akaera = 0
    } else if (a >= 96 && a <= 100) {
      sekt = 100000
      punktar = 3
      manudurmissa = 0
      akaera = 0
    } else if (a >= 101 && a <= 110) {
      sekt = 150000
      punktar = 3
      manudurmissa = 3
      akaera = 0
    } else if (a >= 111 && a <= 120) {
      sekt = 180000
      punktar = 3
      manudurmissa = 3
      akaera = 0
    } else if (a >= 121 && a <= 130) {
      sekt = 210000
      punktar = 3
      manudurmissa = 3
      akaera = 0
    } else if (a >= 131) {
      sekt = 210000
      punktar = 3
      manudurmissa = 3
      akaera = 1
    }
  } else if (b === 60) {
    if (a >= 66 && a <= 70) {
      sekt = 10000
      punktar = 0
      manudurmissa = 0
      akaera = 0
    } else if (a >= 71 && a <= 75) {
      sekt = 20000
      punktar = 0
      manudurmissa = 0
      akaera = 0
    } else if (a >= 76 && a <= 80) {
      sekt = 30000
      punktar = 0
      manudurmissa = 0
      akaera = 0
    } else if (a >= 81 && a <= 85) {
      sekt = 40000
      punktar = 0
      manudurmissa = 0
      akaera = 0
    } else if (a >= 86 && a <= 90) {
      sekt = 50000
      punktar = 1
      manudurmissa = 0
      akaera = 0
    } else if (a >= 91 && a <= 95) {
      sekt = 70000
      punktar = 2
      manudurmissa = 0
      akaera = 0
    } else if (a >= 96 && a <= 100) {
      sekt = 80000
      punktar = 3
      manudurmissa = 0
      akaera = 0
    } else if (a >= 101 && a <= 110) {
      sekt = 100000
      punktar = 3
      manudurmissa = 0
      akaera = 0
    } else if (a >= 111 && a <= 120) {
      sekt = 130000
      punktar = 3
      manudurmissa = 1
      akaera = 0
    } else if (a >= 121 && a <= 130) {
      sekt = 180000
      punktar = 3
      manudurmissa = 3
      akaera = 0
    } else if (a >= 131 && a <= 140) {
      sekt = 210000
      punktar = 3
      manudurmissa = 3
      akaera = 0
    } else if (a >= 141) {
      sekt = 210000
      punktar = 3
      manudurmissa = 3
      akaera = 1
    }
  } else if (b === 70) {
    if (a >= 76 && a <= 80) {
      sekt = 10000
      punktar = 0
      manudurmissa = 0
      akaera = 0
    } else if (a >= 81 && a <= 85) {
      sekt = 20000
      punktar = 0
      manudurmissa = 0
      akaera = 0
    } else if (a >= 86 && a <= 90) {
      sekt = 30000
      punktar = 0
      manudurmissa = 0
      akaera = 0
    } else if (a >= 91 && a <= 95) {
      sekt = 50000
      punktar = 0
      manudurmissa = 0
      akaera = 0
    } else if (a >= 96 && a <= 100) {
      sekt = 70000
      punktar = 1
      manudurmissa = 0
      akaera = 0
    } else if (a >= 101 && a <= 110) {
      sekt = 90000
      punktar = 2
      manudurmissa = 0
      akaera = 0
    } else if (a >= 111 && a <= 120) {
      sekt = 110000
      punktar = 3
      manudurmissa = 0
      akaera = 0
    } else if (a >= 121 && a <= 130) {
      sekt = 130000
      punktar = 3
      manudurmissa = 1
      akaera = 0
    } else if (a >= 131 && a <= 140) {
      sekt = 180000
      punktar = 3
      manudurmissa = 2
      akaera = 0
    } else if (a >= 141 && a <= 150) {
      sekt = 230000
      punktar = 3
      manudurmissa = 3
      akaera = 0
    } else if (a >= 151) {
      sekt = 230000
      punktar = 3
      manudurmissa = 3
      akaera = 1
    }
  } else if (b === 80) {
    if (a >= 86 && a <= 90) {
      sekt = 20000
      punktar = 0
      manudurmissa = 0
      akaera = 0
    } else if (a >= 91 && a <= 95) {
      sekt = 30000
      punktar = 0
      manudurmissa = 0
      akaera = 0
    } else if (a >= 96 && a <= 100) {
      sekt = 50000
      punktar = 0
      manudurmissa = 0
      akaera = 0
    } else if (a >= 101 && a <= 110) {
      sekt = 80000
      punktar = 1
      manudurmissa = 0
      akaera = 0
    } else if (a >= 111 && a <= 120) {
      sekt = 100000
      punktar = 2
      manudurmissa = 0
      akaera = 0
    } else if (a >= 121 && a <= 130) {
      sekt = 130000
      punktar = 3
      manudurmissa = 0
      akaera = 0
    } else if (a >= 131 && a <= 140) {
      sekt = 180000
      punktar = 3
      manudurmissa = 1
      akaera = 0
    } else if (a >= 141 && a <= 150) {
      sekt = 230000
      punktar = 3
      manudurmissa = 2
      akaera = 0
    } else if (a >= 151 && a <= 160) {
      sekt = 250000
      punktar = 3
      manudurmissa = 3
      akaera = 0
    } else if (a >= 161) {
      sekt = 250000
      punktar = 3
      manudurmissa = 3
      akaera = 1
    }
  } else if (b === 90) {
    if (a >= 96 && a <= 100) {
      sekt = 20000
      punktar = 0
      manudurmissa = 0
      akaera = 0
    } else if (a >= 101 && a <= 110) {
      sekt = 50000
      punktar = 0
      manudurmissa = 0
      akaera = 0
    } else if (a >= 111 && a <= 120) {
      sekt = 80000
      punktar = 1
      manudurmissa = 0
      akaera = 0
    } else if (a >= 121 && a <= 130) {
      sekt = 120000
      punktar = 2
      manudurmissa = 0
      akaera = 0
    } else if (a >= 131 && a <= 140) {
      sekt = 150000
      punktar = 3
      manudurmissa = 0
      akaera = 0
    } else if (a >= 141 && a <= 150) {
      sekt = 210000
      punktar = 3
      manudurmissa = 1
      akaera = 0
    } else if (a >= 151 && a <= 160) {
      sekt = 230000
      punktar = 3
      manudurmissa = 2
      akaera = 0
    } else if (a >= 161 && a <= 170) {
      sekt = 250000
      punktar = 3
      manudurmissa = 3
      akaera = 0
    } else if (a >= 171) {
      sekt = 250000
      punktar = 3
      manudurmissa = 3
      akaera = 1
    }
  }
  let twentyPercentLoad = false
  if (over3500kgOrWithTrailer) {
    sekt = sekt + sekt * 0.2
    twentyPercentLoad = true
  }

  if (akaera === 1) {
    return {
      nidurstada: a,
      vikmork: vidmid,
      akaera: true,
    }
  } else {
    return {
      nidurstada: a,
      vikmork: vidmid,
      akaera: false,
      punktar,
      twentyPercentLoad,
      manudurmissa,
      sekt,
    }
  }
}
