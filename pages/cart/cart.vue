<template>
	<view class="container">
		<!-- 空白页 -->
		<view v-if="!hasLogin || empty===true" class="empty">
			<image src="/static/emptyCart.jpg" mode="aspectFit"></image>
			<view v-if="hasLogin" class="empty-tips">
				空空如也
				<navigator class="navigator" v-if="hasLogin" url="../index/index" open-type="switchTab">随便逛逛></navigator>
			</view>
			<view v-else class="empty-tips">
				空空如也
				<view class="navigator" @click="navToLogin">去登陆></view>
			</view>
		</view>
		<view v-else>
			<!-- 列表 -->
			<view class="cart-list">
				<block v-for="(item,index) in cartLists" :key="item.id">
					<view
						class="cart-item" 
						:class="{'b-b': index!==cartLists.length-1}"
					>
						<view class="image-wrapper">
							<image :src="item.product.image[0]" 
								class="loaded"
								mode="aspectFill" 
								lazy-load 
								@load="onImageLoad('cartLists', index)"
								@error="onImageError('cartLists', index)"
								@click="goProductDetail(item)"
							></image>
							<view 
								class="yticon icon-xuanzhong2 checkbox"
								:class="{checked: item.is_selected==1}"
								@click="check('item', item)"
							></view>
						</view>
						<view class="item-right">
							<text class="clamp title">{{item.product.title}}</text>
							<text class="attr">{{item.sku.value}}</text>
							<text class="price">¥{{item.sku.price}}</text>
							<uni-number-box 
								class="step"
								:min="1" 
								:max="item.sku.stock"
								:value="item.quantity"
								:isMax="item.quantity>=item.sku.stock?true:false"
								:isMin="item.quantity===1"
								:index="index"
								@eventChange="numberChange(item.sku.id,$event)"  
							></uni-number-box>
							<!-- value:输入框的当前值 min最小值默认0 max最大值默认100 每次点击改变数值 disanled:是否禁止 -->
						</view>
						<text class="del-btn yticon icon-fork" @click="deleteCartItem(item,index)"></text>
					</view>
				</block>
			</view>
			<!-- 底部菜单栏 -->
			<view class="action-section">
				<view class="checkbox">
					<image 
						:src="allChecked?'/static/selected.png':'/static/select.png'" 
						mode="aspectFit"
						@click="check('all')"
					></image>
					<view class="clear-btn" :class="{show: allChecked}" @click="clearCart">
						清空
					</view>
				</view>
				<view class="total-box">
					<text class="price">¥{{total}}</text>
				</view>
				<button type="primary" class="no-border confirm-btn" @click="createOrder">去结算</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapGetters} from 'vuex';
	import uniNumberBox from '@/components/uni-number-box.vue'
	export default {
		components: {
			uniNumberBox
		},
		data() {
			return {
				total: 0, //总价格
				allChecked: false, //全选状态  true|false
				empty: false, //空白页现实  true|false
			};
		},
		onLoad(){
			this.loadData();
		},
		onShow() {
			this.loadData();
		},
		watch:{
			//显示空白页
			cartList(e){
				let empty = e.length === 0 ? true: false;
				if(this.empty !== empty){
					this.empty = empty;
				}
			}
		},
		computed:{
			...mapGetters("cart",{
				cartLists:"CartList"
			}),
			...mapState({
				hasLogin:"hasLogin"
			})
		},
		methods: {
			//请求数据
			async loadData(){
				await this.$store.dispatch('cart/GetCartList')
				this.cartLists.forEach(item => {
					this.$set(item, 'is_selected', 1)
					// this.$set(值, '键', "与键相对应的值")
				});
				this.calcTotal();  //计算总价
			},
			//监听image加载完成
			onImageLoad(key, index) {
				this.$set(this[key][index], 'loaded', 'loaded');
			},
			//监听image加载失败
			onImageError(key, index) {
				this[key][index].image = '/static/errorImage.jpg';
			},
			navToLogin(){
				uni.navigateTo({
					url: '/pages/public/login'
				})
			},
			// 跳转详情页面
			goProductDetail(item){
				uni.navigateTo({
					url: '/pages/product/product?id=' + item.product.id
				})
			},
			// 选中状态处理
			check(type, item){
				if(type === 'item'){
					item.is_selected = item.is_selected == 0 ? 1 : 0;
				}else{
					this.allChecked = !this.allChecked
					this.cartLists.forEach(item => {
						if(this.allChecked){
							item.is_selected = 1
						}
						item.is_selected = 0
					})
				}
				this.calcTotal();
			},
			//数量
			async numberChange(id,event){
				// console.log(id,event)打印值为商品id号{number: 6, index: 7}number为商品数量，index为购物车商品的索引
				const {statusCode} = await this.$store.dispatch("cart/GetEditCart",{sku_id:id,quantity:event.number})
				if(statusCode == 200){
					this.cartLists[event.index].quantity = event.number;
					this.calcTotal();
				}
			},
			//删除
			async deleteCartItem(item,index){
				const {statusCode} = await this.$store.dispatch("cart/DeleteCart",{ids:[item.id]})
				if(statusCode == 200){
					this.cartLists.splice(index, 1);
					this.calcTotal();
				}
			},
			//清空
			clearCart(){
				uni.showModal({
					content: '清空购物车？',
					success: async (e) => {
						if (e.confirm) {
							const {statusCode} = await this.$store.dispatch('cart/ClearCartData')
							if (statusCode == 200){
								this.loadData()
							}
						}
					}
				})
			},
			// 计算总价
			calcTotal() {
				let list = this.cartLists;
				if (list.length === 0) {
					this.empty = true;
					return;
				}
				let total = 0;
				let checked = true;
				list.forEach(item => {
					if (item.is_selected === 1) {
						total += item.sku.price * item.quantity;
					}else{
						checked = false
					}
				})
				this.allChecked = this.flag || checked;
				this.total = Number(total).toFixed(2);
			},
			//创建订单
			async createOrder(){
				let ids = [];
				this.cartLists.forEach(item => {
					if(item.is_selected == 1){
						ids.push(item.id)
					}
					if(!item.product){
						uni.showToast({
							title: '商品不存在'
						})
						return
					}
				});
				const {data} = await this.$store.dispatch('cart/OrderSettlement',{ids})
				if(data.code == 1){
					uni.navigateTo({
						url: `/pages/order/createOrder`
					})
				}
			}
		}
	}
