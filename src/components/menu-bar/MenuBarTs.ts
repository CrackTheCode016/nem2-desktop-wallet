import {isWindows} from "@/config/index.ts"
import monitorSelected from '@/common/img/window/windowSelected.png'
import monitorUnselected from '@/common/img/window/windowUnselected.png'
import {completeUrlWithHostAndProtocol, localRead, localSave} from "@/core/utils"
import {Component, Provide, Vue} from 'vue-property-decorator'
import {windowSizeChange, minWindow, maxWindow, unMaximize, closeWindow} from '@/core/utils/electron.ts'
import {mapState} from 'vuex'
import {NetworkType} from "nem2-sdk"
import {languageConfig} from "@/config/view/language"
import {nodeListConfig} from "@/config/view/node"
import {StoreAccount, AppWallet, AppInfo, Endpoint} from "@/core/model"
import routes from '@/router/routers'
import {validation} from "@/core/validation"
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'

@Component({
    components: {
        ErrorTooltip
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app',
        })
    }
})
export class MenuBarTs extends Vue {
    @Provide() validator: any = this.$validator
    validation = validation
    app: AppInfo
    nodeList: Endpoint[] = [] // @TODO: review node list
    activeAccount: StoreAccount
    showNodeList: boolean = false
    isWindows = isWindows
    inputNodeValue = ''
    isNowWindowMax = false
    monitorSelected = monitorSelected
    monitorUnselected = monitorUnselected
    languageList = languageConfig
    NetworkType = NetworkType
    closeWindow = closeWindow
    isShowNodeList = false

    get routes() {
        return routes[0].children
            .filter(({meta}) => meta.clickable)
            .map(({path, meta}) => ({path, meta}))
    }

    get isNodeHealthy() {
        return this.app.isNodeHealthy
    }

    get wallet() {
        return this.activeAccount.wallet || false
    }

    get walletList() {
        return this.app.walletList || []
    }

    get networkType() {
        return this.activeAccount.wallet ? NetworkType[this.activeAccount.wallet.networkType] : false
    }

    get node() {
        return this.activeAccount.node
    }

    get language() {
        return this.$i18n.locale
    }

    get nodeNetworkType() {
        return this.app.nodeNetworkType
    }

    get nodeNetworkTypeText() {
        const {nodeNetworkType} = this
        if (!this.isNodeHealthy) return this.$t('Invalid_node')
        return nodeNetworkType ? NetworkType[nodeNetworkType] : this.$t('Loading')
    }

    set language(lang) {
        this.$i18n.locale = lang
        localSave('locale', lang)
    }

    get currentWalletAddress() {
        if (!this.wallet) return null
        return this.activeAccount.wallet.address
    }

    get accountName() {
        return this.activeAccount.currentAccount.name
    }

    set currentWalletAddress(newActiveWalletAddress) {
        AppWallet.updateActiveWalletAddress(newActiveWalletAddress, this.$store)
    }

    get nodeLoading() {
        return this.app.nodeLoading
    }

    refreshValidate() {
        this.inputNodeValue = ''
        this.$validator.reset()
    }

    navigationIconClicked(route: any): void {
        if (!this.walletList.length) return
        if (this.$route.matched.map(({path}) => path).includes(route.path)) return
        this.$router.push(route.path)
    }

    accountQuit() {
        this.$store.commit('RESET_APP')
        this.$store.commit('RESET_ACCOUNT')
        this.$router.push("login")
    }

    maxWindow() {
        this.isNowWindowMax = !this.isNowWindowMax
        maxWindow()
    }

    unMaximize() {
        this.isNowWindowMax = !this.isNowWindowMax
        unMaximize()
    }

    minWindow() {
        minWindow()
    }

    removeNode(index) {
        this.nodeList.splice(index, 1)
        localSave('nodeList', JSON.stringify(this.nodeList))
    }

    selectEndpoint(index) {
        if (this.node == this.nodeList[index].value) return
        this.$store.commit('SET_NODE', this.nodeList[index].value)
        this.refreshValidate()

    }

    switchToNewNode() {
        let {inputNodeValue} = this
        const nodeAlreadyExistsFlag = this.nodeList.findIndex(item => item.value == inputNodeValue)
        if (nodeAlreadyExistsFlag !== -1) {
            this.nodeList.splice(nodeAlreadyExistsFlag, 1)
        }
        this.nodeList.unshift({
            value: inputNodeValue,
            name: inputNodeValue,
            url: inputNodeValue
        })
        this.selectEndpoint(0)
        localSave('nodeList', JSON.stringify(this.nodeList))
    }

    submitNodeInfo() {
        let {inputNodeValue} = this
        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) return
                this.inputNodeValue = completeUrlWithHostAndProtocol(inputNodeValue)
                this.switchToNewNode()
            })
    }

    initNodeList() {
        const nodeListData = localRead('nodeList')
        this.nodeList = nodeListData ? JSON.parse(nodeListData) : nodeListConfig
    }

    created() {
        if (isWindows) windowSizeChange()
        this.initNodeList()
    }
}
