/*
关于axios的配置：https://axios.nuxtjs.org/options
*/
export default function ({ $axios, store }) {
  // 在请求时，从store中获取token信息并附加到请求头
  $axios.onRequest((config) => {
    if (store.state.token.Authorization !== null) {
      config.headers.Authorization = store.state.token.Authorization
    }
  }
  )
  // 响应时的操作
  $axios.onResponse((response) => {

  })
  // 错误时的操作
  $axios.onError((error) => {

  })
  // 请求错误时的操作
  $axios.onRequestError((err) => {

  })
  // 相应错误时的操作
  $axios.onResponseError((err) => {

  })
}