</script>

<style lang='scss'>
	.container{
		padding-bottom: 134upx;
		/* 空白页 */
		.empty{
			position:fixed;
			left: 0;
			top:0;
			width: 100%;
			height: 100vh;
			padding-bottom:100upx;
			display:flex;
			justify-content: center;
			flex-direction: column;
			align-items:center;
			background: #fff;
			image{
				width: 240upx;
				height: 160upx;
				margin-bottom:30upx;
			}
			.empty-tips{
				display:flex;
				font-size: $font-sm+2upx;
				color: $font-color-disabled;
				.navigator{
					color: $uni-color-primary;
					margin-left: 16upx;
				}
			}
		}
	}
	/* 购物车列表项 */
	.cart-item{
		display:flex;
		position:relative;
		padding:30upx 40upx;
		.image-wrapper{
			width: 230upx;
			height: 230upx;
			flex-shrink: 0;
			position:relative;
			image{
				border-radius:8upx;
			}
		}
		.checkbox{
			position:absolute;
			left:-16upx;
			top: -16upx;
			z-index: 8;
			font-size: 44upx;
			line-height: 1;
			padding: 4upx;
			color: $font-color-disabled;
			background:#fff;
			border-radius: 50px;
		}
		.item-right{
			display:flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position:relative;
			padding-left: 30upx;
			.title,.price{
				font-size:$font-base + 2upx;
				color: $font-color-dark;
				height: 40upx;
				line-height: 40upx;
			}
			.attr{
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 50upx;
				line-height: 50upx;
			}
			.price{
				height: 50upx;
				line-height:50upx;
			}
		}
		.del-btn{
			padding:4upx 10upx;
			font-size:34upx; 
			height: 50upx;
			color: $font-color-light;
		}
	}
	/* 底部栏 */
	.action-section{
		/* #ifdef H5 */
		margin-bottom:100upx;
		/* #endif */
		position:fixed;
		left: 30upx;
		bottom:30upx;
		z-index: 95;
		display: flex;
		align-items: center;
		width: 690upx;
		height: 100upx;
		padding: 0 30upx;
		background: rgba(255,255,255,.9);
		box-shadow: 0 0 20upx 0 rgba(0,0,0,.5);
		border-radius: 16upx;
		.checkbox{
			height:52upx;
			position:relative;
			image{
				width: 52upx;
				height: 100%;
				position:relative;
				z-index: 5;
			}
		}
		.clear-btn{
			position:absolute;
			left: 26upx;
			top: 0;
			z-index: 4;
			width: 0;
			height: 52upx;
			line-height: 52upx;
			padding-left: 38upx;
			font-size: $font-base;
			color: #fff;
			background: $font-color-disabled;
			border-radius:0 50px 50px 0;
			opacity: 0;
			transition: .2s;
			&.show{
				opacity: 1;
				width: 120upx;
			}
		}
		.total-box{
			flex: 1;
			display:flex;
			flex-direction: column;
			text-align:right;
			padding-right: 40upx;
			.price{
				font-size: $font-lg;
				color: $font-color-dark;
			}
			.coupon{
				font-size: $font-sm;
				color: $font-color-light;
				text{
					color: $font-color-dark;
				}
			}
		}
		.confirm-btn{
			padding: 0 38upx;
			margin: 0;
			border-radius: 100px;
			height: 76upx;
			line-height: 76upx;
			font-size: $font-base + 2upx;
			background: $uni-color-primary;
			box-shadow: 1px 2px 5px rgba(217, 60, 93, 0.72)
		}
	}
	/* 复选框选中状态 */
	.action-section .checkbox.checked,
	.cart-item .checkbox.checked{
		color: $uni-color-primary;
	}
</style>
