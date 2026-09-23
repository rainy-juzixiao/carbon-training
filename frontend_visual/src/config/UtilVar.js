var UtilVar = {
    ENC: false, //返回结果是否加密
    baseUrl: import.meta.env.VITE_APP_BASE_API,
    code: 401,
}
const runtimeType = {

    production: () => {
        
    },
    yh: () => {

    },
    //开发环境
    development: () => {

    },

}
runtimeType[import.meta.env.VITE_APP_ENV]()
export default UtilVar

