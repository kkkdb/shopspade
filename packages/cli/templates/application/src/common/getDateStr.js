export { getDateDiff, getDateStr, timestampToTime }

// 获取当前时间
function getDateStr(AddDayCount, hms) {
  const dd = new Date()
  dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期
  const y = dd.getFullYear()
  const M = dd.getMonth() + 1 < 10 ? `0${dd.getMonth() + 1}` : dd.getMonth() + 1 // 获取当前月份的日期，不足10补0
  const d = dd.getDate() < 10 ? `0${dd.getDate()}` : dd.getDate() // 获取当前几号，不足10补0
  const H = dd.getHours() < 10 ? `0${dd.getHours()}` : dd.getHours()
  const m = dd.getMinutes() < 10 ? `0${dd.getMinutes()}` : dd.getMinutes()
  const s = dd.getSeconds() < 10 ? `0${dd.getSeconds()}` : dd.getSeconds()
  if (hms) {
    return `${y}-${M}-${d} ${H}:${m}:${s}`
  }
  return `${y}-${M}-${d}`
}

// 时间戳转换成时间格式
function timestampToTime(timestamp) {
  const dd = new Date()
  dd.setTime(timestamp)
  const y = dd.getFullYear()
  const M = dd.getMonth() + 1 < 10 ? `0${dd.getMonth() + 1}` : dd.getMonth() + 1 // 获取当前月份的日期，不足10补0
  const d = dd.getDate() < 10 ? `0${dd.getDate()}` : dd.getDate() // 获取当前几号，不足10补0
  const H = dd.getHours() < 10 ? `0${dd.getHours()}` : dd.getHours()
  const m = dd.getMinutes() < 10 ? `0${dd.getMinutes()}` : dd.getMinutes()
  const s = dd.getSeconds() < 10 ? `0${dd.getSeconds()}` : dd.getSeconds()
  return `${y}-${M}-${d} ${H}:${m}:${s}`
}

// 获取两个时间的时间差
function getDateDiff(startDate, endDate) {
  const s1 = new Date(startDate)
  const s2 = endDate ? new Date(endDate) : new Date()
  const time = s2.getTime() - s1.getTime()
  const days = Number.parseInt(time / (1000 * 60 * 60 * 24))
  return days
}
