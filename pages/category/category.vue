<template>
	<view class="content">
		<scroll-view scroll-y class="left-aside">
			<view class="f-item b-b" :class="{active: item.id === currentId}" v-for="item in categoryList" :key="item.id" @click="tabtap(item)">
				{{item.name}}
			</view>
		</scroll-view>
		<!-- @scroll滚动时触发该事件 scroll-top设置竖直滚动条位置 -->
		<scroll-view scroll-with-animation scroll-y class="right-aside" @scroll="asideScroll" :scroll-top="tabScrollTop">
			<view v-for="item in slist" :key="item.id" class="s-list" :id="'main-'+item.id">
				<text class="s-item">{{item.name}}</text>
				<view class="t-list">
					<view @click="navToList(titem.id)" v-if="titem.parent_id === item.id" class="t-item" v-for="titem in tlist" :key="titem.id">
						<image :src="titem.image"></image>
						<text>{{titem.name}}</text> 
					</view>
				</view>
			</view>
		</scroll-view>	
	</view>
</template>

<script>
	// 功能
	import {mapGetters} from "vuex"
	export default {
		data() {
			return {
				sizeCalcState: false,
				tabScrollTop: 0,//设置竖直滚动条位置
				currentId: "",//用于左侧导航栏点击变色
				// flist: [],
				slist: [],
				tlist: [],
			}
		},
		onLoad(){
			this.loadData();
		},
		computed:{
			...mapGetters("category",{
				categoryList:"GetCategory"
			})
		},
		methods: {
			// 获取菜单分类对象
			getChildList(parentObj,sonObj){
				parentObj.forEach(item => {
					item.childlist.forEach(sItem => {
						if(sItem.name == "wer"){
							return
						}
						sonObj.push(sItem)
					})
				})
			},
			async loadData(){
				uni.showLoading({
					title: '数据加载中...'
				});
				// 获取商品分类数据
				await this.$store.dispatch("category/getCategory")
				// 获取二级子菜单
				this.getChildList(this.categoryList,this.slist)
				// 获取三级子菜单
				this.getChildList(this.slist,this.tlist)
				console.log(this.categoryList)
				uni.hideLoading();
			},
			//一级分类点击
			tabtap(item){
				if(!this.sizeCalcState){
					this.calcSize();
				}
				this.currentId = item.id;
				let index = this.slist.findIndex(sitem=>sitem.parent_id === item.id);
				this.tabScrollTop = this.slist[index].top;
			},
			//右侧栏滚动
			asideScroll(e){
				if(!this.sizeCalcState){
					this.calcSize();
				}
				let scrollTop = e.detail.scrollTop;
				let tabs = this.slist.filter(item=>item.top <= scrollTop).reverse();
				if(tabs.length > 0){
					this.currentId = tabs[0].parent_id;
				}
			},
			//计算右侧栏每个tab的高度等信息
			calcSize(){//uni.createSelectorQuery()
				// 返回一个 SelectorQuery 对象实例。
				// 可以在这个实例上使用 select 等方法选择节点，并使用 boundingClientRect 等方法选择需要查询的信息
				// 使用 uni.createSelectorQuery() 需要在生命周期 mounted 后进行调用。
				// 自定义组件编译模式（默认模式），需要使用到 selectorQuery.in 方法。
				let h = 0;
				this.slist.forEach(item=>{
					let view = uni.createSelectorQuery().select("#main-" + item.id);
					view.fields({//动态设置高度
						size: true
					}, data => {
						item.top = h;
						h += data.height;
						item.bottom = h;
					}).exec();//执行所有的请求。请求结果按请求次序构成数组，在callback的第一个参数中返回。
				})
				this.sizeCalcState = true;
			},
			navToList(id){
				uni.navigateTo({
					url: `/pages/product/list?cat_id=${id}`
				})
			}
		}
	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
		background-color: #f8f8f8;
	}

	.content {
		display: flex;
	}
	.left-aside {
		flex-shrink: 0;
		width: 200upx;
		height: 100%;
		background-color: #fff;
	}
	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100upx;
		font-size: 28upx;
		color: $font-color-base;
		position: relative;
		&.active{
			color: $base-color;
			background: #f8f8f8;
			&:before{
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				height: 36upx;
				width: 8upx;
				background-color: $base-color;
				border-radius: 0 4px 4px 0;
				opacity: .8;
			}
		}
	}

	.right-aside{
		flex: 1;
		overflow: hidden;
		padding-left: 20upx;
	}
	.s-item{
		display: flex;
		align-items: center;
		height: 70upx;
		padding-top: 8upx;
		font-size: 28upx;
		color: $font-color-dark;
	}
	.t-list{
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 12upx;
		&:after{
			content: '';
			flex: 99;
			height: 0;
		}
	}
	.t-item{
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 176upx;
		font-size: 26upx;
		color: #666;
		padding-bottom: 20upx;
		
		image{
			width: 140upx;
			height: 140upx;
		}
	}
</style>
