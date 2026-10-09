import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const dict = {
  en: {
    'nav.home': 'Home',
    'nav.postFood': 'Post Food',
    'nav.liveMap': 'Live Map',
    'nav.findFood': 'Find Food',
    'nav.features': 'Features',
    'nav.about': 'About',
    'nav.ngo': 'NGO Mode',
    'nav.donate': 'Donate',
    'nav.feedback': 'Feedback',
    'nav.legal': 'Legal & Privacy',
    'nav.login': 'Login',
    'nav.back': 'Back to Home',
    'hero.badge': 'FREE • LIVE • MOBILE-FIRST',
    'hero.titleA': 'From Waste to',
    'hero.titleB': 'Plates',
    'hero.titleC': '— Just 1 Tap Away',
    'hero.sub': 'Connect restaurants, weddings & offices with hungry people nearby.',
    'hero.zero1': 'Zero food waste.',
    'hero.zero2': 'Zero hunger.',
    'hero.zero3': 'Zero cost.',
    'hero.cta1': 'Post Free Food',
    'hero.cta2': 'See Features',
    'hero.scroll': 'SCROLL',
    'stats.food': 'Food Available',
    'stats.nearest': 'Nearest Post',
    'stats.live': 'Real-time Updates',
    'strip.live': 'Live feed updating in real-time',
    'strip.explore': 'Post Food in 30 Seconds',
    'impact.pill': 'IMPACT',
    'impact.title': 'Numbers That Matter',
    'impact.meals': 'Meals Rescued',
    'impact.donors': 'Active Donors',
    'impact.cities': 'City Reached',
    'impact.note': 'We are currently in startup mode and development phase — expanding soon to more areas.',
    'how.pill': 'HOW IT WORKS',
    'how.title': 'Simple as 1-2-3',
    'how.givers': 'For Food Givers',
    'how.giversSub': 'Share surplus food easily',
    'how.seekers': 'For Food Seekers',
    'how.seekersSub': 'Find food near you',
    'how.g1': 'Tap "Post Food"',
    'how.g2': 'Fill 4 simple fields',
    'how.g3': 'Goes live instantly',
    'how.g4': 'Auto-deletes when done',
    'how.s1': 'Browse live surplus food',
    'how.s2': 'Tap the nearest listing',
    'how.s3': 'Tap "I\'m Going"',
    'how.s4': 'Pick up — done!',
    'find.pill': 'FOR FOOD SEEKERS',
    'find.title': 'Where to Find Free Food Near You',
    'find.sub': 'Surplus food shows up in the live feed from these places — usually within walking distance.',
    'community.pill': 'COMMUNITY',
    'community.title': 'Who Uses FoodResQ',
    'community.sub': 'From students to 5-star hotels — everyone benefits',
    'why.pill': 'WHY US',
    'why.title': 'Built for Real Impact',
    'why.sub': 'Built for India — fast, simple, and 100% free forever.',
    'cta.title': 'Got Surplus Food Right Now?',
    'cta.sub': 'Takes 30 seconds. Someone nearby is waiting.',
    'cta.btn': 'Post Food Now — It\'s Free',
    'cta.browse': 'Browse Live Surplus Food',
  },
  hi: {
    'nav.home': 'होम',
    'nav.postFood': 'खाना पोस्ट करें',
    'nav.liveMap': 'लाइव मैप',
    'nav.findFood': 'खाना ढूंढें',
    'nav.features': 'सुविधाएं',
    'nav.about': 'हमारे बारे में',
    'nav.ngo': 'एनजीओ मोड',
    'nav.donate': 'दान करें',
    'nav.feedback': 'प्रतिक्रिया',
    'nav.legal': 'कानूनी व गोपनीयता',
    'nav.login': 'लॉगिन',
    'nav.back': 'होम पर वापस',
    'hero.badge': 'मुफ़्त • लाइव • मोबाइल-फ़र्स्ट',
    'hero.titleA': 'बचे खाने से',
    'hero.titleB': 'थाली तक',
    'hero.titleC': '— सिर्फ 1 टैप दूर',
    'hero.sub': 'रेस्टोरेंट, शादियों और दफ्तरों का बचा खाना जरूरतमंदों तक तुरंत पहुंचाएं।',
    'hero.zero1': 'शून्य बर्बादी।',
    'hero.zero2': 'शून्य भूख।',
    'hero.zero3': 'शून्य लागत।',
    'hero.cta1': 'मुफ़्त खाना पोस्ट करें',
    'hero.cta2': 'सुविधाएं देखें',
    'hero.scroll': 'नीचे देखें',
    'stats.food': 'उपलब्ध भोजन',
    'stats.nearest': 'निकटतम पोस्ट',
    'stats.live': 'रीयल-टाइम अपडेट',
    'strip.live': 'लाइव फीड तुरंत अपडेट हो रही है',
    'strip.explore': '30 सेकंड में खाना पोस्ट करें',
    'impact.pill': 'प्रभाव',
    'impact.title': 'आंकड़े जो मायने रखते हैं',
    'impact.meals': 'भोजन बचाया गया',
    'impact.donors': 'सक्रिय दाता',
    'impact.cities': 'शहर जुड़े',
    'impact.note': 'हम अभी स्टार्टअप और विकास के चरण में हैं — जल्द ही और क्षेत्रों में विस्तार करेंगे।',
    'how.pill': 'यह कैसे काम करता है',
    'how.title': 'आसान 3 कदम',
    'how.givers': 'भोजन दाताओं के लिए',
    'how.giversSub': 'अतिरिक्त खाना आसानी से साझा करें',
    'how.seekers': 'भोजन पाने वालों के लिए',
    'how.seekersSub': 'अपने पास खाना खोजें',
    'how.g1': '"खाना पोस्ट करें" पर टैप करें',
    'how.g2': '4 आसान विवरण भरें',
    'how.g3': 'तुरंत लाइव हो जाता है',
    'how.g4': 'समय पूरा होने पर स्वतः हट जाता है',
    'how.s1': 'लाइव अतिरिक्त भोजन देखें',
    'how.s2': 'निकटतम लिस्टिंग चुनें',
    'how.s3': '"मैं जा रहा हूँ" पर टैप करें',
    'how.s4': 'खाना लें — काम पूरा!',
    'find.pill': 'भोजन चाहने वालों के लिए',
    'find.title': 'अपने पास मुफ़्त खाना कहाँ खोजें',
    'find.sub': 'आस-पास के इन स्थानों से ताजा भोजन लाइव फीड में दिखाई देता है।',
    'community.pill': 'समुदाय',
    'community.title': 'FoodResQ का उपयोग कौन करता है',
    'community.sub': 'छात्रों से लेकर 5-सितारा होटलों तक — सभी को लाभ',
    'why.pill': 'हम ही क्यों',
    'why.title': 'सच्चे बदलाव के लिए निर्मित',
    'why.sub': 'भारत के लिए बनाया गया — तेज़, सरल और हमेशा मुफ़्त।',
    'cta.title': 'क्या आपके पास अतिरिक्त भोजन है?',
    'cta.sub': 'केवल 30 सेकंड लगते हैं। पास में ही कोई भूखा इंतज़ार कर रहा है।',
    'cta.btn': 'अभी खाना पोस्ट करें — मुफ़्त है',
    'cta.browse': 'लाइव उपलब्ध खाना देखें',
  },
}

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('foodresq_lang') || 'en'
    } catch {
      return 'en'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('foodresq_lang', lang)
    } catch {
      // ignore
    }
    document.documentElement.lang = lang
  }, [lang])

  const t = useCallback((key) => dict[lang]?.[key] ?? dict.en?.[key] ?? key, [lang])
  const toggle = useCallback(() => setLang((l) => (l === 'en' ? 'hi' : 'en')), [])

  return (
    <LangContext.Provider value={{ lang, setLang, t, toggle }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}
