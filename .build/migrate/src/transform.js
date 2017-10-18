import FormData from 'form-data'
import axios from 'axios'
const tempImage = 'data:image/gif;base64,R0lGODlhAQABAAAAACw='
const transformFile = async f => {
  const {value, type} = f
  const bufferFile = await axios.get(value, {responseType: 'arraybuffer'})
  const buffer = Buffer.from(bufferFile.data, 'binary')
  return [buffer, {filename: 'elo.png', filetype: 'image/gif'}]
}
export const transform = async o => {
  let fd = new FormData()
  let returnFormData = false
  Object.keys(o).map(async k => {
    let val = o[k]
    if (
      typeof val === 'object' &&
      val.hasOwnProperty('type') &&
      val.type === 'file'
    ) {
      returnFormData = true
      val = await transformFile(val)
    } else if (typeof val === 'object') {
      val = [JSON.stringify(val)]
    } else {
      val = [val]
    }
    fd.append(k, ...val)
    return val
  })
  return returnFormData ? fd : o
}
