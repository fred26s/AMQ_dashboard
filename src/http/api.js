import { ref } from 'vue'
import request from "./index"

export function useFetch(url, option) {
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
      })
    .catch((err) => (error.value = err))

  return { data, result, error }
}