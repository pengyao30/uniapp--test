import {getProductData,getProductComment,getCollectionData,getCartData} from "@/common/api.js"
const product = {
	namespaced: true,
	state:{
		product:{},
		comment:{}
	},
	getters:{
		// 获取产品详情
		GetProduct:(state) => {
			return state.product;
		},
		// 获取评论
		GetComment:(state) => {
			return state.comment;
		}
	},
	mutations:{
		// 获取产品详情
		PRODUCTS:(state,payload) => {
			state.product = payload;
		},
		// 获取评论
		COMMENT:(state,payload) => {
			state.comment = payload;
		}
	},
	actions:{
		// 获取产品详情
		getProduct:({commit},payload) => {
			return new Promise((resolve,reject) => {
				getProductData(payload).then((res) => {
					const data = res.data.data
					commit("PRODUCTS",data);
					resolve(data);
				})
			})
		},
		// 收藏产品
		getCollectionProduct:({commit},payload) => {
			return new Promise((resolve,reject) => {
				getCollectionData(payload).then((res) => {
					const data = res.data
					resolve(data);
				})
			})
		},
		// 添加商品至购物车
		getProductCart:({commit},payload) => {
			return new Promise((resolve,reject) => {
				getCartData(payload).then((res) => {
					resolve(res);
				})
			})
		},
		// 获取评论
		getComment:({commit},payload) => {
			return new Promise((resolve,reject) => {
				getProductComment(payload).then((res) => {
					const data = res.data.data
					commit("COMMENT",data);
					resolve(data);
				})
			}) 
		}
	}
}
export default product