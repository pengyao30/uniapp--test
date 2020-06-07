<template>
	<view class="container">
		<!-- 轮播图 -->
		<view class="carousel">
			<swiper indicator-dots circular=true duration="400" :autoplay="autoplay" :interval="interval">
				<swiper-item class="swiper-item" v-for="(item,index) in prod.imgUrl" :key="index">
					<view class="image-wrapper">
						<image
							:src="item" 
							class="loaded" 
							mode="aspectFill"
						></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<!-- 商品信息 -->
		<view class="introduce-section">
			<text class="title">{{prod.description}}</text>
			<view class="price-box">
				<text class="price-tip">¥</text>
				<text class="price">{{prod.price}}</text>
				<text class="m-price">¥{{prod.market_price}}</text>
			</view>
			<view class="bot-row">
				<text>销量: {{prod.sold_count}}个</text>
				<text>库存: {{prod.stock}}个</text>
			</view>
		</view>
		<view class="c-list">
			<view class="c-row b-b" @click="toggleSpec">
				<text class="tit">购买类型</text>
				<view class="con">
					<text class="selected-text">
						{{prod.value}}
					</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>
			<view class="c-row b-b">
				<text class="tit">数量</text>
				<view class="box">
					<view class="left" @click="sub">-</view>
					<view class="center">{{prod.on_sale}}</view>
					<view class="right" @click="add">+</view>
				</view>
			</view>
			<view class="c-row b-b" v-if="prod.service_tags ? true : false">
				<text class="tit">服务</text>
				<text>{{prod.service_tags}}</text>
			</view>
		</view>
		
		<!-- 评价 -->
		<view class="eva-section">
			<view class="e-header">
				<text class="tit">评价</text>
				<text>({{total}})</text>
				<text class="tip">好评率 {{good_review}}</text>
				<text class="yticon icon-you"></text>
			</view> 

			<view class="eva-box">
				<view style="margin: 10upx auto;">
					无
				</view>
			</view>
			<!-- 商品的分页 -->
			<!-- total总条数 current当前页数 show-icon是否显示图标 @change切换分页的事件 pageSize每页的数据量 -->
			<uni-pagination 
				title="商品评价" 
				show-icon="true" 
				:total="total" 
				:current="current_page"
				:pageSize="per_page"
				@change="handlePage"></uni-pagination>
		</view>
		<view class="detail-desc">
			<view class="d-header">
				<text>图文详情</text>
			</view>
			<view style="width: 100%;text-align: center;" v-for="(item,index) in prod.imgUrl" :key="index">
				<image
					:src="item" 
					class="loaded" 
					mode="aspectFill"
				></image>
			</view>
		</view>
		
		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>首页</text>
			</navigator>
			<navigator url="/pages/cart/cart" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-gouwuche"></text>
				<text>购物车</text>
			</navigator>
			<view class="p-b-btn" :class="{active: productList.favorite}" @click="navTo(0)">
				<text class="yticon icon-shoucang"></text>
				<text>收藏</text>
			</view>	
			<view class="action-btn-group">
				<button type="primary" class=" action-btn no-border buy-now-btn" @click="navTo(1)">立即购买</button>
				<button type="primary" class=" action-btn no-border add-cart-btn" @click="navTo(2)">加入购物车</button>
				<uni-popup ref="popup" type="center">
				    <uni-popup-message type="info" message="添加购物车成功" :duration="1500"></uni-popup-message>
				</uni-popup>
			</view>
		</view>
		<!-- 规格-模态层弹窗 -->
		<view 
			class="popup spec" 
			:class="specClass"
			@touchmove.stop.prevent="stopPrevent"
			@click="toggleSpec"
		>
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t">
					<image :src="prod.img"></image>
					<view class="right">
						<text class="price">¥{{prod.price}}</text>
						<text class="stock">库存：{{prod.stock}} {{prod.name}}</text>
						<view class="selected">
							已选：
							<text class="selected-text">
								{{prod.value}} 
							</text>
						</view>
					</view>
				</view>
				<view v-for="(item,index) in specList" :key="index" class="attr-list">
					<text>{{item.name}}</text>
					<view class="item-list">
						<text v-for="(childItem, childIndex) in item.childlist" :key="childIndex" class="tit" :class="{selected: childItem.selected}"
						 @click="selectSpec(index,childIndex)">
							{{childItem.value}}
						</text>
					</view>
				</view>
				<view class="jsq">
					<text class="tit">数量</text>
					<view class="left" @click="sub">-</view>
					<view class="center">{{prod.on_sale}}</view>
					<view class="right" @click="add">+</view>
				</view>
				<button class="btn" @click="toggleSpec">完成</button>
			</view>
		</view>
		<!-- 分享 -->
		<share 
			ref="share" 
			:contentHeight="580"
			:shareList="shareList"
		></share>
	</view>
</template>

