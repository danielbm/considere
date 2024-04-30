
export const maxArray = (arr) => {
  if (!arr)
    return -1
  let maxId = 0
  for (let i=1;i<arr[1].length;i++) {
    if (arr[1][i] > arr[1][maxId]) {
      maxId = i
    }
  }
  return [arr[0][maxId], arr[1][maxId]]
}

export const minArray = (arr) => {
  if (!arr)
    return -1
  let minId = 0
  for (let i=1;i<arr[1].length;i++) {
    if (arr[1][i] < arr[1][minId]) {
      minId = i
    }
  }
  return [arr[0][minId], arr[1][minId]]
}

export const getMonthYear = (timestamp) => {
  return ("0"+String(Number(new Date(timestamp).getMonth())+1)).slice(-2)+"/"+new Date(timestamp).getFullYear()
}

export const formatPercentage = (num) => {
  return num.toFixed(2)+'%'
}
export const formatNumber = (text, style) => {
  if (style === 'currency') {
    return new Intl.NumberFormat('pt-BR', { style: style, currency: 'BRL'}).format(text)
  } else if (style === 'percentage') {
    return text+'%'
  } else {
    return text
  }
}
