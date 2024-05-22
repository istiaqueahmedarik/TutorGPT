'use server';




import { generateObject, generateText, streamObject, streamText } from 'ai';

import { google } from '@ai-sdk/google';

import { createStreamableValue } from 'ai/rsc';

import { z } from 'zod';

import { text } from 'stream/consumers';




export interface Message {

  role: 'user' | 'assistant';

  content: [];

}




export async function continueConversation(history: Message[],sd:string) {

  'use server';




  const stream = createStreamableValue();




  (async () => {

    const { partialObjectStream } = await streamObject({

      model: google('models/gemini-1.5-flash-latest'),

      system:

        sd,

      schema: z.object({

        type: z.literal('text'),

      mermaid: z.string().describe('A mermaid diagram  if needed for the response but mermaid diagram must be raw, no extra formatting. no new line character should be present in the mermaid diagram. if no need of mermaid diagram add a funny jokes related to the topic as diagram , background of the diagram should be #1D1D1D.'),

        text: z.string().describe('The oher response text in Markdown it should be in markdown format and should not contain any mermaid diagram. the text result should be dyslexic and other learning disabled friendly'),

      }),

      messages: history,

    });




    for await (const obj of partialObjectStream) {

      const str = JSON.stringify(obj);

      stream.update(str);

    }




    stream.done();

  })();




  return {

    messages: history,

    newMessage: stream.value,




  };

}




export async function continueConversationImage(history: Message[], sd: string) {

  console.log(sd);

  const streamText = createStreamableValue();




  (async () => {

    const result= await generateObject({

      model: google('models/gemini-1.5-flash-latest'),

      system:

        sd,

      schema: z.object({

        type: z.literal('text'),

        mermaid: z.string().describe('A mermaid diagram  if needed for the response but mermaid diagram must be raw, no extra formatting. no new line character should be present in the mermaid diagram. if no need of mermaid diagram add a funny jokes related to the topic as diagram, background of the diagram should be #1D1D1D.'),

        text: z.string().describe('The oher response text in Markdown it should be in markdown format and should not contain any mermaid diagram. the text result should be dyslexic and other learning disabled friendly'),

      }),

      messages: history,

  });




  console.log(result)

    streamText.update(JSON.stringify(result.object));

    streamText.done();

  })();







  return {

    messages: history,

    newMessage: streamText.value,

  }

}




export async function systemDesc(subject: string) {

  console.log('systemDesc called')

  const res = await generateText({

            model: google('models/gemini-1.5-flash-latest'),

            prompt: `create a system description for an AI to chat with a user about ${subject} like an expert, he must provide information about the subject, answer questions, and provide examples. in description add some example how it should response to user questions.`,

      });







  return res.text

}