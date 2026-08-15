import en from '../locales/en.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';

type Language = 'en' | 'es' | 'fr';

let currentLang: Language = 'en';

const dictionaries: Record<Language, any> = { en, es, fr };

export const setLanguage = (lang: Language) => {
  currentLang = lang;
};

export const getLanguage = (): Language => currentLang;

/**
 * Nested key lookup function, e.g. t('tutorial.welcome.title', { name: 'Aarav' })
 */
export const t = (key: string, params?: Record<string, string>): string => {
  const keys = key.split('.');
  let val: any = dictionaries[currentLang] || dictionaries['en'];
  
  for (const k of keys) {
    if (val && typeof val === 'object' && k in val) {
      val = val[k];
    } else {
      // Fallback to English if missing in target lang
      let fallback: any = dictionaries['en'];
      for (const fk of keys) {
        if (fallback && typeof fallback === 'object' && fk in fallback) {
          fallback = fallback[fk];
        } else {
          return key; // return raw key if not found
        }
      }
      val = fallback;
      break;
    }
  }

  if (typeof val !== 'string') return key;

  if (params) {
    Object.entries(params).forEach(([pKey, pVal]) => {
      val = (val as string).replace(new RegExp(`{{\\s*${pKey}\\s*}}`, 'g'), pVal);
    });
  }

  return val;
};
