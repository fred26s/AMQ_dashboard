import { ref } from 'vue'
import request from "./index"

export function useFetch(url, option) {
  return new Promise((resolve, rejects) => {
    const data = ref({})
    const error = ref({})
    const result = ref({})
    const code = ref(0)
    const message = ref('')
    request({
      url,
      ...option
    })
      .then((res) => {
        data.value = res
        result.value = res.result
        code.value = res.code
        message.value = res.message
        resolve({ data, result, error, code, message })
      })
      .catch((error) => {
        error.value = error;
        rejects({ data, result, error })
      })

  })
}