export type LanguageCode = 'fa' | 'en' | 'ar' | 'zh' | 'ko' | 'ku' | 'tr';

export interface LanguageMeta {
  code: LanguageCode;
  label: string;
  nativeName: string;
  dir: 'rtl' | 'ltr';
  flag: string;
  speechLang: string;
}

export const LANGUAGES: LanguageMeta[] = [
  { code: 'fa', label: 'فارسی', nativeName: 'فارسی (IR)', dir: 'rtl', flag: '🇮🇷', speechLang: 'fa-IR' },
  { code: 'en', label: 'English', nativeName: 'English (Global)', dir: 'ltr', flag: '🇬🇧', speechLang: 'en-US' },
  { code: 'ar', label: 'العربية', nativeName: 'العربية (AE)', dir: 'rtl', flag: '🇦🇪', speechLang: 'ar-SA' },
  { code: 'zh', label: '中文', nativeName: '中文 (CN)', dir: 'ltr', flag: '🇨🇳', speechLang: 'zh-CN' },
  { code: 'ko', label: '한국어', nativeName: '한국어 (KR)', dir: 'ltr', flag: '🇰🇷', speechLang: 'ko-KR' },
  { code: 'ku', label: 'کوردی', nativeName: 'کوردی (KU)', dir: 'rtl', flag: '☀️', speechLang: 'fa-IR' },
  { code: 'tr', label: 'Türkçe', nativeName: 'Türkçe (TR)', dir: 'ltr', flag: '🇹🇷', speechLang: 'tr-TR' },
];

export const UI_TRANSLATIONS: Record<
  LanguageCode,
  {
    topEcosystemBanner: string;
    appNameFaEn: string;
    appSubtitle: string;
    liveRateTitle: string;
    quickAdjustBtn: string;
    lockVolatilityBtn: string;
    unlockVolatilityBtn: string;
    volatilityLockedAlert: string;
    installPwaBtn: string;
    compareBtn: string;
    proSuiteBtn: string;
    calcInstallmentBtn: string;
    storyMakerBtn: string;
    vipClubBtn: string;
    invoiceCartBtn: string;
    accessibilityTitle: string;
    adhdModeBtn: string;
    readAloudBtn: string;
    highContrastBtn: string;
    wholesaleLabel: string;
    retailLabel: string;
    addToInvoiceBtn: string;
    inquireWhatsappBtn: string;
    buyRequestsTitle: string;
    aiAssistantTitle: string;
    securityAutomatedBadge: string;
  }
