/* 公共的工具函数 */
import that from '../main' // 引入vue的实例，并直接使用其属性方法

/**
 * 表单验证
 * @param {*} ref
 */
const verifyForm = (ref) => {
  let ok = false

  ref.validate((valid) => {
    if (valid) {
      ok = true
    } else {
      ok = false
    }
  })
  return ok
}

/**
 * 下载base64格式文件
 * @param {*} b64 - b64文件编码
 * @param {String} file_name - 命名的名称
 */
const downloadBase64Img = (b64, file_name) => {
  // 创建隐藏的可下载链接
  let eleLink = document.createElement('a')

  eleLink.download = file_name
  eleLink.style.display = 'none'
  eleLink.href = b64
  // 触发点击
  document.body.appendChild(eleLink)
  eleLink.click()
  // 然后移除
  document.body.removeChild(eleLink)
}

/**
 * 路由中分页器参数的设置
 *    因为筛选如果是抽屉组件，那么分页器的数据又需要提取到全局store中，又要增加一个变量太麻烦了
 *    其次不直接在使用 itv-pagination 组件的地方，传入 current 和 page-size，感觉再创建一个变量太麻烦了
 *
 *    重置分页组件的值的页面（模块）可能不包含分页组件，不能够直接修改分页器的值（比如一个页面分为筛选页面，列表页面等，这时可能分页组件的值需要存放在父容器中/全局的store中）为了避免这些，才将分页器的值提出在路由中，直接操作路由的参数
 */
const pagination = {
  params: () => {
    return (
      that.$global.utils.pagination.get() ||
      that.$global.consts.PAGINATION_DEFAULT
    )
  }, // 获取分页参数，给后端的
  /* 注意： reset 后，若要获取最新的 params 值，需要将获取 params 的函数 写在 $nextTick 中，因为 Pagination 中 watch 的执行优先级比较低， 最后才会执行 */
  reset: () => {
    let query = { ...that.$route.query, page_reset: Date.now() } // 保留原本的参数

    that.$router.replace({
      name: that.$route.name,
      query
    })
  },
  set: (page, per_page) => {
    let query = { ...that.$route.query, page, per_page } // 保留原本的参数

    delete query.page_reset

    that.$router.replace({
      name: that.$route.name,
      query
    })
  },
  get: () => {
    const { page, per_page } = that.$route.query
    const res = { page, per_page }

    return page && per_page ? res : null
  }
}

/**
 * 需要注册的工具函数
 */
const UTILS = {
  verifyForm,
  pagination,
  downloadBase64Img
}

export default UTILS
