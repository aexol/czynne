import {getPermissions} from './helpers/permissions.js'
import Server from 'syncano-server'
export default ctx => {
  const server = Server(ctx)
  const {data, users, socket, response, event, logger, instance} = server
  const {model, id} = ctx.args

  return del()

  async function deleteUserModel ({user, owner}) {
    try {
      let ownedModel = await data[model]
        .where(owner, user)
        .where('id', id)
        .firstOrFail()
      return deleteModel()
    } catch (error) {
      return response.json(error)
    }
  }
  async function deleteModel () {
    try {
      return response.json(await data[model].delete(id))
    } catch (error) {
      return response.json(error)
    }
  }
  async function del () {
    const canDelete = await getPermissions(model, 'd', ctx.meta.user, server)
    if (canDelete.user) {
      return deleteUserModel(canDelete)
    }
    if (canDelete) {
      return deleteModel()
    } else {
      return response.json('Insufficent privileges')
    }
  }
}