> = {
  fa: {
    topEcosystemBanner:
      'Able Way City Afrina | اکوسیستم آفرینش · شهر جدید نیومتاورسیتی جهان · توان استیج FBNM',
    appNameFaEn: 'Afrina FeeBan VIP (DigiRate) | آفرینا فی‌بان (نرخ‌بان دیجیتال وی‌آی‌پی)',
    appSubtitle:
      'سامانه هوشمند فی لحظه‌ای دلاری/درهمی، بورس بنکداری موبایل، لپ‌تاپ، تبلت، قطعات تعمیراتی و لوازم جانبی ایران و دبی',
    liveRateTitle: 'تابلوی زنده نرخ ارز بنکداری (بروزرسانی ۰.۰۱ ثانیه کل کالاها)',
    quickAdjustBtn: 'تنظیم سریع نرخ ارز امروز توسط بنکدار',
    lockVolatilityBtn: '🔒 قفل نوسان شدید ارزی (تبدیل به استعلام واتساپ)',
    unlockVolatilityBtn: '🔓 باز کردن قفل نوسان و نمایش مجدد قیمت‌ها',
    volatilityLockedAlert:
      'حالت نوسان شدید ارزی فعال است — نمایش قیمت‌های ریالی موقتاً متوقف شده و سفارش‌ها از طریق استعلام مستقیم واتساپ انجام می‌شود.',
    installPwaBtn: '📲 نصب اپ + خروجی امضاشده AAB/APK',
    compareBtn: '⚖️ مقایسه تخصصی گوشی، لپ‌تاپ و تبلت',
    proSuiteBtn: '🏷️ لیبل QR ویترین + استعلام صیادی + پاسپورت قطعه',
    calcInstallmentBtn: '🧮 اقساط چک صیادی و معاوضه Trade-In',
    storyMakerBtn: '📸 استوری‌ساز HD موبایل‌فروشی',
    vipClubBtn: '👑 اشتراک VIP و پورسانت ۲۵٪',
    invoiceCartBtn: '🧾 پیش‌فاکتور رسمی IMEI',
    accessibilityTitle: 'دسترسی‌پذیری معلولان و تمرکز ADHD:',
    adhdModeBtn: '🧠 حالت تمرکز ADHD (کاهش شلوغی)',
    readAloudBtn: '🔊 خوانش صوتی قیمت‌ها (نابینایان)',
    highContrastBtn: '👁️ کنتراست ویژه و درشت‌نمایی',
    wholesaleLabel: 'قیمت کف همکار (عمده / کارتنی):',
    retailLabel: 'قیمت مصرف‌کننده (تک‌فروشی + کد همتا و گارانتی ۱۸ ماهه):',
    addToInvoiceBtn: 'افزودن به پیش‌فاکتور رسمی',
    inquireWhatsappBtn: 'استعلام لحظه‌ای واتساپ بنکداری',
    buyRequestsTitle: 'تابلوی زنده درخواست‌های خرید نقدی و لیست کسری همکاران شهرستان و دبی',
    aiAssistantTitle: 'دستیار هوشمند موبایل، تشخیص قطعات فابریک و کپشن‌ساز اینستاگرام',
    securityAutomatedBadge: 'کلیدهای API و امضای دیجیتال Gradle/AAB کاملاً اتوماسیون و ایمن‌سازی شده',
  },
  en: {
    topEcosystemBanner:
      'Able Way City Afrina | Afrina Creation Ecosystem · New Metaverse City · FBNM Stage Power',
    appNameFaEn: 'Afrina FeeBan VIP (DigiRate) | آفرینا فی‌بان (نرخ‌بان دیجیتال)',
    appSubtitle:
      'Global Live USD/AED/CNY Auto-Pricer & B2B Mobile, Laptop, Tablet & Original Parts Wholesale Hub',
    liveRateTitle: 'Live B2B Exchange Rate Matrix (0.01s Instant Catalog Re-Pricing)',
    quickAdjustBtn: 'Quick Wholesaler Rate Setup',
    lockVolatilityBtn: '🔒 Market Volatility Lock (Switch to 1-Click WhatsApp)',
    unlockVolatilityBtn: '🔓 Unlock Volatility Mode & Show Prices',
    volatilityLockedAlert:
      'High Currency Volatility Lock Active — Live prices are masked; click any item for instant WhatsApp quote.',
    installPwaBtn: '📲 1-Click Install + Signed AAB/APK',
    compareBtn: '⚖️ Peer Phone, Laptop & Tablet Compare',
    proSuiteBtn: '🏷️ Smart QR Shelf Tag + Check Inquiry + Parts Passport',
    calcInstallmentBtn: '🧮 Installment & Used Phone Trade-In Calc',
    storyMakerBtn: '📸 1-Click HD Story Maker',
    vipClubBtn: '👑 VIP Tiers & 25% Affiliate',
    invoiceCartBtn: '🧾 Official IMEI Proforma Cart',
    accessibilityTitle: 'Disability Accessibility & ADHD Focus Suite:',
    adhdModeBtn: '🧠 ADHD Focus Mode (Zero Distraction)',
    readAloudBtn: '🔊 Voice Screen Reader (Audio Prices)',
    highContrastBtn: '👁️ High Contrast & Large Font',
    wholesaleLabel: 'B2B Partner Wholesale Price (Carton / Bulk):',
    retailLabel: 'End-Consumer Price (18-Month Warranty + Registry):',
    addToInvoiceBtn: 'Add to Official Proforma',
    inquireWhatsappBtn: '1-Click WhatsApp Wholesale Quote',
    buyRequestsTitle: 'Live Cash Buy Requests & Partner Stock Shortages Board',
    aiAssistantTitle: 'Smart Hardware & Original Parts Inspector AI Assistant',
    securityAutomatedBadge: 'Server-Side Automated API Vault & Signed Gradle AAB/APK Ready',
  },
  ar: {
    topEcosystemBanner:
      'Able Way City Afrina | منظومة آفرينش · مدينة نيوميتافيرسيتي العالمية · منصة FBNM',
    appNameFaEn: 'Afrina FeeBan VIP (DigiRate) | أفرينا في بان (ديجي ريت VIP)',
    appSubtitle:
      'النظام الذكي لأسعار الهواتف واللابتوب والأجهزة اللوحية وقطع الغيار الأصلية بالجملة (دبي، إيران، الصين، تركيا، كوريا)',
    liveRateTitle: 'لوحة أسعار الصرف الحية لتجار الجملة (تحديث فوري خلال 0.01 ثانية)',
    quickAdjustBtn: 'تعديل سريع لسعر الصرف اليوم',
    lockVolatilityBtn: '🔒 قفل تقلبات السوق (تحويل إلى استفسار واتساب)',
    unlockVolatilityBtn: '🔓 إلغاء قفل السوق وإظهار الأسعار',
    volatilityLockedAlert:
      'وضع تقلب العملات مفعل حالياً — تم إيقاف عرض الأسعار مؤقتاً وتحويل الطلبات إلى واتساب مباشرة.',
    installPwaBtn: '📲 تثبيت التطبيق + حزمة AAB/APK الموقعة',
    compareBtn: '⚖️ مقارنة الهواتف واللابتوب والتابلت',
    proSuiteBtn: '🏷️ ملصق QR الذكي + فحص الشيكات + جواز القطع الأصلية',
    calcInstallmentBtn: '🧮 حاسبة الأقساط واستبدال الهواتف Trade-In',
    storyMakerBtn: '📸 صانع ستوري انستغرام HD',
    vipClubBtn: '👑 اشتراك VIP وعمولة 25%',
    invoiceCartBtn: '🧾 الفاتورة الرسمية IMEI',
    accessibilityTitle: 'إمكانية الوصول لذوي الاحتياجات وتركيز ADHD:',
    adhdModeBtn: '🧠 وضع تركيز ADHD (هدوء بصري)',
    readAloudBtn: '🔊 قراءة صوتية للأسعار (للمكفوفين)',
    highContrastBtn: '👁️ تباين عالي وتكبير الخط',
    wholesaleLabel: 'سعر الجملة للتجار (كرتون / كميات):',
    retailLabel: 'سعر المستهلك النهائي (مع الضمان الرسمي 18 شهر والتسجيل):',
    addToInvoiceBtn: 'إضافة إلى الفاتورة الرسمية',
    inquireWhatsappBtn: 'استفسار فوري عبر واتساب',
    buyRequestsTitle: 'لوحة طلبات الشراء النقدي الفوري ونواقص التجار',
    aiAssistantTitle: 'المساعد الذكي لمقارنة الهواتف وفحص الشاشات الأصلية',
    securityAutomatedBadge: 'مفاتيح API وتوقيع Gradle AAB/APK مؤمنة ومؤتمتة بالكامل',
  },
  tr: {
    topEcosystemBanner:
      'Able Way City Afrina | Afrina Yaratılış Ekosistemi · Yeni Metaversecity · FBNM Sahne Gücü',
    appNameFaEn: 'Afrina FeeBan VIP (DigiRate) | آفرینا فی‌بان وی‌آی‌پی',
    appSubtitle:
      'Canlı Döviz Kuru (USD/AED/CNY) Otomatik Fiyatlandırma, Cep Telefonu, Laptop, Tablet ve Orijinal Parça Toptan Merkezi',
    liveRateTitle: 'Canlı Toptancı Döviz Kuru Paneli (0.01 Saniyede Tüm Fiyatları Günceller)',
    quickAdjustBtn: 'Hızlı Döviz Kuru Ayarla',
    lockVolatilityBtn: '🔒 Kur Dalgalanma Kilidi (WhatsApp Teklif Modu)',
    unlockVolatilityBtn: '🔓 Kilidi Aç ve Fiyatları Göster',
    volatilityLockedAlert:
      'Yüksek Kur Dalgalanma Kilidi Aktif — Fiyatlar geçici olarak gizlendi, tek tıkla WhatsApp üzerinden anlık fiyat alabilirsiniz.',
    installPwaBtn: '📲 Uygulamayı Yükle + İmzalı AAB/APK',
    compareBtn: '⚖️ Telefon, Laptop ve Tablet Karşılaştır',
    proSuiteBtn: '🏷️ Akıllı Vitrin QR + Çek Sorgu + Orijinal Parça Pasaportu',
    calcInstallmentBtn: '🧮 Taksit ve Eski Telefonu Yenileme (Trade-In)',
    storyMakerBtn: '📸 1-Tıkla HD Story Oluşturucu',
    vipClubBtn: '👑 VIP Üyelik ve %25 Komisyon',
    invoiceCartBtn: '🧾 Resmi IMEI Proforma Fatura',
    accessibilityTitle: 'Engelli Erişilebilirliği ve ADHD Odaklanma Modu:',
    adhdModeBtn: '🧠 ADHD Odak Modu (Sade Görünüm)',
    readAloudBtn: '🔊 Sesli Fiyat Okuma (Görme Engelliler)',
    highContrastBtn: '👁️ Yüksek Kontrast & Büyük Font',
    wholesaleLabel: 'Bayi Toptan Fiyatı (Koli / Adetli):',
    retailLabel: 'Son Kullanıcı Fiyatı (18 Ay Garantili & Kayıtlı):',
    addToInvoiceBtn: 'Resmi Faturaya Ekle',
    inquireWhatsappBtn: 'WhatsApp Anlık Toptan Fiyat Al',
    buyRequestsTitle: 'Canlı Nakit Alım Talepleri ve Bayi Eksik Listesi',
    aiAssistantTitle: 'Akıllı Telefon Karşılaştırma ve Orijinal Ekran Test Asistanı',
    securityAutomatedBadge: 'API Anahtarları ve İmzalı Gradle AAB/APK Otomasyonu Aktif',
  },
  zh: {
    topEcosystemBanner:
      'Able Way City Afrina | 阿夫里纳创造生态系统 · 全球新元宇宙城市 · FBNM 舞台动力',
    appNameFaEn: 'Afrina FeeBan VIP (DigiRate) | 阿夫里纳智能核价 VIP',
    appSubtitle:
      '全球实时美元/迪拉姆/人民币智能定价系统 · 手机、笔记本电脑、平板与原装维修配件批发平台',
    liveRateTitle: '实时汇率看板 (0.01秒全站商品自动调价)',
    quickAdjustBtn: '批发商今日汇率快速设置',
    lockVolatilityBtn: '🔒 汇率剧烈波动锁定 (一键切换 WhatsApp 询价)',
    unlockVolatilityBtn: '🔓 解锁价格显示',
    volatilityLockedAlert: '当前处于汇率剧烈波动保护模式 — 终端价格已隐藏，请点击按钮通过 WhatsApp 实时询价。',
    installPwaBtn: '📲 一键安装 + 签名 AAB/APK',
    compareBtn: '⚖️ 手机、笔记本与平板专业对比',
    proSuiteBtn: '🏷️ 橱窗动态二维码价签 + 支票信用查询 + 原装配件数字护照',
    calcInstallmentBtn: '🧮 分期付款与以旧换新 (Trade-In)',
    storyMakerBtn: '📸 一键高清海报生成',
    vipClubBtn: '👑 VIP 会员与 25% 佣金',
    invoiceCartBtn: '🧾 正式 IMEI 形式发票',
    accessibilityTitle: '无障碍辅助与 ADHD 专注模式：',
    adhdModeBtn: '🧠 ADHD 专注模式 (极简防分心)',
    readAloudBtn: '🔊 语音播报价格 (视障辅助)',
    highContrastBtn: '👁️ 高对比度与大字号',
    wholesaleLabel: '同行批发底价 (整箱 / 批量)：',
    retailLabel: '终端零售价 (含 18 个月保修与官方注册)：',
    addToInvoiceBtn: '加入正式发票清单',
    inquireWhatsappBtn: 'WhatsApp 实时批发询价',
    buyRequestsTitle: '全国及迪拜同行现货求购与缺货实时看板',
    aiAssistantTitle: '智能硬件对比、原装拆机屏鉴别与营销文案助手',
    securityAutomatedBadge: 'API 密钥与 Gradle AAB/APK 签名已在服务端全自动安全配置',
  },
  ko: {
    topEcosystemBanner:
      'Able Way City Afrina | 아프리나 창조 생태계 · 뉴 메타버스 시티 · FBNM 스테이지 파워',
    appNameFaEn: 'Afrina FeeBan VIP (DigiRate) | 아프리나 피반 디지레이트 VIP',
    appSubtitle:
      '실시간 달러/디르함 자동 가격 연동 · 스마트폰, 노트북, 태블릿 및 정품 수리 부품 글로벌 도매 플랫폼',
    liveRateTitle: '실시간 도매 환율 보드 (0.01초 내 전체 상품 가격 자동 업데이트)',
    quickAdjustBtn: '도매상 오늘 환율 빠른 설정',
    lockVolatilityBtn: '🔒 환율 급변동 잠금 (WhatsApp 1클릭 문의 전환)',
    unlockVolatilityBtn: '🔓 가격 잠금 해제 및 표시',
    volatilityLockedAlert:
      '환율 급변동 보호 모드가 활성화되었습니다 — 실시간 가격 표시가 일시 중지되었으며 WhatsApp을 통해 즉시 견적을 받으실 수 있습니다.',
    installPwaBtn: '📲 앱 설치 (iOS/Android) + 서명된 AAB/APK',
    compareBtn: '⚖️ 스마트폰·노트북·태블릿 전문 비교',
    proSuiteBtn: '🏷️ 스마트 QR 진열장 가격표 + 수표 신용조회 + 정품 부품 여권',
    calcInstallmentBtn: '🧮 할부 및 중고폰 보상판매 (Trade-In)',
    storyMakerBtn: '📸 1클릭 HD 스토리 제작기',
    vipClubBtn: '👑 VIP 멤버십 및 25% 커미션',
    invoiceCartBtn: '🧾 공식 IMEI 견적서 장바구니',
    accessibilityTitle: '장애인 웹 접근성 및 ADHD 집중 모드:',
    adhdModeBtn: '🧠 ADHD 집중 모드 (시각적 복잡성 제거)',
    readAloudBtn: '🔊 가격 음성 안내 (시각장애인 지원)',
    highContrastBtn: '👁️ 고대비 및 큰 글씨 모드',
    wholesaleLabel: '파트너 도매 최저가 (박스 / 대량):',
    retailLabel: '소비자 소매가 (18개월 공식 보증 및 등록 포함):',
    addToInvoiceBtn: '공식 견적서에 추가',
    inquireWhatsappBtn: 'WhatsApp 실시간 도매 문의',
    buyRequestsTitle: '실시간 현금 매입 요청 및 파트너 재고 부족 현황판',
    aiAssistantTitle: '스마트 기기 비교, 정품 액정 판별 및 인스타그램 캡션 AI 어시스턴트',
    securityAutomatedBadge: '서버 측 API 보안 금고 및 서명된 Gradle AAB/APK 자동화 완료',
  },
  ku: {
    topEcosystemBanner:
      'Able Way City Afrina | ئیکۆسیستەمی ئافرینش · شاری نوێی میتاڤێرسی جیهان · هێزی ستەیجی FBNM',
    appNameFaEn: 'Afrina FeeBan VIP (DigiRate) | ئافرینا فی‌بان ڤی ئای پی (دیجی ڕەیت)',
    appSubtitle:
      'سیستەمی زیرەکی نرخی سات بە ساتی دۆلار و درهەم، بۆرسەی جوملەی مۆبایل، لاپتۆپ، تابلێت و پارچەی ئەسڵی',
    liveRateTitle: 'تابلۆی زیندووی نرخی دراو (نوێکردنەوەی خێرای هەموو کاڵاکان لە ٠.٠١ چرکەدا)',
    quickAdjustBtn: 'ڕێکخستنی خێرای نرخی دراوی ئەمڕۆ لەلایەن بازرگان',
    lockVolatilityBtn: '🔒 قفڵی گۆڕانکاری توندی بازاڕ (گۆڕین بۆ پەیوەندی واتسئەپ)',
    unlockVolatilityBtn: '🔓 کردنەوەی قفڵی بازاڕ و پیشاندانەوەی نرخەکان',
    volatilityLockedAlert:
      'دۆخی ناجێگیری بازاڕ چالاکە — پیشاندانی نرخەکان بە شێوەی کاتی ڕاگیراوە؛ بۆ وەرگرتنی نرخی سات بە سات کلیک لە واتسئەپ بکە.',
    installPwaBtn: '📲 دابەزاندنی ئەپ + دەرچوونی AAB/APK',
    compareBtn: '⚖️ بەراوردی پسپۆڕانەی مۆبایل، لاپتۆپ و تابلێت',
    proSuiteBtn: '🏷️ لێبڵی QR ڤیترین + پشکنینی چەک + ناسنامەی پارچە',
    calcInstallmentBtn: '🧮 قیستی چەکی سەیادی و گۆڕینەوە Trade-In',
    storyMakerBtn: '📸 دروستکەری ستۆری HD فرۆشگا',
    vipClubBtn: '👑 بەشداری VIP و پاداشتی ٢٥٪',
    invoiceCartBtn: '🧾 پێش‌فاکتۆری فەرمی IMEI',
    accessibilityTitle: 'دەستڕاگەیشتنی خاوەن پێداویستی تایبەت، نابیست، نابینا و ADHD:',
    adhdModeBtn: '🧠 دۆخی تەرکیزی ADHD (کەمکردنەوەی قەرەباڵغی)',
    readAloudBtn: '🔊 خوێندنەوەی دەنگی نرخەکان (نابینایان)',
    highContrastBtn: '👁️ کۆنتراستی بەرز و گەورەکردنی فۆنت',
    wholesaleLabel: 'نرخی کۆفرۆشی هاوکار (جوملە / کارتۆن):',
    retailLabel: 'نرخی بەکارهێنەر (تاکفرۆشی + کۆدی فەرمی و گەرەنتی ١٨ مانگ):',
    addToInvoiceBtn: 'زیادکردن بۆ پێش‌فاکتۆری فەرمی',
    inquireWhatsappBtn: 'پرسیاری نرخی جوملە لە واتسئەپ',
    buyRequestsTitle: 'تابلۆی زیندووی داواکاری کڕینی نەقدی و لیستی کەمی کاڵای هاوکاران',
    aiAssistantTitle: 'یاریدەدەری زیرەکی مۆبایل، ناسینەوەی شاشەی فابریک و نووسینی پۆستی ئینستاگرام',
    securityAutomatedBadge: 'کلیلەکانی API و واژۆی دیجیتاڵی Gradle/AAB بە تەواوی لە سێرڤەردا پارێزراون',
  },
};
