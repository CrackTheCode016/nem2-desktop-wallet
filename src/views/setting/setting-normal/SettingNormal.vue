<template>
  <div>
    <DebugConsole
            :visible="showDebugConsole"
            @close="showDebugConsole = false"
    />
    <div class="normal_set">
      <ul>
        <li>
          {{$t('switch_language')}}
          <div class="gray_content"><Select v-model="language">
            <Option v-for="item in languageList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select></div>
        </li>
        <li>
          {{$t('currency_setting')}}
          <div class="gray_content"><Select v-model="coin" :placeholder="$t('currency_setting')">
            <Option v-for="item in coinList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select></div>
        </li>
        <li>
          {{$t('set_explorer_link')}}
          <div class="auto-complete">
            <ErrorTooltip fieldName="nodeUrl">
              <AutoComplete v-validate="validation.nodeUrl"
                            :placeholder="$t('node')"
                            :data-vv-as="$t('node')"
                            data-vv-name="nodeUrl"
                            v-model="currentExplorerLink"
                            :data="defaultExplorerLinkList"
                            :filterMethod="explorerLinkFilterMethod"
                            placeholder="please input explorer url here"></AutoComplete>
            </ErrorTooltip>
            <span @click="setExplorerBasePath" class="radius pointer confirm-icon-button">{{$t('confirm')}}</span>
          </div>
        </li>
        <li>
          {{$t('Time_zone_setting')}}
          <div class="gray_content"><Select v-model="timeZone" :placeholder="$t('Time_zone_setting')">
            <Option v-for="item in timeZoneListData" :value="item.value" :key="item.value">
              {{ item.label }}
            </Option>
          </Select>
          </div>
        </li>
      </ul>

      <div class="debug-toggle">
        <span @click="showDebugConsole = !showDebugConsole">
          {{ showDebugConsole ? $t('hide_debug_console') : $t('show_debug_console') }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import "./SettingNormal.less"
    import {SettingNormalTs} from '@/views/setting/setting-normal/SettingNormalTs.ts';

    export default class SettingNormal extends SettingNormalTs {
    }
</script>
<style scoped lang="less">
</style>
