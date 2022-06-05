import axios from "axios"


export function request(config) {
  // 1.创建实例
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:7878/api/hy66/',
    timeout: 5000
  })
  // 2. axios拦截器
  instance.interceptors.request.use(config => {
      return config
    },
    error => {
      // console.log(error);
    })

  instance.interceptors.response.use(resp => {
    // console.log(resp);
    // 放行
    return resp.data
  }, error => {
    console.log(error);
  })

  // 3.发送真正的网络请求
  return instance(config)
}
