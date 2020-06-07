import {getGoodsData} from "@/common/api.js"
const goodList = {
	namespaced: true,
	state:{
		shops:[]
	},
	getters:{
		getShops:(state) => {
			return state.shops
		}
	},
	mutations:{
		GOODSLIST:(state,payload) => {
			state.shops = payload;
		}
	},
	actions:{
		GoodList:({commit}) => {
			return new Promise((resolve,reject) => {
				getGoodsData().then((res) => {
					const data = res.data.data.home_recommend_products
					commit("GOODSLIST",data);
					resolve(data);
				})
			})
		}
	}
}
export default goodList