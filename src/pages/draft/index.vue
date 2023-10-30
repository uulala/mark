<template>
	<view class="page-wrapper" :class="isLandScape ?  'h-style' : 'v-stle'">
		<canvas type="2d" id="myCanvas" class="draft" @touchstart="touchstart" @touchmove="touchmove"
			@touchend="touchend"></canvas>
		<view></view>
		<image class="page-btn pre"
			:src="pageHistory.length < 2 ? '/static/icon/ar-left3.png': '/static/icon/ar-left2.png'" @click="toPre">
		</image>
		<view class="page-btn current-page">第{{currentPage}}/{{pageHistory.length}}页</view>
		<image class="page-btn next" src="/static/icon/ar-right2.png" @click="toNext"></image>

		<view class="tool-wrapper">
			<view class="btn" @click="delPage">
				删除
			</view>
			<view class="btn" @click="clear">清空</view>
			<view class="tool-box">
				<view class="color color1" @click="setColor(color1)"></view>
				<view class="color color2" @click="setColor(color2)"></view>
				<view class="color color3" @click="setColor(color3)"></view>
				<view class="color color4" @click="setColor(color4)"></view>
				<view class="btn" @click="backDraw">撤销</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: "Hello",
				canvas: null,
				ctx: null,
				color1: "#7bdcb5",
				color2: "#8ed1fc",
				color3: "red",
				color4: "#333",
				width: 0,
				height: 0,
				currentPage: 1,
				pageHistory: [
					[]
				],
				linePoints: [],
				isLandScape: false // 是否横屏，默认为竖屏
			};
		},
		onResize() {
			let _this = this
			uni.getSystemInfo({
				success: function(res) {
					if (res.windowWidth > res.windowHeight) {
						// 横屏
						_this.isLandScape = true
					} else {
						// 竖屏
						_this.isLandScape = false
					}
				}
			})
		},
		onShareTimeline() {
			return {
				title: '梦想任务，即刻探索',
				path: "/pages/draft/index",
				imageUrl: "/static/img/avatar.jpg"
			}
		},
		onShareAppMessage() {
			console.log('onShareAppMessage')
			return {
				title: '梦想任务，即刻探索',
				path: "/pages/draft/index",
				imageUrl: "/static/img/avatar.jpg"
			}
		},
		onLoad() {
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			})

			const str = uni.getStorageSync('markdraft')
			const pageHistory = str ? JSON.parse(str) : [
				[]
			]
			this.pageHistory = pageHistory

			const query = wx.createSelectorQuery();
			query
				.select("#myCanvas")
				.fields({
					node: true,
					size: true
				})
				.exec((res) => {
					console.log(res[0]);
					const canvas = res[0].node;
					this.canvas = canvas
					const ctx = canvas.getContext("2d");

					const dpr = wx.getSystemInfoSync().pixelRatio;
					canvas.width = res[0].width * dpr;
					canvas.height = res[0].height * dpr;
					ctx.scale(dpr, dpr);
					ctx.lineWidth = 3;
					ctx.strokeStyle = this.color4;

					this.width = canvas.width;
					this.height = canvas.height;
					this.ctx = ctx;
					this.reDraw()
				});
		},
		onReady() {},
		methods: {
			touchstart(e) {
				const {
					x,
					y
				} = e.touches[0];
				this.ctx.beginPath();
				this.ctx.moveTo(x, y);
				this.linePoints = [{
					x,
					y
				}];
			},
			touchmove(e) {
				const {
					x,
					y
				} = e.touches[0];
				const {
					ctx
				} = this;
				ctx.lineTo(x, y);
				ctx.stroke(); // 在两个点之间连线
				this.linePoints.push({
					x,
					y
				});
			},
			touchend() {
				this.ctx.closePath();
				const line = {
					color: this.ctx.strokeStyle,
					linePoints: this.linePoints
				};
				this.pageHistory[this.currentPage - 1].push(line);
				console.log(this.pageHistory);
				uni.setStorageSync('markdraft', JSON.stringify(this.pageHistory))
			},
			backDraw() {
				this.pageHistory[this.currentPage - 1] = this.pageHistory[this.currentPage - 1].slice(0, -1)
				this.reDraw()
			},
			clear() {
				this.clearBoard();
				this.pageHistory[this.currentPage - 1] = [];
			},
			clearBoard() {
				const {
					width,
					height
				} = this;
				this.ctx.clearRect(0, 0, width, height);
			},
			setColor(color) {
				this.ctx.strokeStyle = color;
			},
			toPre() {
				if (this.currentPage > 1) {
					this.currentPage -= 1;
				} else {
					this.currentPage = this.pageHistory.length;
				}
				this.reDraw();
			},
			toNext() {
				if (this.currentPage < this.pageHistory.length) {
					this.currentPage += 1;
					this.reDraw();
				} else {
					this.addPage();
				}
			},
			reDraw() {
				this.clearBoard();
				console.log(this.pageHistory[this.currentPage - 1])
				this.pageHistory[this.currentPage - 1].map((item) => {
					const {
						color,
						linePoints: [fitst, ...restPoints],
					} = item;
					this.setColor(color);
					this.ctx.beginPath();
					this.ctx.moveTo(fitst.x, fitst.y);
					restPoints.map((it) => {
						const {
							x,
							y
						} = it;
						this.ctx.lineTo(x, y);
						this.ctx.stroke(); // 在两个点之间连线
					});
					this.ctx.closePath();
				});
			},
			addPage() {
				this.clearBoard();
				this.pageHistory.push([]);
				this.currentPage = this.pageHistory.length;
				console.log(this.pageHistory);
			},
			delPage() {
				this.pageHistory.splice(this.currentPage - 1, 1);
				console.log(this.pageHistory)
				if (this.pageHistory.length === 0) {
					this.clearBoard();
					this.pageHistory = [
						[]
					]
				} else {
					this.toPre()
				}
				uni.setStorageSync('markdraft', JSON.stringify(this.pageHistory))
			},
			// createImage() {
			// 	wx.canvasToTempFilePath({
			// 		canvas: this.canvas,
			// 		success: res => {
			// 			// 生成的图片临时文件路径
			// 			const tempFilePath = res.tempFilePath
			// 		},
			// 	})
			// },
		},
	};
</script>

<style>
	.page-wrapper {
		position: relative;
		height: 100vh;
		background: linear-gradient(to bottom, #c0e5fd, white);
	}

	.tool-wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 5px;
	}

	.tool-box {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.color {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		margin: 0 8px;
		padding: 4px;
	}

	.color1 {
		background: #7bdcb5;
	}

	.color2 {
		background: #8ed1fc;
	}

	.color3 {
		background: red;
	}

	.color4 {
		background: #333;
	}

	.btn {
		border: 1px solid #43b3fa;
		border-radius: 5px;
		padding: 3px 5px;
		background: #fff;
		color: #43b3fa;
	}

	.draft {
		width: 100vw;
		height: calc(100vh - 50px);
		/* border-top: 1px dashed #8ed1fc; */
	}

	.page-box {
		height: 40px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 10px;
	}

	.page-btn {
		position: absolute;
		/* background: #8ed1fc; */
		/* border: 1px dashed #8ed1fc; */
		border-radius: 5px;
		padding: 2px 3px;
		color: white;
		top: 35%;
		height: 30px;
		width: 30px;
	}

	.current-page {
		color: #888;
		width: 80px;
		text-align: center;
		left: calc(50% - 40px);
		top: 10px;
	}

	.pre {
		left: 5px;
	}

	.next {
		right: 5px;
	}
</style>