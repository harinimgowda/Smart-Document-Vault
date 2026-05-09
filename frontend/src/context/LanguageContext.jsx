import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

const translations = {
  en: {
    dashboard: "Dashboard",
    documents: "Documents",
    search: "Search",
    chat: "Chat",
    upload: "Upload",
    users: "Users",
    welcome: "Welcome back!",
    welcomeText:
      "Your latest document insights are ready. Use the sidebar to manage files, search content, or upload in one click.",
    totalDocuments: "Total Documents",
    categories: "Categories",
    recentUploads: "Recent Uploads",
    overview: "Overview",
    trackActivity:
      "Track your document activity, usage trends, and recent uploads from a cleaner workspace.",
    logout: "Logout",
    language: "Language",
    english: "English",
    kannada: "Kannada",
    telugu: "Telugu",
    hindi: "Hindi",
  },
  kn: {
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    documents: "ದಾಖಲೆಗಳು",
    search: "ಹುಡುಕಿ",
    chat: "ಚಾಟ್",
    upload: "ಅಪ್‌ಲೋಡ್",
    users: "ಬಳಕೆದಾರರು",
    welcome: "ಮರಳಿ ಸ್ವಾಗತ!",
    welcomeText:
      "ನಿಮ್ಮ ಇತ್ತೀಚಿನ ದಾಖಲೆ ಒಳನೋಟಗಳು ಸಿದ್ಧವಾಗಿವೆ. ಫೈಲ್‌ಗಳನ್ನು ನಿರ್ವಹಿಸಲು, ವಿಷಯವನ್ನು ಹುಡುಕಲು ಅಥವಾ ಒಂದೇ ಕ್ಲಿಕ್‌ನಲ್ಲಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಸೈಡ್‌ಬಾರ್ ಬಳಸಿ.",
    totalDocuments: "ಒಟ್ಟು ದಾಖಲೆಗಳು",
    categories: "ವರ್ಗಗಳು",
    recentUploads: "ಇತ್ತೀಚಿನ ಅಪ್‌ಲೋಡ್‌ಗಳು",
    overview: "ಅವಲೋಕನ",
    trackActivity:
      "ನಿಮ್ಮ ದಾಖಲೆ ಚಟುವಟಿಕೆ, ಬಳಕೆ ಪ್ರವೃತ್ತಿಗಳು ಮತ್ತು ಇತ್ತೀಚಿನ ಅಪ್‌ಲೋಡ್‌ಗಳನ್ನು ಸ್ವಚ್ಛ ಕಾರ್ಯಸ್ಥಳದಿಂದ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.",
    logout: "ಲಾಗ್‌ಔಟ್",
    language: "ಭಾಷೆ",
    english: "ಇಂಗ್ಲಿಷ್",
    kannada: "ಕನ್ನಡ",
    telugu: "ತೆಲುಗು",
    hindi: "ಹಿಂದಿ",
  },
  te: {
    dashboard: "డ్యాష్‌బోర్డ్",
    documents: "పత్రాలు",
    search: "వెతకండి",
    chat: "చాట్",
    upload: "అప్‌లోడ్",
    users: "వినియోగదారులు",
    welcome: "తిరిగి స్వాగతం!",
    welcomeText:
      "మీ ఇటీవలి పత్ర అంతర్దృష్టులు సిద్ధంగా ఉన్నాయి. ఫైల్‌లను నిర్వహించడానికి, కంటెంట్‌ను శోధించడానికి లేదా ఒక క్లిక్‌లో అప్‌లోడ్ చేయడానికి సైడ్‌బార్‌ను ఉపయోగించండి.",
    totalDocuments: "మొత్తం పత్రాలు",
    categories: "వర్గాలు",
    recentUploads: "ఇటీవలి అప్‌లోడ్‌లు",
    overview: "అవలోకనం",
    trackActivity:
      "మీ పత్ర కార్యాచరణ, వినియోగ ట్రెండ్‌లు మరియు ఇటీవలి అప్‌లోడ్‌లను స్వచ్ఛ వర్క్‌స్పేస్ నుండి ట్రాక్ చేయండి.",
    logout: "లాగ్‌అవుట్",
    language: "భాష",
    english: "ఇంగ్లిష్",
    kannada: "కన్నడ",
    telugu: "తెలుగు",
    hindi: "హిందీ",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    documents: "दस्तावेज़",
    search: "खोजें",
    chat: "चैट",
    upload: "अपलोड",
    users: "उपयोगकर्ता",
    welcome: "वापसी पर स्वागत है!",
    welcomeText:
      "आपके नवीनतम दस्तावेज़ अंतर्दृष्टि तैयार हैं। फाइलों को प्रबंधित करने, सामग्री खोजने या एक क्लिक में अपलोड करने के लिए साइडबार का उपयोग करें।",
    totalDocuments: "कुल दस्तावेज़",
    categories: "श्रेणियाँ",
    recentUploads: "हालिया अपलोड",
    overview: "अवलोकन",
    trackActivity:
      "अपनी दस्तावेज़ गतिविधि, उपयोग प्रवृत्तियों और हालिया अपलोड को एक स्वच्छ कार्यक्षेत्र से ट्रैक करें।",
    logout: "लॉगआउट",
    language: "भाषा",
    english: "अंग्रेजी",
    kannada: "कन्नड़",
    telugu: "तेलुगु",
    hindi: "हिंदी",
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
      localStorage.setItem("language", lang);
    }
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
