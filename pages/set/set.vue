<template>
	<view class="container">
		<view class="list-cell b-b m-t" @click="navTo('修改昵称')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">修改昵称</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell b-b" @click="navTo('修改密码')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">修改密码</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<!-- before-close="false"不监听取消按钮 -->
		<uni-popup ref="popup" type="dialog">
		    <uni-popup-dialog 
				type="input" 
				mode="input" 
				:title="title" 
				:duration="2000" 
				:before-close="false" 
				@confirm="confirm">
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import {  
	    mapMutations  
	} from 'vuex';
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'	
	export default {
		components: {
			uniPopup,//弹框
			uniPopupDialog,
		},
		data() {
			return {
				title:""
			};
		},
		methods:{
			// 开启修改信息提示框，并且修改信息
			navTo(dec){
				// this.$api.msg(`跳转到${url}`);
				if(dec == "修改昵称"){
					this.title = dec
				}else if(dec == "修改密码"){
					this.title = dec;
				}
				this.$refs.popup.open();
			},
			async confirm(done,value){
			    // TODO 做一些其他的事情，手动执行 done 才会关闭对话框
				let params = {}
				if(this.title === '修改昵称'){
					params.nickname = value
				}else if(this.title === '修改密码'){
					params.password = value
				}
				const {data} = await this.$store.dispatch("GetEditUserInfo",params)
				if(data.code == 10000){
					this.$api.msg(data.msg);	
				}else{
					uni.setStorageSync('token', data.data.token);
					this.$store.dispatch('SaveInfo', data.data);
					this.$api.msg("修改成功");
					done()
				}
			    
			}
		}
	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
	}
	.list-cell{
		display:flex;
		align-items:baseline;
		padding: 20upx $page-row-spacing;
		line-height:60upx;
		position:relative;
		background: #fff;
		justify-content: center;
		&.log-out-btn{
			margin-top: 40upx;
			.cell-tit{
				color: $uni-color-primary;
				text-align: center;
				margin-right: 0;
			}
		}
		&.cell-hover{
			background:#fafafa;
		}
		&.b-b:after{
			left: 30upx;
		}
		&.m-t{
			margin-top: 16upx; 
		}
		.cell-more{
			align-self: baseline;
			font-size:$font-lg;
			color:$font-color-light;
			margin-left:10upx;
		}
		.cell-tit{
			flex: 1;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right:10upx;
		}
		.cell-tip{
			font-size: $font-base;
			color: $font-color-light;
		}
		switch{
			transform: translateX(16upx) scale(.84);
		}
	}
</style>
