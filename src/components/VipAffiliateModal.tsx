import React, { useState } from 'react';
import {
  X,
  Crown,
  Users,
  Check,
  Copy,
  Sparkles,
  Award,
  TrendingUp,
} from 'lucide-react';
import { VIP_TIERS, formatToman } from '../data/mockData';

interface VipAffiliateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'vip' | 'affiliate';
  activeVipLevel: number;
  onSelectVipLevel: (level: number) => void;
}

export const VipAffiliateModal: React.FC<VipAffiliateModalProps> = ({
  isOpen,
  onClose,
  initialView = 'vip',
  activeVipLevel,
  onSelectVipLevel,
}) => {
  const [view, setView] = useState<'vip' | 'affiliate'>(initialView);

  // Affiliate & White-Label Calculator State
  const [visitorName, setVisitorName] = useState<string>('');
  const [visitorPhone, setVisitorPhone] = useState<string>('');
  const [generatedCode, setGeneratedCode] = useState<string>('DR-VIP-8492');
  const [monthlySalesCount, setMonthlySalesCount] = useState<number>(12);
  const [selectedPlanPrice, setSelectedPlanPrice] = useState<number>(14800000); // Default White-Label VIP 5
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const commissionRate = 0.25; // 25% direct cash commission
  const monthlyCommissionIncome = Math.round(
    monthlySalesCount * selectedPlanPrice * commissionRate
  );

  const handleGenerateCode = () => {
    const cleanPhone = visitorPhone.replace(/[^0-9]/g, '').slice(-4) || '7740';
    const randomNum = Math.floor(100 + Math.random() * 900);
    setGeneratedCode(`VIP-${cleanPhone}-${randomNum}`);
  };

  const pitchScripts = [
    {
      title: '۱. متن مذاکره حضوری و واتساپی با غرفه‌داران پاساژ علاءالدین، چارسو و بازار بزرگ:',
      text: `سلام و عرض ادب خدمت همکار گرامی 🌟
برای اینکه موقع نوسان لحظه‌ای دلار و درهم دبی، مجبور نباشید روزی ۱۰ بار لیست قیمت گوشی و قطعات رو دستی توی کانال و واتساپ ویرایش کنید، سامانه هوشمند «DigiRate VIP» رو با نام و لوگوی اختصاصی پخش خودتون راه‌اندازی می‌کنیم:
✅ تغییر کل قیمت‌های تومانی گوشی، لپ‌تاپ و LCD در ۱ ثانیه فقط با تغییر نرخ دلار/درهم
✅ دکمه «قفل نوسان شدید بازار» و تبدیل خودکار قیمت‌ها به استعلام واتساپ
✅ استوری‌ساز ۱-کلیکی ۱۰۸۰×۱۹۲۰ با نام و تلفن فروشگاه شما
🎁 کد تخفیف و نمایندگی ویژه فعال‌سازی آنی: ${generatedCode}`,
    },
    {
      title: '۲. متن مذاکره با موبایل‌فروشان شهرستان (ویژه فروش اقساطی چک صیادی و معاوضه Trade-In):',
      text: `سلام همکار عزیز 🌹
می‌دونستید بیشترین سود موبایل‌فروشی الان توی «فروش اقساطی با چک صیادی» و «طرح تعویض گوشی کارکرده با آکبند» هست؟
با اپلیکیشن اختصاصی DigiRate VIP (قابل نصب ۱-کلیکی روی آیفون و اندروید مشتری):
🔹 مشتری خودش مدل گوشی کارکرده و سلامت باتریش رو وارد می‌کنه و مابه‌التفاوت نقدی یا چکی رو می‌بینه و مستقیم براتون توی واتساپ می‌فرسته!
🔹 دسترسی مستقیم به تابلوی حراج بار دبی (زیر فی علاءالدین) و قطعات فابریک با ۷ روز مهلت تست.
🔑 کد معرف VIP شما: ${generatedCode}`,
    },
  ];

  const handleCopyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-6xl rounded-2xl bg-[#0F1626] border border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                اشتراک VIP همکاران (سطوح ۱ تا ۵) + باشگاه ویزیتورهای پورسانتی (۲۵٪) و سفارش White-Label
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                اکوسیستم آفرینش · شهر جدید نیومتاورسیتی جهان · توان استیج FBNM
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

        {/* Switch Tabs */}
        <div className="px-6 pt-4 bg-slate-900/50 border-b border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-4">
            <button
              onClick={() => setView('vip')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                view === 'vip'
                  ? 'bg-amber-500 text-slate-950 shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>سطوح اشتراک VIP همکاران و بنکداران (VIP 1 تا VIP 5)</span>
            </button>
            <button
              onClick={() => setView('affiliate')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                view === 'affiliate'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>همکاری در فروش پورسانتی (۲۵٪) و سفارش اختصاصی White-Label</span>
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[78vh] overflow-y-auto space-y-6">
          {view === 'vip' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {VIP_TIERS.map((tier) => {
                const isSelected = activeVipLevel === tier.level;
                return (
                  <div
                    key={tier.level}
                    className={`flex flex-col justify-between p-4 rounded-2xl border transition-all ${
                      tier.popular
                        ? 'bg-slate-900 border-amber-500 shadow-xl'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400">
                          VIP LEVEL {tier.level}
                        </span>
                        {tier.popular && (
                          <span className="text-[11px] font-bold text-emerald-400">
                            پیشنهاد ویژه بنکداران
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-extrabold text-white leading-snug">
                        {tier.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {tier.audience}
                      </p>

                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <div className="text-[11px] text-slate-400">{tier.durationLabel}</div>
                        <div className="text-lg font-extrabold text-white font-mono-num mt-0.5">
                          {formatToman(tier.priceToman)} ت
                        </div>
                        <div className="text-[10px] text-emerald-400 mt-0.5">
                          {tier.monthlyEquivalent}
                        </div>
                      </div>

                      <div className="text-[11px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2">
                        {tier.creditCeilingText}
                      </div>

                      <ul className="space-y-2 pt-1">
                        {tier.features.map((f, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-1.5 text-xs text-slate-300 leading-relaxed"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => onSelectVipLevel(tier.level)}
                      className={`mt-5 w-full py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      }`}
                    >
                      {isSelected
                        ? `✓ سطح فعلی شما (VIP ${tier.level})`
                        : `فعال‌سازی سطح VIP ${tier.level}`}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Marketer Commission Calculator */}
                <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <TrendingUp className="w-5 h-5" />
                    <span>
                      ماشین‌حساب درآمد ماهانه ویزیتورها (۲۵٪ پورسانت نقدی آنی از هر فروش)
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-2">
                      نوع پکیج فروخته‌شده به موبایل‌فروشی یا پخش‌کننده قطعه:
                    </label>
                    <select
                      value={selectedPlanPrice}
                      onChange={(e) => setSelectedPlanPrice(Number(e.target.value))}
                      className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-xs text-white"
                    >
                      <option value={14800000}>
                        پکیج اختصاصی White-Label (VIP 5 با نام و لوگوی فروشگاه مشتری) — ۱۴,۸۰۰,۰۰۰ تومان
                      </option>
                      <option value={7900000}>
                        اشتراک ۱ ساله پخش‌کننده ممتاز (VIP 4) — ۷,۹۰۰,۰۰۰ تومان
                      </option>
                      <option value={4400000}>
                        اشتراک ۶ ماهه بنکدار طلایی (VIP 3) — ۴,۴۰۰,۰۰۰ تومان
                      </option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-300">
                        تعداد موبایل‌فروشی / غرفه‌دار جذب‌شده در ماه:
                      </span>
                      <span className="font-bold text-amber-400 font-mono-num">
                        {monthlySalesCount} فروشگاه در ماه
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={50}
                      value={monthlySalesCount}
                      onChange={(e) => setMonthlySalesCount(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                    <div>
                      <span className="block text-xs text-emerald-300">
                        درآمد خالص ماهانه شما (۲۵٪ پورسانت نقدی):
                      </span>
                      <span className="text-[11px] text-slate-400">
                        تسویه آنی پس از هر فاکتور در سراسر ایران و دبی
                      </span>
                    </div>
                    <div className="text-2xl font-extrabold text-emerald-400 font-mono-num">
                      {formatToman(monthlyCommissionIncome)} تومان
                    </div>
                  </div>
                </div>

                {/* Instant Affiliate ID Generator */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900 border border-amber-500/30 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                      <Award className="w-5 h-5" />
                      <span>صدور آنی کد نمایندگی فروش و سفارش White-Label</span>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">
                        نام و نام خانوادگی بازاریاب / نام فروشگاه:
                      </label>
                      <input
                        type="text"
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        placeholder="مثلاً: محمد محمدی - بازار موبایل"
                        className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">
                        شماره موبایل جهت ثبت پورسانت ۲۵٪:
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={visitorPhone}
                        onChange={(e) => setVisitorPhone(e.target.value)}
                        placeholder="09120000000"
                        className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white font-mono-num"
                      />
                    </div>
                    <button
                      onClick={handleGenerateCode}
                      className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                    >
                      صدور کد اختصاصی نمایندگی من
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">کد رسمی نمایندگی شما:</span>
                    <span className="text-base font-extrabold text-amber-400 font-mono-num">
                      {generatedCode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pitch Scripts */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>
                    متن‌های آماده مذاکره حضوری و واتساپی با غرفه‌داران علاءالدین، چارسو و موبایل‌فروشان:
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pitchScripts.map((script, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white mb-2">{script.title}</h4>
                        <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                          {script.text}
                        </pre>
                      </div>
                      <button
                        onClick={() => handleCopyText(script.text, idx)}
                        className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300 transition-colors cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>
                          {copiedIndex === idx
                            ? '✓ متن مذاکره با کد نمایندگی کپی شد!'
                            : 'کپی متن آماده مذاکره'}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
