$(function () {
  const form = layui.form

  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称长度必须在1 ~ 6个字符之间！'
      }
    }
  })

  initUserInfo()

  // 初始化用户的基本信息
  const layer = layui.layer
  function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.msg)
        }
        // console.log(res)
        // 调用 form.val() 快速为表单赋值
        form.val('formUserInfo', res.data)
      }
    })
  }

  // 重置表单的数据
  $('#btnReset').on('click', function (e) {
    // 重置表单元素，默认带重置功能，阻止表单的重置行为
    e.preventDefault()
    // 再次调用，即可把用户信息重新填入
    initUserInfo()
  })

  // 监听表单的提交事件
  $('.layui-form').on('submit', function (e) {
    // 阻止表单的默认提交行为
    e.preventDefault()
    // 发起ajax请求
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新用户资料失败!')
        }
        layer.msg('更新用户资料成功!')
        // 调用父页面中的方法，重新渲染用户头像和用户信息
        window.parent.getUserInfo()
      }
    })
  })

})