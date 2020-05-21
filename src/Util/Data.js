
import dadosHist from './dadosHist.js'

export const getCurrent = (type) => {
  if (type in dadosHist) {
    return dadosHist[type][dadosHist[type].length-1].value
  } else {
    return null
  }
}

export const getHist = (type) => {
  if (type in dadosHist) {
    let series = [[],[]]
    for (const item in dadosHist[type]) {
      series[0].push(new Date(dadosHist[type][item].year, dadosHist[type][item].month, 0).getTime())
      series[1].push(dadosHist[type][item].value)
    }
    return series
  } else {
    return null
  }
}
// let host="192.168.0.101"
// export const getCurrent = (type) => {
//   return new Promise( (resolve,reject) => {
//     request('http://'+host+':4000/graphql', `{ current(type: "${type}") }`)
//     .then(data => {
//       if (!data)
//         reject("No data for "+type)
//       resolve(data.current)
//     })
//   })
// }
//
// export const getHist = (type) => {
//   return new Promise( (resolve,reject) => {
//     request('http://'+host+':4000/graphql',
//       `{
//         hist(type: "${type}") {
//           year
//           month
//           value
//         }
//       }`).then(data => {
//         if (!data)
//           reject("No data for "+type)
//         let series = [[],[]]
//         for (const item in data.hist) {
//           series[0].push(new Date(data.hist[item].year, data.hist[item].month, 0).getTime())
//           series[1].push(data.hist[item].value)
//         }
//         resolve(series)
//     })
//   })
// }
