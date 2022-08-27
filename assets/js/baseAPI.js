// 注意每次调用 jq 里的 ajax 方法时，会先调用这个函数
// 在这个函数里，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
  console.log(options)
  // 在发起真正的 ajax 请求之前，统一拼接请求的根路径
  options.url = 'http://big-event-api-t.itheima.net' + options.url
  console.log(options.url)
})