import React, { useState, useEffect, useRef } from 'react';
import { X, Download, Image as ImageIcon, Sparkles, Check } from 'lucide-react';
import {
  ProductItem,
  MarketRates,
  calculateProductPrices,
  formatToman,
} from '../data/mockData';

interface StoryMakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  rates: MarketRates;
}

export const StoryMakerModal: React.FC<StoryMakerModalProps> = ({
  isOpen,
  onClose,
  products,
  rates,
}) => {
  const [storyMode, setStoryMode] = useState<'pricelist' | 'single'>('pricelist');
  const [storeName, setStoreName] = useState<string>('موبایل و دیجیتال رویال پلاس');
  const [storePhone, setStorePhone] = useState<string>('0912-000-0000 | 021-66700000');
  const [storeInsta, setStoreInsta] = useState<string>('@RoyalMobile.VIP');
  const [storeAddress, setStoreAddress] = useState<string>(
    'تهران، تقاطع جمهوری و حافظ، پاساژ چارسو، طبقه دوم'
  );
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [priceTypeForList, setPriceTypeForList] = useState<'retail' | 'wholesale'>('retail');
  const [downloadedToast, setDownloadedToast] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1080x1920 Full HD Story Canvas
    const W = 1080;
    const H = 1920;
    canvas.width = W;
    canvas.height = H;

    // Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#070B14');
    bgGrad.addColorStop(0.5, '#0F172A');
    bgGrad.addColorStop(1, '#090D16');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Decorative Top & Bottom Gold Borders
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 6;
    ctx.strokeRect(36, 36, W - 72, H - 72);

    // Header Banner
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(66, 76, W - 132, 220);
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 3;
    ctx.strokeRect(66, 76, W - 132, 220);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 52px Vazirmatn, sans-serif';
    ctx.fillText(storeName || 'فروشگاه موبایل و دیجیتال', W / 2, 160);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = '500 30px Vazirmatn, sans-serif';
    const todayFa = new Date().toLocaleDateString('fa-IR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    ctx.fillText(`بروزرسانی لحظه‌ای قیمت بازار: ${todayFa}`, W / 2, 225);

    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 26px Vazirmatn, monospace';
    ctx.fillText(
      `نرخ مبنا — دلار: ${formatToman(rates.USD)} ت | درهم دبی: ${formatToman(rates.AED)} ت`,
      W / 2,
      272
    );

    if (storyMode === 'pricelist') {
      // Mode A: Today's Top Selling Price List
      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 38px Vazirmatn, sans-serif';
      ctx.fillText(
        priceTypeForList === 'retail'
          ? '🔥 لیست قیمت ویژه مصرف‌کننده (پلمپ + کد رجیستری همتا)'
          : '💎 لیست قیمت کف همکار (پخش عمده و کارتنی امروز)',
        W / 2,
        365
      );

      const listItems = products.slice(0, 7);
      let startY = 420;
      const rowH = 158;

      listItems.forEach((item, idx) => {
        const pr = calculateProductPrices(item, rates);
        const displayPrice =
          priceTypeForList === 'retail' ? pr.retailToman : pr.wholesaleToman;

        // Card Box
        ctx.fillStyle = idx % 2 === 0 ? '#111827' : '#172033';
        ctx.fillRect(72, startY, W - 144, rowH - 18);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.strokeRect(72, startY, W - 144, rowH - 18);

        // Title (Right Aligned)
        ctx.textAlign = 'right';
        ctx.fillStyle = '#F8FAFC';
        ctx.font = 'bold 30px Vazirmatn, sans-serif';
        ctx.fillText(item.title.slice(0, 44), W - 105, startY + 55);

        ctx.fillStyle = '#94A3B8';
        ctx.font = '24px Vazirmatn, sans-serif';
        ctx.fillText(item.warrantyText.slice(0, 52), W - 105, startY + 105);

        // Price Badge (Left Aligned)
        ctx.textAlign = 'left';
        ctx.fillStyle = '#F59E0B';
        ctx.font = 'bold 36px Vazirmatn, monospace';
        ctx.fillText(`${formatToman(displayPrice)} تومان`, 105, startY + 82);

        startY += rowH;
      });
    } else {
      // Mode B: Single Product / Installment Promo Story (No Main Wholesaler Name)
      const item = products.find((p) => p.id === selectedProductId) || products[0];
      const pr = calculateProductPrices(item, rates);
      const downPayment30 = Math.round((pr.retailToman * 0.3) / 10000) * 10000;
      const rem = pr.retailToman - downPayment30;
      const monthly6 = Math.round(((rem * (1 + 0.035 * 6)) / 6) / 10000) * 10000;

      // Feature Box
      ctx.fillStyle = '#111827';
      ctx.fillRect(80, 340, W - 160, 1120);
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 4;
      ctx.strokeRect(80, 340, W - 160, 1120);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 38px Vazirmatn, sans-serif';
      ctx.fillText('✨ فروش ویژه نقدی و اقساطی با چک صیادی ✨', W / 2, 420);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 44px Vazirmatn, sans-serif';
      ctx.fillText(item.title.slice(0, 36), W / 2, 520);

      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 32px monospace';
      ctx.fillText(item.englishModel, W / 2, 585);

      // Specs Box
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(130, 640, W - 260, 220);
      ctx.fillStyle = '#E2E8F0';
      ctx.font = '30px Vazirmatn, sans-serif';
      ctx.fillText(`مشخصات: ${item.partNumberOrSpec}`, W / 2, 715);
      ctx.fillStyle = '#FDE047';
      ctx.fillText(`ضمانت: ${item.warrantyText}`, W / 2, 795);

      // Cash Price Box
      ctx.fillStyle = '#064E3B';
      ctx.fillRect(130, 900, W - 260, 210);
      ctx.fillStyle = '#A7F3D0';
      ctx.font = '32px Vazirmatn, sans-serif';
      ctx.fillText('قیمت ویژه نقدی امروز (با کد فعال‌سازی همتا):', W / 2, 965);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 56px Vazirmatn, monospace';
      ctx.fillText(`${formatToman(pr.retailToman)} تومان`, W / 2, 1055);

      // Installment Box
      ctx.fillStyle = '#451A03';
      ctx.fillRect(130, 1150, W - 260, 260);
      ctx.strokeStyle = '#F59E0B';
      ctx.strokeRect(130, 1150, W - 260, 260);

      ctx.fillStyle = '#FDE68A';
      ctx.font = 'bold 32px Vazirmatn, sans-serif';
      ctx.fillText(
        `شرایط اقساطی ۶ ماهه (فقط با ۳۰٪ پیش‌پرداخت: ${formatToman(downPayment30)} ت)`,
        W / 2,
        1225
      );
      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 50px Vazirmatn, monospace';
      ctx.fillText(`هر قسط ماهانه: ${formatToman(monthly6)} تومان`, W / 2, 1315);
      ctx.fillStyle = '#E2E8F0';
      ctx.font = '26px Vazirmatn, sans-serif';
      ctx.fillText('تحویل آنی جعبه پلمپ + طرح تعویض گوشی کارکرده با آکبند', W / 2, 1380);
    }

    // Footer Contact Info (Without Main Wholesaler Name!)
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(66, 1540, W - 132, 300);
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 3;
    ctx.strokeRect(66, 1540, W - 132, 300);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px Vazirmatn, monospace';
    ctx.fillText(`📞 تماس و واتساپ سفارش: ${storePhone}`, W / 2, 1620);

    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 32px Vazirmatn, monospace';
    ctx.fillText(`📲 پیج اینستاگرام: ${storeInsta}`, W / 2, 1690);

    ctx.fillStyle = '#CBD5E1';
    ctx.font = '26px Vazirmatn, sans-serif';
    ctx.fillText(`📍 آدرس حضوری: ${storeAddress}`, W / 2, 1765);
  }, [
    isOpen,
    storyMode,
    storeName,
    storePhone,
    storeInsta,
    storeAddress,
    selectedProductId,
    priceTypeForList,
    products,
    rates,
  ]);

  if (!isOpen) return null;

  const handleDownloadStory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `DigiRate-Story-${storyMode}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloadedToast(true);
    setTimeout(() => setDownloadedToast(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl bg-[#0F1626] border border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                استوری‌ساز ۱-کلیکی موبایل‌فروشی و پخش قطعه (HTML5 Canvas 1080×1920 HD)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                تولید فوری پوستر استوری با نام، لوگو و تلفن فروشگاه شما (بدون درج نام بنکدار اصلی)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[80vh] overflow-y-auto">
          {/* Left Settings */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => setStoryMode('pricelist')}
                className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all ${
                  storyMode === 'pricelist'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                الف) پوستر لیست قیمت لحظه‌ای امروز (۷ محصول)
              </button>
              <button
                onClick={() => setStoryMode('single')}
                className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all ${
                  storyMode === 'single'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                ب) پوستر معرفی تک‌محصول و فروش اقساطی
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>مشخصات اختصاصی فروشگاه شما روی پوستر استوری:</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">نام موبایل‌فروشی / پخش شما:</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">شماره تماس و واتساپ:</label>
                  <input
                    type="text"
                    value={storePhone}
                    onChange={(e) => setStorePhone(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white font-mono-num"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">آیدی پیج اینستاگرام:</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={storeInsta}
                    onChange={(e) => setStoreInsta(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white font-mono-num"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">آدرس فروشگاه / پاساژ:</label>
                  <input
                    type="text"
                    value={storeAddress}
                    onChange={(e) => setStoreAddress(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              {storyMode === 'pricelist' ? (
                <div className="pt-2">
                  <label className="block text-xs text-slate-400 mb-1.5">
                    نوع قیمت درج‌شده در لیست استوری:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPriceTypeForList('retail')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border ${
                        priceTypeForList === 'retail'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      قیمت تک‌فروشی مصرف‌کننده (با سود شما)
                    </button>
                    <button
                      onClick={() => setPriceTypeForList('wholesale')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border ${
                        priceTypeForList === 'wholesale'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      قیمت کف همکار (ویژه کانال پخش عمده)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-2">
                  <label className="block text-xs text-slate-400 mb-1.5">
                    انتخاب محصول جهت ساخت پوستر معرفی و فروش اقساطی:
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <button
              onClick={handleDownloadStory}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-lg transition-all cursor-pointer"
            >
              {downloadedToast ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>پوستر استوری با کیفیت 1080×1920 دانلود شد!</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>دانلود فوری پوستر استوری آماده اینستاگرام و واتساپ (PNG HD)</span>
                </>
              )}
            </button>
          </div>

          {/* Right Live Canvas Preview */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-950 rounded-2xl p-4 border border-slate-800">
            <span className="text-xs text-slate-400 mb-2">
              پیش‌نمایش زنده بوم استوری (۱۰۸۰×۱۹۲۰ پیکسل):
            </span>
            <canvas
              ref={canvasRef}
              className="w-full max-w-[270px] aspect-[9/16] rounded-xl border border-amber-500/40 shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
