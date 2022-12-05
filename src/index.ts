import { bot } from '@/chat-bot';
import { printf } from '@/utils/base';

async function main() {
  const questions = [
    '你好',
    '熬夜有哪些坏处？',
    '如何被富婆包养？',
    '如何一夜暴富',
  ];
  for (const question of questions) {
    const answer = await bot.ask(question);
    printf(`👉 Q:${question}\n✅ A:${answer ?? '空空如也～'}\n`);
  }
}

main();
