const path = require("path")//导入path模块
const resolve = dir =>path.resolve(__dirname,dir)
module.exports = {
  webpack:{
    alias:{
    //名称:路径
      "@":resolve("src")
    }
  }
};