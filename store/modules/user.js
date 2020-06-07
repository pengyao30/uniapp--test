import {getAddressData,getEditAddressData,getDelAddressData,getUserCollectionData} from "@/common/api"
const user = {
	namespaced:true,
	state:{
		addressList:[],
		collectionList:[]
	},
	mutations:{
		ADDRESS_LIST(state,payload){
			state.addressList = payload
		},
		COLLECTION_LIST(state,payload){
			state.collectionList = payload
		}
	},
	actions:{
		// 得到地址
		getAddress({commit}){
			return new Promise((resolve,reject) => {
				getAddressData().then((res) => {
					const data = res.data.data
					commit("ADDRESS_LIST",data)
					resolve(data)
				})
			})
		},
		// 编辑，添加地址
		getEditAddress({commit},payload){
			return new Promise((resolve,reject) => {
				getEditAddressData(payload).then((res) => {
					resolve(res)
				})
			})
		},
		// 删除地址
		deleteAddress({commit},payload){
			return new Promise((resolve,reject) => {
				getDelAddressData(payload).then((res) => {
					resolve(res)
				})
			})
		},
		// 用户收藏
		UserCollection({commit}){
			return new Promise((resolve,reject) => {
				getUserCollectionData().then((res) => {
					const data = res.data.data
					commit("COLLECTION_LIST",data)
					resolve(res)
				})
			})
		}
	},
	getters:{
		address(state){
			return state.addressList
		},
		collection(state){
			return state.collectionList
		}
	}
}

export default user