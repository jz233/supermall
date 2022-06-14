// 防抖动函数，防止每次加载一个图片就执行一次refresh()函数，减少频率
export function debounce(func, delay) {
  let timer = null
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
