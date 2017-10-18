/* global META, ARGS */
import fetch from 'axios'
import Server from 'syncano-server'
export default async ctx => {
  const {data, users, socket, response, event, logger, instance} = Server(ctx)
  const {username, token} = ctx.args
  try {
    const u = await users.where('username', username).firstOrFail()
    if (u.user_key !== token) {
      return response.json({
        valid: false
      })
    }
    return response.json({
      valid: true
    })
  } catch (error) {
    return response.json(error)
  }
}
