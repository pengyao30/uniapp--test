<template>
	<view class="content">
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{current: tabCurrentIndex === index}"
			 @click="tabClick(index)">
				{{item.text}}
			</view>
		</view>

		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" :scroll-top="scrollTop" scroll-y @scrolltolower="loadData('glide')"
				 @scroll="scroll">
					<!-- 空白页 -->
					<empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></empty>

					<!-- 订单列表 -->
					<view v-for="(item,index) in tabItem.orderList" :key="index" class="order-item">
						<view class="i-top b-b">
							<text class="time">{{item.create_time_text}}</text>
							<text class="state" :style="{color: item.stateTipColor}">{{item.stateTip}}</text>
							<text v-if="item.status===-1" class="del-btn yticon icon-iconfontshanchu1" @click="deleteOrder(item,index)"></text>
						</view>

						<scroll-view v-if="item.products.length > 1" class="goods-box" scroll-x>
							<view v-for="(goodsItem, goodsIndex) in item.products" :key="goodsIndex" class="goods-item" >
								<image class="goods-img" :src="goodsItem.images[0]" mode="aspectFill"></image>
							</view>
						</scroll-view>

						<view v-if="item.products.length === 1" class="goods-box-single" v-for="(goodsItem, goodsIndex) in item.products"
						 :key="goodsIndex" @click="navTo(item,tabItem)">
							<view class="item-box">
								<image class="goods-img" :src="goodsItem.images[0]" mode="aspectFill"></image>
								<view class="right">
									<text class="title clamp">{{goodsItem.title}}</text>
									<text class="attr-box">{{goodsItem.attributes}} x {{goodsItem.quantity}}</text>
									<text class="price">{{goodsItem.price}}</text>
								</view>
							</view>
						</view>

						<view class="price-box">
							共
							<text class="num">{{item.products.length}}</text>
							件商品 实付款
							<text class="price">{{item.products_price}}</text>
						</view>

						<view class="action-box b-t" v-if="item.status != -1">
							<button class="action-btn" @click="cancelOrder(item)">取消订单</button>
							<button class="action-btn recom" @click="toPay(item.products_price)">立即支付</button>
						</view>
					</view>

					<uni-load-more :status="tabItem.loadingType"></uni-load-more>

				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	import {
		mapGetters
	} from 'vuex';
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				tabCurrentIndex: 0,
				currentMaxPage: 10,
				status: 'tabChange',
				scrollTop: 0,
				oldScrollTop: 0,
				changer: '',
				navList: [{
						state: 0,
						text: '全部',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 1,
						text: '待付款',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 2,
						text: '待收货',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 3,
						text: '待评价',
						loadingType: 'more',
						orderList: []
					}
				],
			};
		},
		computed: {
			...mapGetters("order",{
				orderList: "OrderList"
			})
		},
		onLoad(options) {
			/**
			 * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
			 * 替换onLoad下代码即可
			 */
			this.tabCurrentIndex = +options.state;
			// #ifndef MP
			this.loadData()
			// #endif
			// #ifdef MP
			if (options.state == 0) {
				this.loadData()
			}
			// #endif
		},

		methods: {
			// 跳转
			navTo(item,tabItem){
				uni.navigateTo({
					url:`/pages/order/orderDetail?order_sn=${item.order_sn}&state=${tabItem.state}`
				})
			},
			//获取订单列表
			loadData(source) {
				//先获取对应点击状态的导航栏数据
				let navItem = this.navList[this.tabCurrentIndex];
				//记录当前点击的导航栏
				let state = navItem.state;
				//导航栏切换只有第一次需要加载数据
				if (source === 'tabChange' && navItem.loaded === true) {
					return;
				}
				//刷新页面则重新获取第一页数据
				if (source === 'refresh') {
					navItem.loadingType = 'more'
					navItem.currentPage = 1
				}
				//防止重复加载
				if (navItem.loadingType === 'noMore') {
					return;
				}
				//表示已经加载过1次
				navItem.loadingType = 'loading';
				setTimeout(async () => {
					await this.$store.dispatch('order/getOrder', {state:state,page: navItem.currentPage || 1})
					//记录当前总数据数
					let total = this.orderList.total
					//记录当前页数
					let currentPage = this.orderList.current_page
					//添加不同状态下订单的表现形式
					let orderList = this.orderList.data.filter(item => Object.assign(item, this.orderStateExp(item.status)));
					//如果是刷新则要先将数据清空
					if (source === 'refresh') navItem.orderList = []
					//添加对应导航栏所返回的数据
					orderList.forEach(item => navItem.orderList.push(item))
					//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
					this.$set(navItem, 'loaded', true);
					//currentPage新字段表示当前导航栏加载数据的页码
					this.$set(navItem, 'currentPage', currentPage);
					//判断是否还有数据， 有改为 more， 没有改为noMore 
					navItem.loadingType = this.currentMaxPage * navItem.currentPage >= total ? 'noMore' : 'more';
					//如果还有数据 则对应请求页码+1
					if (navItem.loadingType == 'more') navItem.currentPage++
					//关闭刷新过渡动画
					if (source === 'refresh') uni.hideLoading();
					//防止更新数据重复加载
					if (this.changer === state) this.status = 'tabChange'
				}, 200);

			},
			//swiper 切换
			changeTab(e) {
				this.tabCurrentIndex = e.target.current;
				if (this.changer === this.tabCurrentIndex && this.status == 'refresh') {
					uni.showLoading({
						title: '更新数据中'
					})
					this.loadData('refresh');
					return
				}
				this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
			//记录滑动距离顶部距离
			scroll(e) {
				this.oldScrollTop = e.detail.scrollTop
			},
			//删除订单
			async deleteOrder(item, index) {
				uni.showLoading({
					title: '请稍后'
				})
				const res = await this.$store.dispatch('order/getOrderDelete', {
					order_sn: item.order_sn
				})
				if (res.data.code == 1) {
					setTimeout(() => {
						this.navList[this.tabCurrentIndex].orderList.splice(index, 1);
						uni.hideLoading();
					}, 600)
				}
			},
			//取消订单
			cancelOrder(item) {
				setTimeout(async () => {
					const res = await this.$store.dispatch('order/getOrderCancel',{
						order_sn: item.order_sn
					})
					if (res.data.code == 1) {
						let {
							stateTip,
							stateTipColor
						} = this.orderStateExp(-1);
						item = Object.assign(item, {
							status: -1,
							stateTip,
							stateTipColor
						})
						this.changer = this.tabCurrentIndex == 0 ? 1 : 0
						//如果在待付款中取消则要删除该项
						if (this.tabCurrentIndex == 1) {
							let list = this.navList[1].orderList;
							let index = list.findIndex(val => val.id === item.id);
							index !== -1 && list.splice(index, 1);
						}
						//回到顶部并重新获取数据
						this.scrollTop = this.oldScrollTop
						this.$nextTick(function() {
							this.scrollTop = 0
						});
						this.status = 'refresh'
						this.loadData('refresh')
						uni.showLoading({
							title: '更新数据中'
						})
					}
				}, 600)
			},
			//去支付
			toPay(price) {
				uni.redirectTo({
					url: `/pages/money/pay?totalPrice=${price}`
				})
			},
			//订单状态文字和颜色
			orderStateExp(state) {
				let stateTip = '',
					stateTipColor = '#fa436a';
				switch (+state) {
					case 0:
						stateTip = '待付款';
						break;
					case 1:
						stateTip = '待发货';
						break;
					case 2:
						stateTip = '待收货';
						break;
					case 3:
						stateTip = '待评价';
						break;
					case -1:
						stateTip = '订单已关闭';
						stateTipColor = '#909399';
						break;
				}
				return {
					stateTip,
					stateTipColor
				};
			}
		},
	}
