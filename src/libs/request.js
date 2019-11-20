import axios from 'axios'
import { API_ROOT } from '../const/env'

export default async function request (requestUrl, data, method = 'post', headers = {}) {
  let url = `${API_ROOT}/${requestUrl}`
  try {
    const res = await axios({ method, url, data, headers });
    return res.data
  } catch(err) {
    throw new Error(err)
  }
}


