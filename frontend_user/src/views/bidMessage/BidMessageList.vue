<script>
export default {
	name: 'BidMessageList',
	data() {
		return {
			messageList: [],
			newMessageWS: undefined
		}
	},
	mounted() {
		this.initWS()
	},
	computed: {
		unreadListLength() {
			return this.messageList.filter(message => !message.isRead).length
		}
	},
	methods: {
		initWS() {
			this.newBiddingWS = new WebSocket('ws://localhost:9090/bid/news')

			this.newBiddingWS.onmessage = (msg) => {
				try {
					const bidding = JSON.parse(msg.data)
					const message = { bidding, isRead: false }
					this.messageList.unshift(message)
					this.$notify({
						title: '新投标',
						message: bidding.bidTitle,
						duration: 0,
						onClick: () => {
							this.handleClick({message})
						}
					})
				} catch (e) {
					console.log(e)
				}
			}
		},

		handleClick({message, index}) {
			if (message) {
				message.isRead = true
				this.$router.push(`/bid/biddingInfo?id=${message.bidding.id}`)
			}
			if (index !== undefined) {
				this.messageList[index].isRead = true
				this.$router.push(`/bid/biddingInfo?id=${this.messageList[index].bidding.id}`)
			}
		}
	},
	beforeDestroy() {
		console.log(this.newMessageWS)
	}
}
</script>

<template>
	<div>
		<el-popover>
			<template #reference>
				<el-badge :value="unreadListLength" :hidden="unreadListLength === 0">
					<!-- <i class="bell-fill"></i> -->
					<el-icon><BellFilled /></el-icon>
				</el-badge>
			</template>

			<div v-if="messageList.length === 0">
				<span>暂无消息</span>
			</div>

			<ul v-else style="height: 150px; width: 300px; padding: 10px; overflow-y: auto; list-style: none;">
				<li v-for="(message, index) in messageList" style="width: calc(100% - 20px)">
					<el-badge value="新投标！" :hidden="message.isRead">
						<div @click="handleClick({index})" style="line-height: 20px; max-height: 40px; overflow: hidden;">
              <span>{{ message.isRead ? '未读' : '已读' }}</span>
              <span>{{ message.bidding.bidTitle }}</span>
              <span>{{ message.bidding.bidPublishDatetime }}</span>
						</div>
					</el-badge>
				</li>
			</ul>
		</el-popover>
	</div>
</template>

<style scoped lang="scss">

</style>
