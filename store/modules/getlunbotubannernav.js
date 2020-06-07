import {getLbtBannerNav} from "@/common/api.js"
const getlunbotubannernav = {
	namespaced: true,
	state:{
		LbtBNavInfo:[]
	},
	mutations:{
		GETLBTBANNERNAV(state,payload){
			state.LbtBNavInfo = payload;
		}
	},
	actions:{
		GetLbtBannerNav({commit}){
			return new Promise((resolve,reject) => {
				getLbtBannerNav().then((res) => {
					const data = res.data.data
					commit("GETLBTBANNERNAV",data);
					resolve(data)
				})
			})
		}
	},
	getters:{
		GETLBTBNAVINFO(state){
			return state.LbtBNavInfo;
		}
	}
}
export default getlunbotubannernav