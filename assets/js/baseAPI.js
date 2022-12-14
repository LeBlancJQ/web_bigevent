// 注意每次调用 jq 里的 ajax 方法时，会先调用这个函数
// 在这个函数里，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
  // console.log(options)
  // 在发起真正的 ajax 请求之前，统一拼接请求的根路径
  // http://www.liulongbin.top:3007 http://big-event-api-t.itheima.net
  options.url = 'http://big-event-api-t.itheima.net' + options.url
  // console.log(options.url)

  // 统一为有权限的接口，设置 headers 请求头
  // /my 的是需要权限的
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }

  // 全局统一挂载 complete 回调函数
  // 不论成功还是失败，最终都会调用这个函数
  options.complete = function (res) {
    // console.log('执行了 complete 回调')
    // 在 complete 回调函数中，可以使用 responseJSON 拿到服务器响应回来的数据
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      // 1. 强制清空 token, 如果是手写的假 token ，就清空
      localStorage.removeItem('token')
      // 2. 强制跳转到登录页面
      location.href = 'login.html'
    }
  }


})