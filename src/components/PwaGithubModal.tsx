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
  Copy,
  Check,
  FileCode,
} from 'lucide-react';

interface PwaGithubModalProps {
  isOpen: boolean;
  onClose: () => void;
  canTriggerNativeInstall: boolean;
  onTriggerNativeInstall: () => Promise<boolean>;
}

export const UNIFIED_GITHUB_WORKFLOW_YAML = `name: Build Signed APK & AAB + Web Bundle (Afrina FeeBan VIP | آفرینا فی‌بان)

on:
  push:
    branches: [ "main", "master" ]
  workflow_dispatch:

env:
  FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true

jobs:
  build-signed-release:
    runs-on: ubuntu-latest
    steps:
      - name: 1. Checkout Source Code
        uses: actions/checkout@v4

      - name: 2. Setup Node.js 20 & Build Bilingual FA/EN Web Bundle
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: 3. Install Dependencies, Build Web App & Bundle into Android Assets
        run: |
          npm install
          npm run build
          mkdir -p android/app/src/main/assets/www
          cp -r dist/* android/app/src/main/assets/www/

      - name: 4. Set up JDK 17 for Android Gradle
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: 5. Setup Gradle 8.5
        uses: gradle/actions/setup-gradle@v3
        with:
          gradle-version: '8.5'

      - name: 6. Automated Keystore Generation for Signed Release (Myket / CafeBazaar / Google Play)
        working-directory: ./android/app
        run: |
          if [ ! -f release-keystore.jks ]; then
            keytool -genkeypair -v \\
              -keystore release-keystore.jks \\
              -alias afrinavip \\
              -keyalg RSA \\
              -keysize 2048 \\
              -validity 10000 \\
              -storepass afrina123456 \\
              -keypass afrina123456 \\
              -dname "CN=Able Way City Afrina, OU=Afrina FeeBan VIP, O=Afrina Ecosystem, L=Tehran, ST=Tehran, C=IR"
          fi

      - name: 7. Build Signed Release APK (For Myket & CafeBazaar)
        working-directory: ./android
        env:
          KEYSTORE_PASSWORD: \${{ secrets.KEYSTORE_PASSWORD || 'afrina123456' }}
          KEY_ALIAS: \${{ secrets.KEY_ALIAS || 'afrinavip' }}
          KEY_PASSWORD: \${{ secrets.KEY_PASSWORD || 'afrina123456' }}
        run: gradle assembleRelease --no-daemon

      - name: 8. Build Signed Release App Bundle AAB (For Google Play Console)
        working-directory: ./android
        env:
          KEYSTORE_PASSWORD: \${{ secrets.KEYSTORE_PASSWORD || 'afrina123456' }}
          KEY_ALIAS: \${{ secrets.KEY_ALIAS || 'afrinavip' }}
          KEY_PASSWORD: \${{ secrets.KEY_PASSWORD || 'afrina123456' }}
        run: gradle bundleRelease --no-daemon

      - name: 9. Upload Signed APK (Myket & CafeBazaar Ready)
        uses: actions/upload-artifact@v4
        with:
          name: Afrina-FeeBan-VIP-Signed-APK-Myket-Bazaar
          path: android/app/build/outputs/apk/release/*.apk

      - name: 10. Upload Signed App Bundle AAB (Google Play Ready)
        uses: actions/upload-artifact@v4
        with:
          name: Afrina-FeeBan-VIP-Signed-AAB-GooglePlay
          path: android/app/build/outputs/bundle/release/*.aab

      - name: 11. Upload Built Bilingual Web Bundle (FA/EN Dist)
        uses: actions/upload-artifact@v4
        with:
          name: Afrina-FeeBan-VIP-Web-Bundle-FA-EN
          path: dist/

      - name: 12. Upload Digital Keystore Backup (.jks)
        uses: actions/upload-artifact@v4
        with:
          name: Afrina-FeeBan-Release-Keystore-JKS
          path: android/app/release-keystore.jks`;

export const UNIFIED_APP_BUILD_GRADLE = `plugins {
    id 'com.android.application'
}

android {
    namespace 'com.digirate.vip'
    compileSdk 34

    defaultConfig {
        applicationId "com.digirate.vip"
        minSdk 24
        targetSdk 34
        versionCode 2
        versionName "2.0.0-signed"
    }

    signingConfigs {
        release {
            def keystoreFile = file("release-keystore.jks")
            if (keystoreFile.exists()) {
                storeFile keystoreFile
                storePassword System.getenv("KEYSTORE_PASSWORD") ?: "afrina123456"
                keyAlias System.getenv("KEY_ALIAS") ?: "afrinavip"
                keyPassword System.getenv("KEY_PASSWORD") ?: "afrina123456"
                v1SigningEnabled true
                v2SigningEnabled true
            }
        }
    }

    buildTypes {
        release {
            minifyEnabled false
            shrinkResources false
            def keystoreFile = file("release-keystore.jks")
            if (keystoreFile.exists()) {
                signingConfig signingConfigs.release
            } else {
                signingConfig signingConfigs.debug
            }
        }
        debug {
            signingConfig signingConfigs.debug
        }
    }

    bundle {
        language { enableSplit = false }
        density { enableSplit = true }
        abi { enableSplit = true }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'androidx.webkit:webkit:1.10.0'
}`;

