import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// 引入模块内容
import getlunbotubannernav from "./modules/getlunbotubannernav.js"
import goodList from "./modules/goodList.js"
import product from "./modules/product.js"
import category from "./modules/category.js"
import order from "./modules/order.js"
import cart from "./modules/cart.js"
import user from "./modules/user.js"

import {getLoginData,getUserData,getEditUserData} from "@/common/api.js"
const store = new Vuex.Store({
	modules:{
		getlunbotubannernav,
		goodList,
		product,
		category,
		order,
		cart,
		user
	},
	state: {
		hasLogin: false,
		userInfo: {},
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true;
			state.userInfo = provider;
			uni.setStorage({//缓存用户登陆状态
			    key: 'userInfo',  
			    data: provider  
			}) 
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			uni.removeStorage({  
	            key: 'userInfo'
	        })
		}
	},
	actions: {
		// 获取token
		GetLogin:({commit},payload) => {
			return new Promise((resolve,reject) => {
				getLoginData(payload).then((res) => {
					const data = res.data.data;
					const token = data.token;
					uni.setStorageSync('token', token);
					resolve(res)
				})
			})
		},
		// 获取用户信息
		GetUserInfo:({commit}) => {
			return new Promise((resolve,reject) => {
				getUserData().then((res) => {
					const data = res.data.data;
					commit("login",data)
					console.log(data)
					resolve(data)
				})
			})
		},
		// 修改用户昵称和密码
		GetEditUserInfo:({commit},payload) => {
			return new Promise((resolve,reject) => {
				getEditUserData(payload).then((res) => {
					console.log(res)
					resolve(res)
				})
			})
		},
		// 保存用户信息至vuex和本地储存中
		SaveInfo:({commit},payload) => {
			commit("login",payload)
		}
	}
})

export default store
