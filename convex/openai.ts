import { v } from "convex/values";
import { action } from "./_generated/server";
import OpenAi from "openai";
import { SpeechCreateParams } from "openai/resources/audio/speech.mjs";
// import UnrealSpeech from "unrealspeech";

const openai = new OpenAi({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateAudioAction = action({
  args: { input: v.string(), voice: v.string() },
  handler: async (_, { voice, input }) => {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice as SpeechCreateParams["voice"],
      input,
    });
    const buffer = await mp3.arrayBuffer();

    return buffer;
  },
});
//1Gp5s2v1JCEQhv7UCNEj4awg2XEmnoUk4Mz8OSSw8CV3xj3mbBv94t
// const unrealSpeech = new UnrealSpeech(process.env.UNREALSPEECH_API_KEY!);

// export const generateAudio = action({
//   args: { input: v.string(), voice: v.string() },
//   handler: async (_, { voice, input }) => {
//     const mp3 = await unrealSpeech.speech(input, voice, "192k", "word", 0, 1.0);

//     const buffer = await mp3.arrayBuffer();
//     return buffer;
//   },
// });

export const generateThumbnailAction = action({
  args: { prompt: v.string() },
  handler: async (_, { prompt }) => {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });
    const url = response.data[0].url;
    if (!url) {
      throw new Error("Error generating thumbnail");
    }
    const imageResponse = await fetch(url);
    const buffer = await imageResponse.arrayBuffer();
    return buffer;
  },
});