export const PwaGithubModal: React.FC<PwaGithubModalProps> = ({
  isOpen,
  onClose,
  canTriggerNativeInstall,
  onTriggerNativeInstall,
}) => {
  const [activeTab, setActiveTab] = useState<'workflow' | 'github' | 'pwa'>('workflow');
  const [ghToken, setGhToken] = useState<string>('');
  const [ghOwner, setGhOwner] = useState<string>('');
  const [ghRepo, setGhRepo] = useState<string>('afrina-feeban-vip');
  const [isPushing, setIsPushing] = useState<boolean>(false);
  const [copiedWorkflow, setCopiedWorkflow] = useState<boolean>(false);
  const [copiedGradle, setCopiedGradle] = useState<boolean>(false);
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
      <div className="relative w-full max-w-5xl rounded-2xl bg-[#0F1626] border border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                فایل یکپارچه Workflow گیت‌هاب + Gradle امضاشده (APK / AAB) + نصب ۱-کلیکی آیفون و اندروید
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Afrina FeeBan VIP (DigiRate) | آفرینا فی‌بان — Able Way City Afrina (`com.digirate.vip`)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Navigation Tabs */}
        <div className="px-6 pt-4 bg-slate-900/50 border-b border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pb-4">
            <button
              onClick={() => setActiveTab('workflow')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'workflow'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>۱. کپی یک‌دست فایل Workflow و Gradle (دستی)</span>
            </button>

            <button
              onClick={() => setActiveTab('github')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'github'
                  ? 'bg-amber-500 text-slate-950 shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              <span>۲. پوش خودکار ۱-کلیکی به گیت‌هاب از داخل برنامه</span>
            </button>

            <button
              onClick={() => setActiveTab('pwa')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'pwa'
                  ? 'bg-sky-500 text-slate-950 shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>۳. نصب ۱-کلیکی وب‌اپلیکیشن روی آیفون و اندروید</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {activeTab === 'workflow' && (
            <div className="space-y-6">
              {/* Unified Workflow YAML Block */}
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black text-emerald-400">
                      ۱. فایل یک‌دست و کامل GitHub Actions Workflow (مسیر در گیت‌هاب: <code>.github/workflows/android-release.yml</code>)
                    </h3>
                    <p className="text-xs text-slate-400">
                      این فایل به صورت خودکار هم سایت دوزبانه فارسی/انگلیسی را بیلد می‌کند، هم کلید امضای دیجیتال Keystore را می‌سازد و هم خروجی امضاشده APK (مایکت/بازار) و AAB (گوگل‌پلی) تحویل می‌دهد.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(UNIFIED_GITHUB_WORKFLOW_YAML);
                      setCopiedWorkflow(true);
                      setTimeout(() => setCopiedWorkflow(false), 2500);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black cursor-pointer shrink-0"
                  >
                    {copiedWorkflow ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>
                      {copiedWorkflow
                        ? '✓ کل فایل Workflow یک‌جا کپی شد!'
                        : 'کپی یک‌دست کل فایل Workflow (.yml)'}
                    </span>
                  </button>
                </div>

                <pre
                  dir="ltr"
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono-num text-emerald-300 overflow-x-auto max-h-72 leading-relaxed"
                >
                  {UNIFIED_GITHUB_WORKFLOW_YAML}
                </pre>
              </div>

              {/* Unified Gradle Block */}
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black text-amber-400">
                      ۲. فایل یک‌دست Gradle امضای ریلیز (مسیر: <code>android/app/build.gradle</code>)
                    </h3>
                    <p className="text-xs text-slate-400">
                      این فایل هم‌اکنون در پوشه <code>/android/app/build.gradle</code> پروژه شما ساخته شده است و برای کپی دستی نیز در کادر زیر قرار دارد:
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(UNIFIED_APP_BUILD_GRADLE);
                      setCopiedGradle(true);
                      setTimeout(() => setCopiedGradle(false), 2500);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black cursor-pointer shrink-0"
                  >
                    {copiedGradle ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>
                      {copiedGradle ? '✓ فایل build.gradle کپی شد!' : 'کپی یک‌دست فایل build.gradle'}
                    </span>
                  </button>
                </div>

                <pre
                  dir="ltr"
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono-num text-amber-300 overflow-x-auto max-h-60 leading-relaxed"
                >
                  {UNIFIED_APP_BUILD_GRADLE}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'github' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-200 leading-relaxed">
                <strong className="text-amber-400 block mb-1">
                  ✨ پوش خودکار ۱-کلیکی بدون نیاز به کپی دستی:
                </strong>
                علاوه بر کپی دستی در تب اول، اگر توکن گیت‌هاب خود را در کادر زیر وارد کنید، سرور برنامه به صورت خودکار تمام فایل‌های پروژه + پوشه <code>/android</code> + فایل <code>.github/workflows/android-release.yml</code> را به مخزن گیت‌هاب شما منتقل کرده و بیلد APK و AAB را استارت می‌زند!
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
                      placeholder="afrina-feeban-vip"
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
            </div>
          )}

          {activeTab === 'pwa' && (
            <div className="space-y-5">
              {canTriggerNativeInstall && (
                <div className="p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-white">
                      مرورگر شما آماده نصب مستقیم ۱-کلیکی Afrina FeeBan VIP است!
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
                      اپلیکیشن <strong>Afrina FeeBan VIP</strong> به صورت تمام‌صفحه روی آیفون شما اجرا می‌شود!
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
                      همچنین برای دریافت فایل نصبی <strong>APK</strong> و <strong>AAB</strong> امضاشده به تب اول یا دوم همین پنجره بروید.
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
          )}
        </div>
      </div>
    </div>
  );
};
