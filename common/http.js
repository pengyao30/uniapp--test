import Request from '@/common/request'
import Config from '@/common/config'
const http = new Request()
//设置相关信息
http.setConfig((config) => {
	// 配置url
	config.baseUrl = Config.server
	// 配置文本类型
	config.responseType = "json"
	return config
})

// 拦截器
http.interceptor.request((config, cancel) => { 
	// return true;
	config.header['Xshop-Token'] = uni.getStorageSync('token')
	config.header['platform'] = 'H5'
	return config;
})
http.interceptor.response((response) => {
	const res = response.data;
	// if(res.code !== '20000'){
	// 	return Promise.reject(res);
	// }else{
	// 	return response.data;
	// }
	return response
})

export default http