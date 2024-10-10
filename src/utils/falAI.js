import * as fal from '@fal-ai/serverless-client'

const falModel = import.meta.env.VITE_FAL_MODEL

export const drawFn = async (prompt, falKey) => {
    console.log(falKey)
    fal.config({
        credentials: falKey // 或者返回字符串的函数
    })

  console.log('fal Start...')
  const result = await fal.run(falModel, {
    input: {
      prompt: prompt,
      image_size: 'landscape_4_3',
      num_inference_steps: 12, // realism 调为28
      guidance_scale: 3.5,
      num_images: 1,
      enable_safety_checker: true,
      strength: 1,
      output_format: 'jpeg'
    },
  })

  console.log(result)
  console.log('fal End...')
  return result
}
