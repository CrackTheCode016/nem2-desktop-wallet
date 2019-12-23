import {localRead, localSave} from '@/core/utils'
import {Store} from 'vuex'
import {AppState,Endpoint} from '@/core/model'
import {defaultNodeList} from "@/config/view/node"

export class Endpoints {
 nodeList: Endpoint[]
 activeNode: string

 static async initialize(store: Store<AppState>): Promise<void> {
  try {
   await new Endpoints(store).init()
  } catch (error) {
   throw new Error(error)
  }
 }

 constructor(private readonly store: Store<AppState>) {
  this.nodeList = this.setNodeListFromLocalStorage()
  this.activeNode = this.getActiveNodeFromLocalStorage() || this.nodeList[0].value
  console.log("TCL: Endpoints -> constructor -> this.getActiveNodeFromLocalStorage()", this.getActiveNodeFromLocalStorage())
  // this.activeNode = this.getActiveNodeFromLocalStorage() || this.nodeList[0].url
 }

 private setNodeListFromLocalStorage(): Endpoint[] {
  try {
   const nodeList = localRead('nodeList')
   const parsedNodeList = JSON.parse(nodeList)
   if (parsedNodeList === ''
    || !parsedNodeList.length()
    || !(parsedNodeList.constructor !== Array)
   ) {
    this.setDefaultNodeListInLocalStorage()
    return defaultNodeList
   }

   return parsedNodeList
  } catch (error) {
    this.setDefaultNodeListInLocalStorage()
    return defaultNodeList
  }
 }

 private getActiveNodeFromLocalStorage(): string {
  const node = localRead('activeNode')
  console.log("TCL: Endpoints -> node", node)
  if (node === '' || typeof node!== 'string') return null
  return node
 }

 setDefaultNodeListInLocalStorage(): void {
  localSave('nodeList', defaultNodeList)
  this.store.commit('SET_NODE_LIST', defaultNodeList)
 }

 init(): Promise <void> {
  return new Promise((resolve) => {
    this.store.commit('SET_NODE', this.activeNode)
    console.log(this)
    resolve()
  })
 }
}
