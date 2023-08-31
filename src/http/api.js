import { ref } from 'vue'
import request from "./index"

export function useFetch(url, option) {
  return new Promise((resolve, rejects) => {
    const data = ref({})
    const error = ref({})
    const result = ref({})
    request({
      url,
      ...option
    })
      .then((res) => {
        data.value = res
        result.value = res.result
        resolve({ data, result, error })
      })
      .catch((error) => {
        error.value = error;
        rejects({ data, result, error })
      })

  })
}