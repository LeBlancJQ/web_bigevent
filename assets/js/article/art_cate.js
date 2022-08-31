$(function () {
  // 获取文章分类的列表，并渲染
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        // console.log(res)
        const htmlStr = template('tpl-table', res)
        // console.log(htmlStr)
        $('tbody').html(htmlStr)
      }
    })
  }
  initArtCateList()

  const layer = layui.layer
  let indexAdd = null
  // 为添加类别按钮绑定点击事件
  $('#btnAddCate').click(function () {
    indexAdd = layer.open({
      // type 默认是 0 信息框，1 是页面层
      type: 1,
      // area 设置宽高
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html()
    })
  })

  // 通过事件代理，为 form-add 表单增加事件
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('新增分类失败！')
        }
        // 获取文章分类的列表，并渲染
        initArtCateList()
        layer.msg('新增分类成功！')
        // 根据索引，关闭弹出层
        // console.log(indexAdd)
        layer.close(indexAdd)
      }
    })
  })

  // 通过代理，为 btn-edit 按钮绑定事件
  let indexEdit = null
  const form = layui.form
  $('tbody').on('click', '.btn-edit', function (e) {
    // 弹出一个修改文章分类信息的层
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html()
    })

    const id = $(this).attr('data-id')

    // 发起请求获取对应分类的数据
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        // console.log(res)
        form.val('form-edit', res.data)
      }
    })

  })

  // 通过代理，为修改分类的表单绑定 submit 事件
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新分类数据失败！')
        }
        layer.msg('更新分类数据成功！')
        layer.close(indexEdit)
        initArtCateList()
      }
    })
  })

  // 通过代理，为删除按钮绑定点击事件
  $('tbody').on('click', '.btn-delete', function () {
    const id = $(this).attr('data-id')
    // 提示用户是否删除
    layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除分类失败！')
          }
          layer.msg('删除分类成功！')
          layer.close(index)
          initArtCateList()

        }
      })
    })
  })

})
