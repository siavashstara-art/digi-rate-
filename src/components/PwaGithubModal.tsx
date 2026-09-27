import React, { useState } from 'react';
import {
  X,
  Smartphone,
  GitBranch,
  CheckCircle2,
  Download,
  Share2,
  Loader2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface PwaGithubModalProps {
  isOpen: boolean;
  onClose: () => void;
  canTriggerNativeInstall: boolean;
  onTriggerNativeInstall: () => Promise<boolean>;
}

export const PwaGithubModal: React.FC<PwaGithubModalProps> = ({
  isOpen,
  onClose,
  canTriggerNativeInstall,
  onTriggerNativeInstall,
}) => {
  const [activeTab, setActiveTab] = useState<'pwa' | 'github'>('pwa');
  const [ghToken, setGhToken] = useState<string>('');
  const [ghOwner, setGhOwner] = useState<string>('');
  const [ghRepo, setGhRepo] = useState<string>('digirate-vip-app');
  const [isPushing, setIsPushing] = useState<boolean>(false);
  const [pushResult, setPushResult] = useState<{
    ok: boolean;
    message: string;
    actionsUrl?: string;
    repoUrl?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleDirectGithubPush = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPushing(true);
    setPushResult(null);
    try {
      const response = await fetch('/api/github/direct-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: ghToken,
          owner: ghOwner,
          repo: ghRepo,
          branch: 'main',
        }),
      });
      const data = await response.json();
      setPushResult(data);
    } catch (_err) {
      setPushResult({
        ok: false,
        message: 'خطا در برقراری ارتباط با سرور جهت پوش گیت‌هاب.',
      });
    } finally {
      setIsPushing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#0F1626] border border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                نصب ۱-کلیکی اپلیکیشن (PWA آیفون و اندروید) + خروجی APK / AAB و پوش مستقیم گیت‌هاب
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                پکیج کامل اندروید (`com.digirate.vip`) آماده انتشار در گوگل‌پلی، کافه‌بازار و مایکت
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

        {/* Tabs */}
        <div className="px-6 pt-4 bg-slate-900/50 border-b border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-4">
            <button
              onClick={() => setActiveTab('pwa')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'pwa'
                  ? 'bg-sky-500 text-slate-950 shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>📲 نصب آنی روی آیفون (iOS) و اندروید (PWA)</span>
            </button>
            <button
              onClick={() => setActiveTab('github')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'github'
                  ? 'bg-amber-500 text-slate-950 shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              <span>🚀 پوش مستقیم ۱-کلیکی به گیت‌هاب + ساخت خودکار APK و AAB</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {activeTab === 'pwa' ? (
            <div className="space-y-5">
              {canTriggerNativeInstall && (
                <div className="p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-white">
                      مرورگر شما آماده نصب مستقیم ۱-کلیکی DigiRate VIP است!
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      با کلیک روی دکمه روبرو، آیکون برنامه مستقیماً به صفحه اصلی گوشی یا دسکتاپ شما اضافه می‌شود.
                    </p>
                  </div>
                  <button
                    onClick={onTriggerNativeInstall}
                    className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs whitespace-nowrap cursor-pointer"
                  >
                    نصب فوری با ۱ کلیک (Install App)
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-amber-400">
                      🍎 راهنمای نصب روی آیفون و آیپد (iOS Safari)
                    </h3>
                    <Share2 className="w-5 h-5 text-amber-400" />
                  </div>
                  <ol className="space-y-2.5 text-xs text-slate-300 leading-relaxed list-decimal list-inside">
                    <li>
                      این صفحه را در مرورگر <strong>Safari</strong> آیفون باز کنید.
                    </li>
                    <li>
                      در نوار پایین، روی دکمه <strong>Share</strong> (مربع با فلش رو به بالا) بزنید.
                    </li>
                    <li>
                      گزینه <strong>Add to Home Screen</strong> را انتخاب کرده و در بالا روی <strong>Add</strong> بزنید.
                    </li>
                    <li>
                      اپلیکیشن <strong>DigiRate VIP</strong> به صورت تمام‌صفحه (Standalone) و بدون نوار مرورگر روی آیفون شما اجرا می‌شود!
                    </li>
                  </ol>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-emerald-400">
                      🤖 راهنمای نصب روی گوشی‌های اندروید (Chrome)
                    </h3>
                    <Download className="w-5 h-5 text-emerald-400" />
                  </div>
                  <ol className="space-y-2.5 text-xs text-slate-300 leading-relaxed list-decimal list-inside">
                    <li>
                      روی منوی سه‌نقطه (⋮) در بالای مرورگر کروم کلیک کنید.
                    </li>
                    <li>
                      گزینه <strong>Install App</strong> یا <strong>Add to Home screen</strong> را لمس کنید.
                    </li>
                    <li>
                      همچنین برای دریافت فایل نصبی <strong>APK</strong> و <strong>AAB</strong> جهت انتشار در کافه‌بازار، مایکت و گوگل‌پلی به تب «پوش مستقیم گیت‌هاب» بروید.
                    </li>
                  </ol>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>فایل‌های `public/manifest.json`، `sw.js` و پوشه کامل `/android` با Gradle 8.5 آماده هستند.</span>
                </span>
                <span className="font-mono-num text-amber-400">Package: com.digirate.vip</span>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-200 leading-relaxed">
                <strong className="text-amber-400 block mb-1">
                  ✨ حل قطعی محدودیت پوش گیت‌هاب + ساخت خودکار APK و AAB:
                </strong>
                فایل ورک‌فلو در مسیر <code>/android/android-release-workflow.yml</code> قرار گرفته تا دکمه گیت‌هاب خود AI Studio هیچ‌وقت خطای Permission Denied ندهد. علاوه بر آن، با وارد کردن توکن گیت‌هاب در فرم زیر، سرور مستقیماً تمام فایل‌ها + فایل <code>.github/workflows/android-release.yml</code> را به مخزن شما پوش کرده و GitHub Actions به صورت خودکار فایل‌های <strong>APK</strong> و <strong>AAB</strong> را می‌سازد!
              </div>

              <form onSubmit={handleDirectGithubPush} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      نام کاربری گیت‌هاب (Owner):
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      required
                      value={ghOwner}
                      onChange={(e) => setGhOwner(e.target.value)}
                      placeholder="e.g. siavashhamiri"
                      className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-xs text-white font-mono-num"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      نام مخزن (Repository Name):
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      required
                      value={ghRepo}
                      onChange={(e) => setGhRepo(e.target.value)}
                      placeholder="digirate-vip-app"
                      className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-xs text-white font-mono-num"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      توکن دسترسی گیت‌هاب (PAT Token با دسترسی repo و workflow):
                    </label>
                    <input
                      type="password"
                      dir="ltr"
                      required
                      value={ghToken}
                      onChange={(e) => setGhToken(e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-xs text-white font-mono-num"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPushing}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-extrabold text-sm transition-colors cursor-pointer"
                >
                  {isPushing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>در حال انتقال کل فایل‌ها و فعال‌سازی ساخت APK/AAB در گیت‌هاب...</span>
                    </>
                  ) : (
                    <>
                      <GitBranch className="w-5 h-5" />
                      <span>پوش مستقیم ۱-کلیکی به گیت‌هاب و شروع ساخت APK + AAB</span>
                    </>
                  )}
                </button>
              </form>

              {pushResult && (
                <div
                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                    pushResult.ok
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-200'
                      : 'bg-rose-500/15 border-rose-500 text-rose-200'
                  }`}
                >
                  <div className="font-bold">{pushResult.message}</div>
                  {pushResult.ok && pushResult.actionsUrl && (
                    <div className="flex flex-wrap gap-3 pt-1">
                      <a
                        href={pushResult.actionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold"
                      >
                        <span>مشاهده و دانلود خروجی APK و AAB در GitHub Actions</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={pushResult.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-white font-bold"
                      >
                        <span>مشاهده مخزن گیت‌هاب</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  توکن شما در هیچ دیتابیسی ذخیره نمی‌شود و صرفاً در همان لحظه برای ارسال کدهای پروژه به اکانت گیت‌هاب خودتان استفاده می‌گردد.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
