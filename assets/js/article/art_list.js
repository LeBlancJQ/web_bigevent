$(function () {
  // 定义一个查询的参数对象，将来请求数据的时候
  // 需要将请求参数对象提交到服务器
  const q = {
    pagenum: 1,    // 页码值，默认是 第一页
    pagesize: 2,   // 每页显示几条数据，默认是 2 条
    cate_id: '',   // 文章分类的 Id  
    state: ''      // 文章的发布状态
  }

  const layer = layui.layer
  // 获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        // console.log(res)
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！')
        }
        // 使用模板引擎渲染页面的数据
        const htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)

        // 调用渲染分页的方法, 传入总条数
        renderPage(res.total)
      }
    })
  }

  initTable()

  // 定义格式化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)
    const y = dt.getFullYear()
    const m = padZero(dt.getMonth() + 1)
    const d = padZero(dt.getDate())

    const hh = padZero(dt.getHours())
    const mm = padZero(dt.getMinutes())
    const ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ': ' + mm + ': ' + ss
  }

  // 给时间补充 0 的函数
  function padZero(n) {
    // 小于 10 才补零
    if (n < 10) {
      return '0' + n
    } else {
      return n
    }
  }

  // 初始化文章分类的方法
  const form = layui.form
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败！')
        }
        // 调用模板引擎渲染分类的可选项
        const htmlStr = template('tpl-cate', res)
        // console.log(htmlStr)
        $('[name=cate_id]').html(htmlStr)

        // 通知 layui 重新渲染表单区域的 UI 结构
        form.render()
      }
    })
  }
  initCate()

  // 为筛选表单绑定 submit 事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    // 获取表单中选中的值
    const cate_id = $('[name=cate_id]').val()
    const state = $('[name=state]').val()
    console.log(cate_id, state);
    // 为查询参数对象 q 中对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    // console.log(q);
    // 根据最新的筛选条件，重新渲染表格数据
    initTable()
  })

  // 定义渲染分页的方法
  const laypage = layui.laypage
  function renderPage(total) {
    // 调用 laypage.render() 方法来渲染分页
    laypage.render({
      // 不用加 #
      elem: 'pageBox',     // 分页容器的 Id
      count: total,        // 总数据条数
      limit: q.pagesize,   // 每页显示几条数据
      curr: q.pagenum,      // 设置默认被选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      // 分页发生切换的时候，触发这个 jump 回调
      // 触发 jump 回调的方式有两种：
      // 1. 点击页码的时候，会触发 jump 回调
      // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
      jump: function (obj, first) {
        // console.log(obj.curr, obj.limit, obj.groups)
        // 把最新的页码值，赋值到 q 这个查询参数对象中
        q.pagenum = obj.curr
        // 把最新的条目，赋值到 q 这个查询参数对象中
        q.pagesize = obj.limit
        // 如果是通过 laypage.render() 触发的jump，第二个参数返回 true，第一种返回 undefined
        // console.log(first)
        // 根据最新的页码，重新渲染表格数据
        // initTable()
        if (!first) {
          initTable()
        }
      }
    })
  }

  // 通过代理的形式，为删除按钮绑定点击事件处理函数
  $('tbody').on('click', '.btn-delete', function () {
    // 获取删除按钮的个数,判断当前页还有几条数据
    const len = $('.btn-delete').length
    // console.log(len)
    // 获取到文章的 id
    const id = $(this).attr('data-id')
    // 询问用户是否要删除数据
    layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          // console.log(res)
          if (res.status !== 0) {
            return layer.msg('删除文章失败！')
          }
          layer.msg('删除文章成功！')
          // 这时页码还是 3，所以下面渲染加载的还是第三页，是没有内容
          // 所以，当删除完成时，需要判断当前页是否还有数据，如果没有数据了，要让页码值减1，再调用渲染方法
          if (len === 1) {
            // 如果 len 等于 1，说明删除完成后，当前页没有数据了，页码值就需要减1
            // 页码值不能小于1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }

          initTable()
        }
      })

      layer.close(index);
    });
  })

})