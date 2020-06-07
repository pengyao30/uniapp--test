import {getCategoryData,getCategoryListData} from "@/common/api.js"
const category = {
	namespaced: true,
	state:{
		categoryList:[],//分类首页列表
		productList:[]//点击后分类列表
	},
	mutations:{
		// 分类首页列表
		CATEGORY:(state,payload) => {
			state.categoryList = payload;
		},
		// 点击后分类列表
		CATEGORYLIST:(state,payload) => {
			state.productList = payload;
		},
	},
	actions:{
		// 分类首页数据列表
		getCategory:(({commit}) => {
			return new Promise((resolve,reject) => {
				getCategoryData().then((res) => {
					const data = res.data.data;
					commit("CATEGORY",data)
					resolve(data)
				})
			})
		}),
		// 分类首页点击跳转后商品列表
		getCategoryList:({commit},payload) => {
			return new Promise((resolve,reject) => {
				getCategoryListData(payload).then((res) => {
					const data = res.data.data.data;
					commit("CATEGORYLIST",data)
					resolve(data)
				})
			})
		}
	},
	getters:{
		// 分类首页列表
		GetCategory:(state) => {
			return state.categoryList;
		},
		// 点击后分类列表
		GetProductList:(state) => {
			return state.productList;
		},
	}
}
export default category