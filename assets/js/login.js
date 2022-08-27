$(function () {
  // const cmurl = 'http://big-event-api-t.itheima.net'

  // 点击 去注册账号 的链接
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })

  // 点击 去登录 的链接
  $('#link_login').on('click', function () {
    $('.reg-box').hide()
    $('.login-box').show()
  })

  // 自定义校验规则
  // 从 layui 中获取 form 对象
  const form = layui.form
  const layer = layui.layer
  // 通过 form.verify() 函数自定义校验规则
  form.verify({
    // 自定义了一个叫 pwd 的校验规则
    // 数组格式
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    // 校验两次密码是否一致的规则
    // function格式
    repwd: function (value) {
      // 通过形参拿到的是确认密码框中的内容
      // 还需要拿到密码框中的内容,进行一次是否等于的判断
      // 如果判断失败,则 return 一个提示消息即可
      const pwd = $('.reg-box [name=password]').val()
      if (pwd !== value) {
        return '两次密码不一致！'
      }
    }
  })

  // 监听注册表单的提交事件
  $('#form_reg').on('submit', function (e) {
    // 阻止表单默认提交
    e.preventDefault()
    // 使用 ajax 的 post 请求
    $.post('/api/reguser',
      {
        username: $('#form_reg [name=username]').val(),
        password: $('#form_reg [name=password]').val()
      },
      function (res) {
        // console.log(res)
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg('注册成功，请登录！')
        // 模拟点击跳转到登录
        $('#link_login').click()
        // 原生的
        // $('#link_login')[0].click()
      })

  })

  // 监听登录表单的提交事件 使用 on 是一样的
  $('#form_login').submit(function (e) {
    e.preventDefault()
    $.ajax({
      url: '/api/login',
      method: 'POST',
      // jq 快速获取表单中数据
      data: $(this).serialize(),
      success: function (res) {
        // console.log(res)
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg(res.message)
        // 将token保存到本地存储
        localStorage.setItem('token', res.token)
        location.href = '/index.html'
      }
    })
  })
})
