<template>
	<view class="content">
		<view class="list">
			<empty v-if="collectionList && collectionList.length==0">
				
			</empty>
			<view class="item" v-for="(item,index) in collectionList" :key="index" @click="toDetail(item)">
				<view class="image-box">
					<text v-if="item.product==''|| item.product==null" ></text>
					<image v-else  class="image" :src="item.product.image[0]"></image>
				</view>
				<p v-if="item.product==''|| item.product==null"></p>
				<view class="text" v-else>
					<text class="title">{{item.product.title}}</text>
					<text class="price">￥{{item.product.price}}</text>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import empty from "@/components/empty";
	import {mapGetters} from "vuex"
	export default {
		components: {
			empty
		},
		data() {
			return {
				list: [],
				// alist:[]
			}
		},
		onLoad() {
			this.getList()
		},
		computed:{
			// 获取产品详情
			...mapGetters("user",{
				collectionList:"collection"
			}),
		},
		methods: {
			
			async getList() {
				await this.$store.dispatch("user/UserCollection");
				console.log(this.collectionList)
				// this.alist=this.collectionList.map(function(item,key){
				// 	item=item.product
				// 	return item
				// })
				// console.log(this.alist)
				// for (let item of this.alist) {
				// 	console.log(item.title)
					
				// }
				// console.log(typeof this.collectionList[0].product.title)
			},
			toDetail(item) {
				uni.navigateTo({
					url: '/pages/product/product?id=' + item.product.id
				})
			}
		}
	}
</script>

<style lang="scss">
	.list {
		display: flex;
		flex-direction: column;
		padding: 0 10upx;
		.item {
			display: flex;
			overflow: hidden;
			margin: 10upx 0;
			.image-box {
				display:  flex;
				height: 200upx;
				width: 200upx;
				.image {
					width: 100%;
					height: 100%;
				}
			}
			.text {
				font-size: $font-base;
				padding: 10px;
				display: flex;
				flex-direction: column;
				flex: 1;
				.title {
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
				.price {
					color: red;
					font-size: $font-base;
					margin: 10upx 0;
				}
			}
		}
	}
</style>
