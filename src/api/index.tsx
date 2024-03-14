
const BaseUrl = 'localhost:3000/'
export const get = async (src: string, body: any = {},headers: any = { "Content-Type": "application/json" }) => {
  return await window.fetch(src,{
    method: "get",
    body: JSON.stringify({
      ...body
    }),
    headers
  }).then(res => res.json())
  .then(data => { // 服务器返回给客户端的数据
    return data
  }).catch(error => {
    return error
  })
} 

export async function  put(src: string, body: any = {},headers: any = { "Content-Type": "application/json" }) {
  return await window.fetch(src,{
    method: "put",
    body: JSON.stringify({
      ...body
    }),
    headers
  }).then(res => res.json())
  .then(data => { // 服务器返回给客户端的数据
    return data
  }).catch(error => {
    return error
  })
} 

export async function post(src: string, body: any = {},headers: any = { "Content-Type": "application/json" }) {
  return await window.fetch(src,{
    method: "post",
    body: JSON.stringify({
      ...body
    }),
    headers
  }).then(res => res.json())
  .then(data => { // 服务器返回给客户端的数据
    return data
  }).catch(error => {
    return error
  })
}
 
export async function remove(src: string, body: any = {},headers: any = { "Content-Type": "application/json" }) {
  return await window.fetch(src,{
    method: "delete",
    body: JSON.stringify({
      ...body
    }),
    headers
  }).then(res => res.json())
  .then(data => { // 服务器返回给客户端的数据
    return data
  }).catch(error => {
    return error
  })
}
