import {getOrderPriceData,getSubmitOrderData,getUserOrderData,getOrderInfoData,getOrderCancelData,getOrderDeleteData} from "@/common/api.js"
const order = {
	namespaced: true,
	state:{
		orderPrice:{},
		orderlist:{},
		orderinfo:{}
	},
	getters:{
		getOrderPrice:((state) => {
			return state.orderPrice
		}),
		OrderList:((state) => {
			return state.orderlist
		}),
		OrderInfo:((state) => {
			return state.orderinfo
		})
	},
	mutations:{
		// 订单金额
		ORDER_PRICE:((state,payload) => {
			state.orderPrice = payload
		}),
		// 订单列表
		ORDER_LIST:((state,payload) => {
			state.orderlist = payload
		}),
		// 订单信息
		ORDER_INFO:((state,payload) => {
			state.orderinfo = payload
		})
	},
	actions:{
		// 订单金额
		OrderPrice:({commit},payload) => {
			return new Promise((resolve,reject) => {
				getOrderPriceData(payload).then((res) => {
					commit("ORDER_PRICE",res.data.data)
					resolve(res)
				})
			})
		},
		// 提交订单
		SubmitOrder:({commit},payload) => {
			return new Promise((resolve,reject) => {
				getSubmitOrderData(payload).then((res) => {
					resolve(res)
				})
			})
		},
		// 我的页面-订单管理（全部订单，待付款订单，待收货订单）
		getOrder:({commit},payload) => {
			return new Promise((resolve,reject) => {
				getUserOrderData(payload).then((res) => {
					commit("ORDER_LIST",res.data.data)
					resolve(res)
				})
			})
		},
		// 订单信息
		getOrderInfo:({commit},payload) => {
			return new Promise((resolve,reject) => {
				getOrderInfoData(payload).then((res) => {
					commit("ORDER_INFO",res.data.data)
					resolve(res)
				})
			})
		},
		// 取消订单getOrderDeleteData
		getOrderCancel:({commit},payload) => {
			return new Promise((resolve,reject) => {
				getOrderCancelData(payload).then((res) => {
					resolve(res)
				})
			})
		},
		// 删除订单
		getOrderDelete:({commit},payload) => {
			return new Promise((resolve,reject) => {
				getOrderDeleteData(payload).then((res) => {
					console.log(res)
					resolve(res)
				})
			})
		}
	}
}
export default order