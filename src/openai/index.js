import { remark } from 'remark'
import stripMarkdown from 'strip-markdown'
import { Configuration, OpenAIApi } from 'openai'
import dotenv from 'dotenv'
const env = dotenv.config().parsed // 环境参数

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export async function getGptReply(prompt) {
  console.log('🚀🚀🚀 / prompt', prompt)
  //let chosen_model = 'text-davinci-003'
  let chosen_model = 'gpt-3.5-turbo'
  let reply = ''
  //'gpt-3.5-turbo',
  if (chosen_model == 'text-davinci-003') {
    console.log('🚀🚀🚀 / Using model', chosen_model)
    const response = await openai.createCompletion({
      model: chosen_model,
      prompt: prompt,
      temperature: 0.8, // 每次返回的答案的相似度0-1（0：每次都一样，1：每次都不一样）
      max_tokens: 4_000,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.6,
      stop: [' Human:', ' AI:'],
    })

    reply = markdownToText(response.data.choices[0].text)
  } else if (chosen_model == 'gpt-3.5-turbo') {
    console.log('🚀🚀🚀 / Using model', chosen_model)
    const response = await openai.createChatCompletion({
      model: chosen_model,
      messages: [
        { "role": "system", content: "你是一名十分现实主义和悲观主义的老朋友，看穿一切洞察一切对生活充满失望，回答我的问题是尖锐又悲观一针见血，不带有任何助手或者机器的语气，要像一个生活中身边的一名老友一样跟我说话。特别注意：语气再语重心长一点，再生活化一点，再损友一点，可以像大学同寝室的室友，可以对我开玩笑贬低" },
        { "role": "user", content: prompt }
      ]
    })

    reply = markdownToText(response.data.choices[0].message.content)
  }
  console.log('🚀🚀🚀 / reply', reply)
  return `${reply}\nVia ${chosen_model}`
}

function markdownToText(markdown) {
  return remark()
    .use(stripMarkdown)
    .processSync(markdown ?? '')
    .toString()
}


