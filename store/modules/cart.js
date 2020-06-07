import {getCartListData,getEditCartData,getDelCartData,getClearCartData,getOrderData,getOrderSettlementData} from "@/common/api"
const cart = {
	namespaced: true,
	state: {
		cartList: [],
		orderList:[]
	},
	mutations:{
		// 购物车列表
		SET_CARTLIST(state,payload){
			state.cartList = payload
		},
		SET_ORDERLIST(state,data){
			state.orderList = data
		}
	},
	getters:{
		CartList(state){
			return state.cartList
		},
		OrderList(state){
			return state.orderList
		}
	},
	actions:{
		// 购物车列表展示
		GetCartList({commit},params){
			return new Promise((resolve, reject) => {
				getCartListData(params).then(res => {
					commit('SET_CARTLIST', res.data.data)
					resolve(res.data)
				})
			})
		},
		// 删除某件商品
		DeleteCart({commit},params){
			return new Promise((resolve, reject) => {
				getDelCartData(params).then(res => {
					resolve(res)
				})
			})
		},
		// 编辑商品数量
		GetEditCart({commit},params){
			return new Promise((resolve, reject) => {
				getEditCartData(params).then(res => {
					resolve(res)
				})
			})
		},
		// 清空所有商品
		ClearCartData({commit}){
			return new Promise((resolve, reject) => {
				getClearCartData().then(res => {
					resolve(res)
				})
			})
		},
		// 创建订单
		CreateOrder({commit},params){
			return new Promise((resolve, reject) => {
				getOrderData(params).then(res => {
					commit('SET_ORDERLIST',res.data.data)
					resolve(res)
				})
			})
		},
		// 订单结算
		OrderSettlement({commit},params){
			return new Promise((resolve, reject) => {
				getOrderSettlementData(params).then(res => {
					commit('SET_ORDERLIST',res.data.data)
					resolve(res)
				})
			})
		}

	}
}
export default cart