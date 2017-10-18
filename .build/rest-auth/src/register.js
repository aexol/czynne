/* global ARGS */
import {isEmail} from './helpers'
import Server from 'syncano-server'
export default ctx => {
  const {data, users, socket, response, event, logger, instance} = Server(ctx)
  const {username, password} = ctx.args
  register()
  function register () {
    if (isEmail(username)) {
      users
        .where('username', 'eq', username)
        .firstOrFail()
        .then(respondWithUserAlreadyExists)
        .catch(createUser)
    } else {
      return respondWithInvalidEmail()
    }

    function createUser () {
      const user = {
        username,
        password
      }

      users.create(user).then(respondWithUser).catch(respondWithError)
    }

    function respondWithUser (res) {
      return response.json({
        id: res.id,
        token: res.user_key,
        email: res.email
      })
    }

    function respondWithError ({response: err}) {
      err.json().then(data =>  response.json(data, 400))
    }

    function respondWithUserAlreadyExists () {
      return response.json({username: 'User already exists.'}, 400)
    }

    function respondWithInvalidEmail () {
      return response.json({username: 'Given email is invalid.'}, 400)
    }
  }
}
