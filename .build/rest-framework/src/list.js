import {getPermissions} from './helpers/permissions.js'
import Server from 'syncano-server'
export default ctx => {
  const server = Server(ctx)
  const {data, users, socket, response, event, logger, instance} = server
  const {model} = ctx.args
  async function listUserModel ({user, owner}) {
    try {
      return response.json(await data[model].where(owner, user))
    } catch (error) {
      return response.json(error)
    }
  }
  async function listModel () {
    try {
      return response.json(await data[model].list())
    } catch (error) {
      return response.json(error)
    }
  }
  async function show () {
    const canSee = await getPermissions(model, 'r', ctx.meta.user, server)
    if (canSee.user) {
      return listUserModel(canSee)
    }
    if (canSee) {
      return listModel()
    }
  }
  return show()
}