<script>
	// 功能
	import {mapGetters} from "vuex"
	import productMsg from "./productMsg.js"
	
	// 模块
	import uniPagination from '@/components/uni-pagination/uni-pagination.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'	
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'	
	import share from '@/components/share';
	export default{
		components: {
			uniPagination,//分页器
			uniPopup,//弹框
			uniPopupMessage,
			share
		},
		data() {
			return {
				prod:{},//保存一个类用来存储商品信息
				autoplay: true,
				interval: 2000,
				total:0,//记录总条数
				current_page:1,//当前页数
				per_page:5,//每页记录条数
				good_review:"",//好评率
				specClass: 'none',//css样式
				// 购买类型
				skus:[],
				index:0,
				specList: [],//保存选择的数据样式
				shareList: []
			};
		},
		computed:{
			// 获取产品详情
			...mapGetters("product",{
				productList:"GetProduct"
			}),
			// 获取产品推荐
			...mapGetters("product",{
				commentList:"GetComment"
			}),
		},
		async onLoad(options){
			//接收传值
			let id = options.id;
			this.getProd(id);
			this.shareList = await this.$api.json('shareList');
		},
		methods:{
			// 数组产品类型处理
			productHandle(){
				this.specList = this.prod.attrGroup.map((item, index) => {
					return {
						name: item,
						childlist: this.prod.attrItems[index].map((titem, tindex) => {
							return {
								value: titem,
								selected: tindex == 0 ? true : false
							}
						})
					}
				})
			},
			//选择规格
			selectSpec(index, cindex) {
				let list = this.specList[index].childlist
				list.forEach(item => {
					this.$set(item, 'selected', false);
				})
				this.$set(list[cindex], 'selected', true);
				//获取当前选择的规格组合值
				let specSelected = [];
				this.specList.forEach(item => {
					for (let cItem of item.childlist) {
						if (cItem.selected) {
							specSelected.push(cItem.value)
							break
						}
					}
				})
				//规格值则更改后也要改变该商品类型信息
				this.skus.forEach((item, index) => {
					if (item.value === specSelected.join(',')) {
						return this.index = index
					}
				})
				this.prod = new productMsg(this.productList,this.index)
			},
			// 获取商品详情信息
			async getProd(id){
				// 获取商品详情
				await this.$store.dispatch("product/getProduct",{id});
				this.prod = new productMsg(this.productList,this.index);
				this.skus = this.productList.skus
				// 商品类型
				this.productHandle();
				// 获取商品评论
				await this.$store.dispatch("product/getComment",{id,page:1});
				this.total = this.commentList.total;
				this.current_page = this.commentList.current_page
				this.per_page = this.commentList.per_page;
				this.good_review = this.commentList.good_review;
			},
			
			// 增加商品数量和减少商品数量
			sub(){
				if(this.prod.on_sale == 0){
					return null
				}
				this.prod.on_sale--;
			},
			add(){
				this.prod.on_sale++
			},
			// 商品分页
			handlePage(params){//params该参数能获取点击后的信息{type: "next", current: 2}
				let pageNum = params.current;
				let id = this.prod.id;
				const obj = {
					id:id,
					page:pageNum
				};
				this.$store.dispatch("product/getComment",obj);
			},
					
			//规格弹窗开关
			toggleSpec() {
				if(this.specClass === 'show'){
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				}else if(this.specClass === 'none'){
					this.specClass = 'show';
				}
			},
			async navTo(index){
				if(this.$store.state.hasLogin){
					if(index === 0){
						//收藏产品
						let form = {
							id: this.prod.id,
							state: this.productList.favorite == 0 ? 1 : 0
						}
						await this.$store.dispatch("product/getCollectionProduct",form);
						this.$set(this.productList, 'favorite', form.state)
					}else if(index === 1){
						// 购买
						uni.navigateTo({
							url: `/pages/order/createOrder?sku_id=${this.skus[this.index].id}&quantity=${this.prod.on_sale}`
						})
					}else{
						// 加入至购物车
						const {data}=await this.$store.dispatch("product/getProductCart",{sku_id:this.skus[this.index].id,quantity:this.prod.on_sale});
						if(data.code == 1){
							this.$refs.popup.open();
						}
					}
				}else{
					uni.navigateTo({
						url:`/pages/public/index`
					})
				}
			},
			stopPrevent(){}
		}
	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
		padding-bottom: 160upx;
	}
	.icon-you{
		font-size: $font-base + 2upx;
		color: #888;
	}
	.carousel {
		height: 722upx;
		position:relative;
		swiper{
			height: 100%;
		}
		.image-wrapper{
			width: 100%;
			height: 100%;
		}
		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
		}
		
	}
	
	/* 标题简介 */
	.introduce-section{
		background: #fff;
		padding: 20upx 30upx;
		
		.title{
			font-size: 32upx;
			color: $font-color-dark;
			height: 50upx;
			line-height: 50upx;
		}
		.price-box{
			display:flex;
			align-items:baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color:$uni-color-primary;
		}
		.price{
			font-size: $font-lg + 2upx;
		}
		.m-price{
			margin:0 12upx;
			color: $font-color-light;
			text-decoration: line-through;
		}
		.coupon-tip{
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx); 
		}
		.bot-row{
			display:flex;
			align-items:center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-light;
			text{
				flex: 1;
			}
		}
	}
	
	.c-list{
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;
		margin-top: 2px;
		.c-row{
			display:flex;
			align-items:center;
			padding: 20upx 30upx;
			position:relative;
		}
		.tit{
			width: 140upx;
		}
		.box{
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: flex-end;
			.left{
				width: 30upx;
				background-color: red;
				border-radius: 50%;
				text-align: center;
				font-weight: bold;
				color: #fff;
			}
			.center{
				width: 50upx;
				text-align: center;
			}
			.right{
				width: 30upx;
				background-color: red;
				border-radius: 50%;
				text-align: center;
				font-weight: bold;
				color: #fff;
			}
		}
		.con{
			flex: 1;
			color: $font-color-dark;
			.selected-text{
				margin-right: 10upx;
			}
		}
		.bz-list{
			height: 40upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;
			text{
				display: inline-block;
				margin-right: 30upx;
			}
		}
		.con-list{
			flex: 1;
			display:flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
		}
		.red{
			color: $uni-color-primary;
		}
	}
	
	/* 评价 */
	.eva-section{
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;
		.e-header{
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;
			.tit{
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				margin-right: 4upx;
			}
			.tip{
				flex: 1;
				text-align: right;
			}
			.icon-you{
				margin-left: 10upx;
			}
		}
	}
	.eva-box{
		display: flex;
		padding: 20upx 0;
		.portrait{
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}
		.right{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26upx;
			.con{
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20upx 0;
			}
			.bot{
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color:$font-color-light;
			}
		}
	}
	
	/*  详情 */
	.detail-desc{
		background: #fff;
		margin-top: 16upx;
		.d-header{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;
				
			text{
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}
			&:after{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc; 
			}
		}
	}
	
	/* 规格选择弹窗 */
	.attr-content{
		padding: 10upx 30upx;
		.a-t{
			display: flex;
			image{
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;;
			}
			.right{
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
				line-height: 42upx;
				.price{
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10upx;
				}
				.selected-text{
					margin-right: 10upx;
				}
			}
		}
		.attr-list{
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			padding-top: 30upx;
			padding-left: 10upx;
		}
		.item-list{
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;
			text{
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: $font-base;
				color: $font-color-dark;
			}
			.selected{
				background: #fbebee;
				color: $uni-color-primary;
			}
		}
		.jsq{
			width: 100%;
			height: 100%;
			display: flex;
			margin-top: 6px;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			.left{
				width: 30upx;
				background-color: red;
				border-radius: 50%;
				text-align: center;
				font-weight: bold;
				color: #fff;
				margin-left: 8px;
			}
			.center{
				width: 50upx;
				text-align: center;
			}
			.right{
				width: 30upx;
				background-color: red;
				border-radius: 50%;
				text-align: center;
				font-weight: bold;
				color: #fff;
			}
		}
	}
	
	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
		
		&.show {
			display: block;
			.mask{
				animation: showPopup 0.2s linear both;
			}
			.layer {
				animation: showLayer 0.2s linear both;
			}
		}
		&.hide {
			.mask{
				animation: hidePopup 0.2s linear both;
			}
			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}
		&.none {
			display: none;
		}
		.mask{
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}
		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;
			.btn{
				height: 66upx;
				line-height: 66upx;
				border-radius: 100upx;
				background: $uni-color-primary;
				font-size: $font-base + 2upx;
				color: #fff;
				margin: 30upx auto 20upx;
			}
		}
		@keyframes showPopup {
			0% {
				opacity: 0;
			}
			100% {
				opacity: 1;
			}
		}
		@keyframes hidePopup {
			0% {
				opacity: 1;
			}
			100% {
				opacity: 0;
			}
		}
		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}
			100% {
				transform: translateY(0%);
			}
		}
		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}
			100% {
				transform: translateY(120%);
			}
		}
	}
	
	/* 底部操作菜单 */
	.page-bottom{
		position:fixed;
		left: 30upx;
		bottom:30upx;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 690upx;
		height: 100upx;
		background: rgba(255,255,255,.9);
		box-shadow: 0 0 20upx 0 rgba(0,0,0,.5);
		border-radius: 16upx;
		
		.p-b-btn{
			display:flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: $font-color-base;
			width: 96upx;
			height: 80upx;
			.yticon{
				font-size: 40upx;
				line-height: 48upx;
				color: $font-color-light;
			}
			&.active, &.active .yticon{
				color: $uni-color-primary;
			}
			.icon-fenxiang2{
				font-size: 42upx;
				transform: translateY(-2upx);
			}
			.icon-shoucang{
				font-size: 46upx;
			}
		}
		.action-btn-group{
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30,#fa436a,#F56C6C);
			margin-left: 20upx;
			position:relative;
			&:after{
				content: '';
				position:absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255,255,255,.5);
			}
			.action-btn{
				display:flex;
				align-items: center;
				justify-content: center;
				width: 180upx;
				height: 100%;
				font-size: $font-base ;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}
	
</style>
