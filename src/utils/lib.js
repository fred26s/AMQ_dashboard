// 时间戳转换为天、小时、分钟
const formatTimeDifference = (timestamp1, timestamp2) => {
  // 计算时间差 (毫秒)
  const difference = Math.abs(timestamp1 - timestamp2)

  // 转换为秒
  const seconds = Math.floor(difference / 1000)

  // 计算分钟
  const minutes = Math.floor(seconds / 60)

  // 计算小时
  const hours = Math.floor(minutes / 60)

  // 计算天数（保留一位小数）
  const days = (hours / 24).toFixed(1)

  // 格式化结果
  return {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  }
}

// 手续费计算，每8小时 0.01%
function calculateFee(hours, amount) {
  // 计算需要收取持仓手续费的次数
  const holdFeeCount = Math.ceil(hours / 8)
  // 持仓手续费
  const holdFee = holdFeeCount * amount * 0.0001

  // 交易手续费 (买卖都是taker，则千分之一)
  const tradeFee = amount * 0.001

  const total = holdFee + tradeFee

  return {
    detail: `${total.toFixed(1)}(${tradeFee.toFixed(1)}+${holdFee.toFixed(1)})`,
    hold: holdFee,
    trade: tradeFee,
    total: total
  }
}

export { formatTimeDifference, calculateFee }
