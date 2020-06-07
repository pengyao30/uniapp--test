<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">LOGIN</view>
			<view class="welcome">
				欢迎回来！
			</view>
			<view class="bigbox">
				<view class="left">
					<text class="left_zh" @click="tabclick(0)" :style="{border:borderColor1,color:isColor1}">账号密码登录</text>
				</view>
				<view class="right">
					<text class="right_dx" @click="tabclick(1)" :style="{border:borderColor2,color:isColor2}">短信验证码登录</text>
				</view>
			</view>
			<view class="input-content">
				<view class="input-item" v-if="isShow">
					<text class="tit">帐号</text>
					<input 
						placeholder="请输入帐号"
						:value="username"
						data-key="username"
						@input="inputChange"
					/>
				</view>
				<view class="input-item" v-else>
					<text class="tit">手机号</text>
					<input 
						type="number" 
						:value="mobile" 
						placeholder="请输入手机号码"
						maxlength="11"
						data-key="mobile"
						@input="inputChange"
						disabled="true"
					/>
				</view>
				<view class="input-item">
					<text class="tit">密码</text>
					<input 
						type="mobile" 
						value="" 
						placeholder="8-18位不含特殊字符的数字、字母组合"
						placeholder-class="input-empty"
						maxlength="20"
						password 
						data-key="password"
						@input="inputChange"
						@confirm="toLogin"
					/>
				</view>
			</view>
			<button class="confirm-btn" @click="toLogin" :disabled="logining">登录</button>
			<view class="forget-section">
				忘记密码?
			</view>
		</view>
		<view class="register-section">
			还没有账号?
			<text @click="toRegist">马上注册</text>
		</view>
	</view>
</template>

<script>
	import {  
        mapMutations  
    } from 'vuex';
	
	export default{
		data(){
			return {
				isShow:true,//控制登录方式的切换
				// 定义方框样式和字体颜色
				borderColor1:"",
				isColor1:"",
				borderColor2:"",
				isColor2:"",
				// 帐号、密码、是否登录
				username:"admin",//帐号
				password:"12345678",
				loginWay:0,
				logining: false,
				mobile: ''//短信登录
			}
		},
		onLoad(){
			
		},
		methods: {
			// 控制登录方式的切换
			tabclick(num){
				if(num == 0){
					this.isShow = true;
					this.isColor2 = "#999"
					this.borderColor2 = "3px solid #F8F6FC"
					this.borderColor1 = "3px solid red"
					this.isColor1 = "red"
					// 登录方式
					this.loginWay = 0
				}else if(num == 1){
					this.isShow = false;
					this.isColor1 = "#999"
					this.borderColor1 = "3px solid #F8F6FC"
					this.borderColor2 = "3px solid red"
					this.isColor2 = "red"
					// 登录方式
					this.loginWay = 1
				}
			},
			inputChange(e){
				const key = e.currentTarget.dataset.key;
				// e.currentTarget指的是注册了事件监听器的对象，而e.target指的是该对象里的子对象，也是触发这个事件的对象！
				this[key] = e.detail.value;
			},
			navBack(){
				uni.navigateBack();
			},
			toRegist(){
				this.$api.msg('去注册');
			},
			async toLogin(){
				this.logining = true;
				const {username, password} = this;
				const sendData = {
					username,
					password,
					loginWay:this.loginWay
				};
				const data = await this.$store.dispatch("GetLogin",sendData)
				if(data.statusCode == 200){
					await this.$store.dispatch("GetUserInfo")
				    uni.navigateBack();  
				}else{
					this.$api.msg("用户名或密码错误！");
					this.logining = false;
				}
			}
		}
	}
</script>

<style lang='scss'>
	/* 登录方式 */
	.bigbox{
		width: 100%;
		margin-bottom: 20px;
		display: flex;
		text-align: center;
		font-size: 12px;
		box-sizing: border-box;
		color: #999;
		.left{
			flex-grow: 1;
			.left_zh{
				padding: 8px 15px;
				display: block;
				width: 120px;
				height: 40px;
				border-radius: 40px;
				border: 3px solid red;
				margin: 0 auto;
				color: red;
			}
		}
		.right{
			flex-grow: 1;
			.right_dx{
				padding: 8px 15px;
				display: block;
				width: 120px;
				height: 40px;
				border-radius: 40px;
				border: 3px solid #F8F6FC;
				margin: 0 auto;
			}
		}
	}
	page{
		background: #fff;
	}
	.container{
		padding-top: 115px;
		position:relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}
	.wrapper{
		position:relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}
	.back-btn{
		position:absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}
	.left-top-sign{
		font-size: 120upx;
		color: $page-color-base;
		position:relative;
		left: -16upx;
	}
	.right-top-sign{
		position:absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;
		&:before, &:after{
			display:block;
			content:"";
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}
		&:before{
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}
		&:after{
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}
	.left-bottom-sign{
		position:absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}
	.welcome{
		position:relative;
		left: 50upx;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0,0,0,.3);
	}
	.input-content{
		padding: 0 60upx;
	}
	.input-item{
		display:flex;
		flex-direction: column;
		align-items:flex-start;
		justify-content: center;
		padding: 0 30upx;
		background:$page-color-light;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;
		&:last-child{
			margin-bottom: 0;
		}
		.tit{
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm+2upx;
			color: $font-color-base;
		}
		input{
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}	
	}

	.confirm-btn{
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 70upx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;
		&:after{
			border-radius: 100px;
		}
	}
	.forget-section{
		font-size: $font-sm+2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40upx;
	}
	.register-section{
		position:absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;
		text{
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}
</style>
