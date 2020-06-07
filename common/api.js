import http from '@/common/http';
// 轮播图数据,banner,nav
export function getLbtBannerNav(){
	return http.post("nav",{nav_type: [0, 1, 2]})
}
// 商品列表
export function getGoodsData(){
	return http.get("product/getHomeProducts",{})
}
// 产品详情
export function getProductData(id){
	return http.get("product",id)
}
// 商品评价
export function getProductComment(info){
	return http.get("product/getReviews",info)
}
// 收藏
export function getCollectionData(info){
	return http.post("product/favorite",info)
}
// 创建订单
export function getOrderData(msg){
	return http.get("cart",msg)
}
// 获取订单金额
export function getOrderPriceData(params){
	return http.post("order/getPrice",params)
}
// 提交订单
export function getSubmitOrderData(params){
	return http.post("order/add",params)
}
// 我的订单
export function getUserOrderData(msg){
	return http.get("order",msg)
}
// 订单信息
export function getOrderInfoData(msg){
	return http.get("order/info",msg)
}
// 取消订单
export function getOrderCancelData(msg){
	return http.post("order/cancel",msg)
}
// 删除订单
export function getOrderDeleteData(msg){
	return http.post("order/del",msg)
}
// 购物车列表
export function getCartListData(){
	return http.get('cart')
}
// 物品增加至购物车购物车
export function getCartData(info){
	return http.post("cart/add",info)
}
// 编辑商品数量
export function getEditCartData(info){
	return http.post("cart/edit",info)
}
// 删除某件商品
export function getDelCartData(info){
	return http.post("cart/delete",info)
}
// 清空所有商品
export function getClearCartData(){
	return http.post("cart/clear")
}
// 订单结算
export function getOrderSettlementData(ids){
	return http.post('cart/updateStatus',ids)
}
// 商品分类
export function getCategoryData(){
	return http.get("category",{})
}
// 分类商品列表
export function getCategoryListData(res){
	return http.get("product/getList",res)
}
// 登录
export function getLoginData(res){
	return http.post("index/login",res)
}
// 获取用户信息
export function getUserData(){
	return http.get("user",{})
}
// 获取地址信息
export function getAddressData(){
	return http.get("user/getAddress")
}
// 添加修改地址信息
export function getEditAddressData(res){
	return http.post("user/editAddress",res)
}
// 删除地址信息
export function getDelAddressData(res){
	return http.post('user/delAddress',res)
}
// 修改用户昵称和密码
export function getEditUserData(res){
	return http.post('user/editInfo',res)
}
// 修改用户昵称和密码
export function getUserCollectionData(){
	return http.get('user/favorite')
}
