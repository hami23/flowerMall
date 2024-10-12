import { BehaviorWithStore } from 'mobx-miniprogram-bindings'
import { userStore } from '../../../../stores/userStore'

export const behaviorStore = BehaviorWithStore({

  storeBindings: {
    store: userStore,
    fields: ['userInfo'],
    actions: ['setUserInfo']
  }

})