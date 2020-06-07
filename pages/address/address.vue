<template>
	<view class="content b-t">
		<view class="list b-b" v-for="(item, index) in addressInfo" :key="index" @click="checkAddress(item)">
			<view class="wrapper">
				<view class="address-box">
					<text v-if="item.is_default==1" class="tag">默认</text>
					<text class="address">{{item.address}} {{item.street}}</text>
				</view>
				<view class="u-box">
					<text class="name">{{item.contactor_name}}</text>
					<text class="mobile">{{item.phone}}</text>
				</view>
			</view>
			<text class="yticon icon-bianji" @click.stop="addAddress('edit', item)"></text>
			<text class="yticon icon-iconfontshanchu1" @click.stop="delAddress(item)"></text>
		</view>
		<button class="add-btn" @click="addAddress('add')">新增地址</button>
	</view>
</template>

<script>
	import {mapGetters} from "vuex"
	export default {
		data() {
			return {
				source: 0
			}
		},
		onLoad(option){
			this.source = option.source;
			this.loadData();
		},
		computed:{
			...mapGetters("user",{
				addressInfo:"address"
			})
		},
		methods: {
			async loadData(){
				await this.$store.dispatch("user/getAddress")
			},
			//选择地址
			checkAddress(item){
				if(this.source == 1){
					//this.$api.prePage()获取上一页实例，在App.vue定义
					Object.assign(this.$api.prePage().addressData, item);
					uni.navigateBack()
				}
			},
			// 添加或编辑地址
			addAddress(type, item){
				uni.navigateTo({
					url: `/pages/address/addressManage?type=${type}&data=${JSON.stringify(item)}`
				})
			},
			//添加或修改成功之后回调
			refreshList(){
				//添加或修改后事件，这里直接在最前面添加了一条数据，实际应用中直接刷新地址列表即可
				this.loadData()
			},
			// 删除地址
			delAddress(item){
				uni.showModal({
					content: '确定要删除地址吗',
					success: async (res) => {
						if(res.confirm){
							uni.showLoading()
							await this.$store.dispatch('user/deleteAddress',{address_id: item.id})
							setTimeout(() => {				
								this.loadData()
								uni.hideLoading()
							}, 200)
						}
					}
				})
			}
		}
	}
</script>

<style lang='scss'>
	page {
		padding-bottom: 120upx;
	}
	.content {
		position: relative;
	}
	.list {
		display: flex;
		align-items: center;
		padding: 20upx 30upx;
		;
		background: #fff;
		position: relative;
	}
	.wrapper {
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.address-box {
		display: flex;
		align-items: center;
		.tag {
			font-size: 24upx;
			color: $base-color;
			margin-right: 10upx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4upx;
			padding: 4upx 10upx;
			line-height: 1;
		}
		.address {
			font-size: 30upx;
			color: $font-color-dark;
		}
	}
	.u-box {
		font-size: 28upx;
		color: $font-color-light;
		margin-top: 16upx;
		.name {
			margin-right: 30upx;
		}
	}
	.yticon {
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		padding-left: 30upx;
	}
	.icon-bianji {
		color: $font-color-light;
	}
	.icon-iconfontshanchu1 {
		color: red;
	}
	.add-btn {
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