</script>

<style lang="scss">
	page,
	.content {
		background: $page-color-base;
		height: 100%;
	}
	.swiper-box {
		height: calc(100% - 40px);
	}
	.list-scroll-content {
		height: 100%;
	}
	.navbar {
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0, 0, 0, .06);
		position: relative;
		z-index: 10;
		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;
			&.current {
				color: $base-color;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}
	.uni-swiper-item {
		height: auto;
	}
	.order-item {
		display: flex;
		flex-direction: column;
		padding-left: 30upx;
		background: #fff;
		margin-top: 16upx;
		.i-top {
			display: flex;
			align-items: center;
			height: 80upx;
			padding-right: 30upx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;
			.time {
				flex: 1;
			}
			.state {
				color: $base-color;
			}
			.del-btn {
				padding: 10upx 0 10upx 36upx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;
				&:after {
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}
		/* 多条商品 */
		.goods-box {
			height: 160upx;
			padding: 20upx 0;
			white-space: nowrap;
			.goods-item {
				width: 120upx;
				height: 120upx;
				display: inline-block;
				margin-right: 24upx;
			}
			.goods-img {
				display: block;
				width: 100%;
				height: 100%;
			}
		}
		/* 单条商品 */
		.goods-box-single {
			padding: 20upx 0;
			.item-box {
				display: flex;
				.goods-img {
					display: block;
					width: 120upx;
					height: 120upx;
				}
				.right {
					flex: 1;
					display: flex;
					flex-direction: column;
					padding: 0 30upx 0 24upx;
					overflow: hidden;
					.title {
						font-size: $font-base + 2upx;
						color: $font-color-dark;
						line-height: 1;
					}
					.attr-box {
						font-size: $font-sm + 2upx;
						color: $font-color-light;
						padding: 10upx 12upx;
					}
					.price {
						font-size: $font-base + 2upx;
						color: $font-color-dark;
						&:before {
							content: '￥';
							font-size: $font-sm;
							margin: 0 2upx 0 8upx;
						}
					}
				}
			}
		}
		.price-box {
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 20upx 30upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;
			.num {
				margin: 0 8upx;
				color: $font-color-dark;
			}
			.price {
				font-size: $font-lg;
				color: $font-color-dark;
				&:before {
					content: '￥';
					font-size: $font-sm;
					margin: 0 2upx 0 8upx;
				}
			}
		}
		.action-box {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100upx;
			position: relative;
			padding-right: 30upx;
		}
		.action-btn {
			width: 160upx;
			height: 60upx;
			margin: 0;
			margin-left: 24upx;
			padding: 0;
			text-align: center;
			line-height: 60upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			background: #fff;
			border-radius: 100px;
			&:after {
				border-radius: 100px;
			}
			&.recom {
				background: #fff9f9;
				color: $base-color;

				&:after {
					border-color: #f7bcc8;
				}
			}
		}
	}
</style>
