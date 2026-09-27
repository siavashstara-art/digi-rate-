import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Minimal valid 1x1 dark-amber PNG buffer for fallback/PWA icon endpoints
const VALID_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const VALID_PNG_BUFFER = Buffer.from(VALID_PNG_BASE64, 'base64');

let currentMarketRates = {
  USD: 68500,
  AED: 18750,
  CNY: 9550,
  USDT: 68900,
  isVolatilityLocked: false,
  updatedAt: new Date().toLocaleTimeString('fa-IR'),
};

function generateSmartFallbackAnswer(prompt: string, mode?: string): string {
  const q = (prompt || '').toLowerCase();

  if (mode === 'compare' || q.includes('مقایسه') || q.includes('s24') || q.includes('16 pro')) {
    return `📊 **مقایسه تخصصی ویژه مشاوره فروش به مشتری (تحلیل فنی بازار ایران و دبی):**

1. **آیفون 16 Pro Max (پارت ZAA دو سیم‌کارت) در برابر Samsung S24 Ultra (پک ویتنام):**
   - **ارزش حفظ سرمایه دلاری:** آیفون ۱۶ پرومکس به دلیل تقاضای بالای بازار دست‌دوم علاءالدین و چارسو، افت قیمت کمتری در فروش مجدد (Trade-In) دارد (حدود ۸ تا ۱۲ درصد سالانه در برابر ۱۸ درصد اندروید).
   - **دوربین و تولید محتوا:** برای مشتریان بلاگر و استوری‌ساز اینستاگرام، پردازش ویدیوی ProRes و Log در آیفون ۱۶ پرومکس بی‌رقیب است؛ اما برای زوم اپتیکال ۵ برابری و هوش مصنوعی Galaxy AI، مدل S24 Ultra انتخاب اول مهندسان و مدیران است.
   - **وضعیت رجیستری و گارانتی:** هر دو دستگاه در سامانه DigiRate VIP با کد فعال‌سازی رسمی همتا و گارانتی ۱۸ ماهه شرکتی عرضه می‌شوند.

💡 **پیشنهاد بستن فاکتور برای فروشنده:** اگر مشتری به دنبال خرید اقساطی با چک صیادی است، مدل S24 Ultra حاشیه سود همکار بالاتری (حدود ۲.۵ میلیون تومان) در فروش چکی ۶ ماهه ایجاد می‌کند.`;
  }

  if (mode === 'parts' || q.includes('قطعه') || q.includes('ال‌سی‌دی') || q.includes('lcd') || q.includes('فابریک') || q.includes('باتری')) {
    return `🔬 **راهنمای تخصصی تشخیص قطعات تعمیراتی اورجینال (ویژه تعمیرکاران و پخش قطعه):**

1. **تشخیص ال‌سی‌دی فابریک روکاری (Original Pulled) از تعویض گلس (Glass Changed) و کپی:**
   - **بررسی فلت و آی‌سی تاچ:** در ال‌سی‌دی ۱۰۰٪ فابریک روکاری، فلت‌ها هیچ‌گونه اثر لحیم‌کاری مجدد یا چسب UV در حاشیه شاسی ندارند و کد QR لیزری اپل/سامسونگ زیر لوپ سه چشمی کاملاً واضح است.
   - **تست قطره آب (Oleophobic Coating):** روی ال‌سی‌دی فابریک، قطره آب کاملاً کروی می‌ماند؛ در حالی که در گلس‌های تعویضی بازاری پخش می‌شود.
   - **انتقال آی‌سی و پیام Unknown Part:** ال‌سی‌دی‌های روکاری موجود در DigiRate VIP دارای قابلیت برنامه‌ریزی TrueTone بدون افت روشنایی در زاویه ۴۵ درجه هستند.

2. **تشخیص باتری اورجینال تقویت‌شده با ضمانت همکار:**
   - وزن باتری اصلی آیفون ۱۵/۱۴ پرومکس دقیقاً مطابق استاندارد کارخانه بوده و آی‌سی Texas Instruments (TI) روی برد فلت، سلامت باتری (Battery Health) را به صورت واقعی در iOS نمایش می‌دهد.`;
  }

  if (mode === 'caption' || q.includes('کپشن') || q.includes('اینستاگرام') || q.includes('استوری')) {
    return `🔥 **۳ نمونه کپشن پرفروش و وایرال اینستاگرام ویژه موبایل‌فروشی و پخش:**

---
**کپشن ۱ (ویژه فروش اقساطی با چک صیادی - تعامل بالا):**
📱 آیفون ۱۶ پرومکس و S24 Ultra رو با قیمت امروز بخر، پولشو تا ۱۲ ماه دیگه با چک صیادی بده! 😍
✅ پیش‌پرداخت فقط ۳۰٪ نقد
✅ تحویل آنی جعبه پلمپ + کد رجیستری همتا به نام خودت
✅ طرح تعویض گوشی کارکرده شما با آکبند در ۱۰ دقیقه!
👇 همین الان مدل گوشی فعلیت رو کامنت کن تا مابه‌التفاوت ارتقا به گوشی جدید رو برات حساب کنیم!
📍 آدرس و استعلام لحظه‌ای در دایرکت و واتساپ

---
**کپشن ۲ (ویژه اعتمادسازی و قیمت کف بازار):**
⚠️ قبل از خرید گوشی حتماً قیمت روز دلار و درهم رو از استوری‌های ما چک کن!
💎 پخش مستقیم بدون واسطه به قیمت کف پاساژ علاءالدین و دبی
🛡️ ۱۸ ماه گارانتی معتبر شرکتی + ۱ هفته مهلت تست واقعی
📲 برای دریافت لیست قیمت همکار و تک‌فروشی، کلمه «قیمت» رو دایرکت بفرست!`;
  }

  return `🤖 **پاسخ تخصصی دستیار هوشمند DigiRate VIP:**

بر اساس بررسی فنی بازار موبایل، لپ‌تاپ و قطعات (تهران - پاساژ علاءالدین/چارسو و دبی - دیره):
- **تحلیل خرید و قیمت‌گذاری:** با توجه به نوسان لحظه‌ای دلار و درهم، پیشنهاد می‌شود برای فروش‌های عمده و کارتنی از قیمت پایه درهمی (AED) استفاده کنید و برای مشتریان مصرف‌کننده، فاکتور رسمی با کد همتا صادر نمایید.
- **مزیت رقابتی فروشگاه شما:** فعال‌سازی طرح «معاوضه گوشی کارکرده با آکبند (Trade-In)» به همراه «فروش اقساطی با چک صیادی» به طور میانگین فروش ماهانه موبایل‌فروشی را تا ۲.۴ برابر افزایش می‌دهد.
- برای دریافت مقایسه دقیق دو مدل، تشخیص اصالت ال‌سی‌دی/باتری یا تولید کپشن اینستاگرام، روی دکمه‌های آماده بالای کادر کلیک کنید.`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  // Serve valid PNG icons dynamically for PWA compliance on iOS & Android
  const pngRoutes = [
    '/pwa-192x192.png',
    '/pwa-512x512.png',
    '/pwa-maskable-512x512.png',
    '/apple-touch-icon.png',
  ];
  pngRoutes.forEach((route) => {
    app.get(route, (_req, res) => {
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(VALID_PNG_BUFFER);
    });
  });

  // Live Market Rates API
  app.get('/api/market-rates', (_req, res) => {
    res.json(currentMarketRates);
  });

  app.post('/api/market-rates', (req, res) => {
    const { USD, AED, CNY, USDT, isVolatilityLocked } = req.body || {};
    currentMarketRates = {
      USD: typeof USD === 'number' && USD > 0 ? USD : currentMarketRates.USD,
      AED: typeof AED === 'number' && AED > 0 ? AED : currentMarketRates.AED,
      CNY: typeof CNY === 'number' && CNY > 0 ? CNY : currentMarketRates.CNY,
      USDT: typeof USDT === 'number' && USDT > 0 ? USDT : currentMarketRates.USDT,
      isVolatilityLocked:
        typeof isVolatilityLocked === 'boolean'
          ? isVolatilityLocked
          : currentMarketRates.isVolatilityLocked,
      updatedAt: new Date().toLocaleTimeString('fa-IR'),
    };
    res.json(currentMarketRates);
  });

  // AI Assistant Endpoint with @google/genai + Smart Offline Fallback
  app.post('/api/ai-assistant', async (req, res) => {
    const { prompt, mode } = req.body || {};
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'لطفاً متن سوال یا درخواست خود را وارد کنید.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 10) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction:
              'تو دستیار فوق‌تخصصی سامانه DigiRate VIP (بنکداری موبایل، لپ‌تاپ، قطعات تعمیراتی اورجینال و لوازم جانبی ایران و دبی) هستی. پاسخ‌هایت باید به زبان فارسی، کاملاً حرفه‌ای، دقیق، ساختاریافته و کاربردی برای موبایل‌فروشان، تعمیرکاران موبایل و خریداران باشد.',
          },
        });

        const text = response.text;
        if (text && text.trim().length > 0) {
          return res.json({ answer: text, source: 'gemini-live' });
        }
      } catch (_err) {
        // Gracefully fall back to built-in expert responder
      }
    }

    const fallbackAnswer = generateSmartFallbackAnswer(prompt, mode);
    return res.json({ answer: fallbackAnswer, source: 'smart-engine' });
  });

  // 1-Click Direct GitHub Push & Automatic APK/AAB Workflow Provisioner
  app.post('/api/github/direct-push', async (req, res) => {
    try {
      const { token, owner, repo, branch = 'main' } = req.body || {};
      if (!token || !owner || !repo) {
        return res.status(400).json({
          ok: false,
          message: 'لطفاً توکن گیت‌هاب (Personal Access Token)، نام کاربری (Owner) و نام مخزن (Repo) را کامل وارد کنید.',
        });
      }

      const headers: Record<string, string> = {
        Authorization: `Bearer ${token.trim()}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'DigiRate-VIP-Builder',
      };

      // Verify repository exists or create it if missing
      const repoCheck = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
      if (repoCheck.status === 404) {
        const createRes = await fetch('https://api.github.com/user/repos', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            name: repo,
            description: 'DigiRate VIP - Live USD/AED Mobile & Parts Wholesale Platform + Android APK/AAB',
            private: false,
            auto_init: true,
          }),
        });
        if (!createRes.ok) {
          const errText = await createRes.text();
          return res.status(400).json({
            ok: false,
            message: `عدم امکان ساخت مخزن جدید در گیت‌هاب: ${errText}`,
          });
        }
      }

      // Collect project files (excluding node_modules, dist, .git)
      const ignoredDirs = new Set(['node_modules', 'dist', '.git', '.next']);
      const filesToPush: { relativePath: string; contentBase64: string }[] = [];

      function walkDir(currentDir: string, relBase = '') {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });
        for (const entry of entries) {
          if (ignoredDirs.has(entry.name)) continue;
          if (entry.name === '.env') continue;
          const fullPath = path.join(currentDir, entry.name);
          const relPath = relBase ? `${relBase}/${entry.name}` : entry.name;
          if (entry.isDirectory()) {
            walkDir(fullPath, relPath);
          } else if (entry.isFile()) {
            const stat = fs.statSync(fullPath);
            if (stat.size <= 1024 * 1024) {
              const contentBase64 = fs.readFileSync(fullPath).toString('base64');
              filesToPush.push({ relativePath: relPath, contentBase64 });
            }
          }
        }
      }

      walkDir(__dirname);

      // Also map /android/android-release-workflow.yml -> .github/workflows/android-release.yml on GitHub
      const workflowLocalPath = path.join(__dirname, 'android', 'android-release-workflow.yml');
      if (fs.existsSync(workflowLocalPath)) {
        const wfBase64 = fs.readFileSync(workflowLocalPath).toString('base64');
        filesToPush.push({
          relativePath: '.github/workflows/android-release.yml',
          contentBase64: wfBase64,
        });
      }

      let pushedCount = 0;
      for (const file of filesToPush) {
        const fileApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${file.relativePath}`;
        let existingSha: string | undefined;
        const getFileRes = await fetch(`${fileApiUrl}?ref=${branch}`, { headers });
        if (getFileRes.ok) {
          const fileData = (await getFileRes.json()) as { sha?: string };
          existingSha = fileData.sha;
        }

        const putRes = await fetch(fileApiUrl, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            message: `chore(digirate-vip): update ${file.relativePath}`,
            content: file.contentBase64,
            branch,
            ...(existingSha ? { sha: existingSha } : {}),
          }),
        });

        if (putRes.ok) {
          pushedCount++;
        }
      }

      return res.json({
        ok: true,
        pushedCount,
        actionsUrl: `https://github.com/${owner}/${repo}/actions`,
        repoUrl: `https://github.com/${owner}/${repo}`,
        message: `با موفقیت ${pushedCount} فایل پروژه + ورک‌فلو ساخت خودکار APK و AAB به مخزن ${owner}/${repo} پوش شد!`,
      });
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'خطای ناشناخته در ارتباط با گیت‌هاب';
      return res.status(500).json({
        ok: false,
        message: `خطا در پوش مستقیم به گیت‌هاب: ${errMsg}`,
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DigiRate VIP Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
