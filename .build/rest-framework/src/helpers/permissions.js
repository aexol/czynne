export async function getPermissions (model, permission_type, user, server) {
  const {data, response} = server
  const ccc = await getConfig()
  const {models = [], logged_in = [], object_level = []} = ccc
  if (models.indexOf(model) === -1) {
    notInModels()
  }
  try {
    const loggedInPermissions = logged_in.filter(
      p => hasPermission(p, permission_type) && p.model === model
    )
    if (loggedInPermissions.length && typeof user === undefined) {
      return notLoggedIn()
    }
    for (let p of loggedInPermissions) {
      if (p.users && p.users.indexOf(user.id) === -1) {
        return notAnOwner()
      }
    }
    const objectLevelPermissions = object_level.filter(
      p => hasPermission(p, permission_type) && p.model === model
    )
    if (objectLevelPermissions.length && typeof user === undefined) {
      return false
    }
    for (let p of objectLevelPermissions) {
      return {
        user,
        owner: p.owner_field
      }
    }
    return true
  } catch ({data}) {
    return true
  }
  function hasPermission (o, p) {
    return o.type.indexOf(p) !== -1
  }
  function notLoggedIn (response) {
    return response.json({
      status: 403,
      error: 'User not logged in'
    })
  }
  function notAnOwner (response) {
    return response.json({
      status: 403,
      error: 'This user is not an owner user of this model'
    })
  }
  function notInModels (response) {
    return response.json({
      status: 403,
      error: 'This model is not added to rest-framework socket config. Please add it to models'
    })
  }
  async function getConfig () {
    try {
      return (await data.rest_framework_config_class.firstOrFail()).config
    } catch (badResponse) {
      return response.json({
        status: 'No config. Please configure rest framework: s call rest-framework/configure'
      })
    }
  }
}
