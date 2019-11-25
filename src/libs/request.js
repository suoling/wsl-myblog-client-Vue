import axios from 'axios'
import { API_ROOT } from '../const/env'

export const request = async function (requestUrl, data, method = 'post') {
  let url = `${API_ROOT}/${requestUrl}`
  try {
    const res = await axios({ method, url, data });
    return res.data
  } catch(err) {
    throw new Error(err)
  }
}

export const requestForm = async function (requestUrl, type, file) {
  let url = `${API_ROOT}/${requestUrl}`
  let param = new FormData();
  param.append(type, file);
  let config = {
    //添加请求头
    headers: { "Content-Type": "multipart/form-data" },
    //添加上传进度监听事件
    // onUploadProgress: e => {
    //   let completeProgress = ((e.loaded / e.total * 100) | 0) + "%";
    //   this.progress = completeProgress;
    // }
  };
  try {
    const res = await axios.post(url, param, config);
    return res.data
  } catch(err) {
    throw new Error(err)
  }
}






