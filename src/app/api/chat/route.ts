import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

export const maxDuration = 30;

const systemPrompt = `
你是一位擁有多年經驗的 Rene Cell 頂級臉部保養品專家。你的名字叫 美妝保養顧問。
你的語氣溫和、專業、充滿自信且非常關心顧客的肌膚狀況。
當訪客詢問保養、膚質或產品相關問題時，請給予專業且有幫助的建議。
【嚴格限制】：如果訪客詢問任何與臉部保養、肌膚護理、美妝或 Rene Cell 產品「完全無關」的問題（例如：寫程式、數學題、政治、法律等），請一律禮貌地拒絕回答，並將話題引導回肌膚保養。
【重要任務】：在對話過程中，如果時機合適，或者在你們已經對話了幾個回合（大約 3 到 5 次來回，絕對不能超過 10 句）後，請主動且委婉地邀請訪客留下他們的「姓名」以及「電話、Email 或 LINE ID (擇一即可)」，以便為他們安排免費的「線下實體臉部肌膚檢測與體驗課程」。
當訪客真的提供了他們的聯絡資訊後，你必須立即呼叫 \`saveContactInfo\` 工具來儲存這些資料！
`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o-mini', { structuredOutputs: false }),
    system: systemPrompt,
    messages,
    tools: {
      saveContactInfo: tool({
        description: '當使用者提供他們的姓名與聯絡方式（電話、Email 或 LINE）以預約線下體驗時，呼叫此工具將資料存檔。',
        parameters: z.object({
          name: z.string(),
          contactMethod: z.string(),
        }),
        execute: async ({ name, contactMethod }) => {
          try {
            // 1. Save to Excel/CSV
            const dataDir = path.join(process.cwd(), 'data');
            if (!fs.existsSync(dataDir)) {
              fs.mkdirSync(dataDir, { recursive: true });
            }
            const csvPath = path.join(dataDir, 'leads.csv');
            const now = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
            
            // Generate chat transcript
            const chatLog = messages
              .map((m: any) => `[${m.role}] ${m.content}`)
              .join(' | ')
              .replace(/"/g, '""'); // Escape quotes for CSV

            const csvRow = `"${now}","${name}","${contactMethod}","${chatLog}"\n`;

            if (!fs.existsSync(csvPath)) {
              fs.writeFileSync(csvPath, '\uFEFF"時間","姓名","聯絡方式","對談紀錄"\n', 'utf8'); // \uFEFF is BOM for Excel UTF-8 support
            }
            fs.appendFileSync(csvPath, csvRow, 'utf8');

            // 2. Send to Telegram
            const botToken = process.env.TELEGRAM_BOT_TOKEN;
            const chatId = process.env.TELEGRAM_CHAT_ID;

            if (botToken && chatId && botToken !== 'PUT_YOUR_TELEGRAM_BOT_TOKEN_HERE') {
              const tgMessage = `🎉 *有新客預約體驗！*\n\n*姓名*：${name}\n*聯絡方式*：${contactMethod}\n*時間*：${now}`;
              await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chat_id: chatId,
                  text: tgMessage,
                  parse_mode: 'Markdown',
                }),
              });
            }

            return `已成功儲存 ${name} 的聯絡資料 (${contactMethod})。請親切地告訴顧客我們已收到資訊，並會有專人盡快與他們聯繫安排體驗時間。`;
          } catch (error) {
            console.error('Error saving lead:', error);
            return '抱歉，系統儲存資料時發生錯誤。請告訴顧客系統暫時有問題，稍後再試。';
          }
        },
      }),
    },
  });

  console.log("KEYS:", Object.keys(result));
  return result.toDataStreamResponse();
}
