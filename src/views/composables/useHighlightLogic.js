import { computed } from 'vue';

// 计算高亮横盘价格的位置
export function useHighlightLogic(traceItem, trigger) {
  const triggerLength = computed(() => {
    // 当前触发的策略形态
    let currentItem = trigger.value.find(e => {
      return traceItem.value.pathFlag.endsWith(e.join(','))
    })
    return currentItem ? currentItem.length : 0;
  });

  const SMALength = computed(() => {
    return traceItem.value.cloudSMAList.length;
  });

  // 计算高亮横盘价格的位置
  const highlightIndex = computed(() => {
    return SMALength.value - triggerLength.value;
  });

   // 若item.pathFlag 中某一项以trigger结尾
  // 则表示策略为待捕捉状态
  const flag = computed(() => {
    return trigger.value.some(e => {
      return  traceItem.value.pathFlag.endsWith(e.join(','))
    })
  })
  // 新增计算属性，用于确定哪些触发器应该被高亮显示
  const highlightTrigger = computed(() => {
    return trigger.value.map(e => traceItem.value.pathFlag.endsWith(e.join(',')));
  });

  return {
    highlightIndex,
    flag,
    highlightTrigger
  };
}
