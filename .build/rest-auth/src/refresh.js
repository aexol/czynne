/* global META, ARGS */
import fetch from 'axios'
const debug = logger('rest-auth')
import Server from 'syncano-server'
export default async ctx => {
  const {data, users, socket, response, event, logger, instance} = Server(ctx)
  const AUTH_URL = id =>
    `https://api.syncano.io/v2/instances/${ctx.meta.instance}/users/${id}/reset_key/`
  const {username, token} = ctx.args
  try {
    const u = await users.where('username', username).firstOrFail()
    if (u.user_key !== token) {
      return response.json({
        valid: false
      })
    }

    const resp = await fetch({
      url: AUTH_URL(u.id),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': ctx.meta.token
      }
    })
    return response.json({
      token: resp.user_key
    })
  } catch (error) {
    return response.json(error)
  }
}
