import axios from 'axios'
import { API_ROOT } from '../const/env'
import store from '../store';

export const request = async function (requestUrl, data) {
  const url = `${API_ROOT}/${requestUrl}`
  const { is_login, login_id } = store.state.user
  const header = is_login ? { login_id } : {}
  const config = {
    headers: { "Content-Type": "application/json", ...header },
  };
  try {
    const res = await axios.post(url, data, config);
    return res.data
  } catch(err) {
    throw new Error(err)
  }
}

export const requestForm = async function (requestUrl, type, file) {
  const url = `${API_ROOT}/${requestUrl}`
  const param = new FormData();
  param.append(type, file);
  const config = {
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






