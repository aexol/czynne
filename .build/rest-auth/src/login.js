/* global META, ARGS */
import fetch from 'axios'

import Server from 'syncano-server'
export default async ctx => {
  const {data, users, socket, response, event, logger, instance} = Server(ctx)
  const {username, password} = ctx.args
  const AUTH_URL = `https://api.syncano.io/v2/instances/${ctx.meta.instance}/users/auth/`
  try {
    const resp = await fetch({
      url: AUTH_URL,
      method: 'POST',
      data: {username, password},
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': ctx.meta.token
      }
    })
    return response.json({
      username: resp.data.username,
      token: resp.data.user_key
    })
  } catch (error) {
    return respondWithInvalidCredentials()
  }
  function respondWithInvalidCredentials () {
    return response.json({message: 'Given credentials are invalid.'}, 400)
  }
}
