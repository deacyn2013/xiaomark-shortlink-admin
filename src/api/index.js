/**
 * 接口模块入口文件
 * 提供全局拦截器，每个模块都需在本文件中引入并导出
 * @authors Pony <mycnj123@gmail.com>
 */
import Admin from './modules/admin'
import User from './modules/user'
import Link from './modules/link'
import Qr from './modules/qr'

export default {
  Qr,
  User,
  Admin,
  Link
}
