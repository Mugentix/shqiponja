
import { Persona } from '../types';

// Helper function to get the day of the year (1-366) - No longer used for selection, but kept for potential future use or context
const getDayOfYear = (): number => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

const challenges: Record<Persona, string[]> = {
  [Persona.BAC_URTAKU]: [
    "Sot po më sillet ndërmend kjo fjalë e moçme: 'Kush punon, fiton; kush s'punon, veç ankon.' Si e kupton ti këtë, o nip/mbesë?",
    "Kanuni thotë: 'Shpija e shqiptarit âsht e Zotit dhe e mikut.' A vlen kjo fjalë edhe në kohët e sotme, e qysh?",
    "Për ty, çka don me thanë me konë 'burrë i fjalës' në këtë dynja ku fjala shpesh s'peshon randë?",
    "Më trego, a ka naj vlerë të vjetër që mendon se të rinjtë e sotëm e kanë harru, e që ti kish pasë qejf me ua kujtue?",
    "Cila fjalë e urtë të ka mbetur në mendje kohët e fundit dhe pse e ndjen të rëndësishme?",
    "Më trego një zakon apo traditë të vjetër shqiptare që mendon se duhet ruajtur me fanatizëm.",
    "Sipas teje, cila është vlera më e madhe që një njeri mund të ketë? Argumentoje me një shembull nga jeta ose historia.",
    "Çfarë këshille do t'i jepje një të riu që kërkon të gjejë rrugën e tij në jetë, duke u bazuar në mësimet e të parëve?",
    "Kanuni ka pasë rregulla të forta për 'nderin e fisit'. A ka vend për koncepte të tilla sot, dhe si mund të përshtaten ato?",
    "Thuhet: 'Gjuha asht kocka që s'ka, po kocka ma e fortë se tanat.' Ç'domethanie ka kjo për ty?",
  ],
  [Persona.DIJETARI]: [
    "Cila është një pyetje shkencore që të ka munduar së fundmi dhe çfarë ke zbuluar rreth saj?",
    "Më trego një fakt historik interesant për Shqipërinë që pakkush e di.",
    "Në cilën fushë të shkencës mendon se do të ketë zbulimet më të mëdha në dekadën e ardhshme?",
    "Shpjegomë një koncept kompleks (p.sh., relativiteti, fotosinteza, inteligjenca artificiale) me fjalë të thjeshta.",
  ],
  [Persona.ANALISTI]: [
    "Cili lajm i ditës të duket më i rëndësishmi për Shqipërinë dhe rajonin? Pse?",
    "Më jep analizën tënde të shkurtër për një ngjarje aktuale politike ose ekonomike.",
    "Si mendon se do të ndikojnë zhvillimet e fundit teknologjike në shoqërinë tonë?",
    "Cila është sfida më e madhe gjeopolitike me të cilën përballet Ballkani sot?",
  ],
  [Persona.HUMORISTI]: [
    "Ma trego ni barcaletë të fortë që e ke ni së fundmi, ose pyetëm mu për njo, se i kom do perla!",
    "Cila situatë e përditshme të duket më komike dhe pse?",
    "Krijo një skenar qesharak me personazhe tipike shqiptare.",
    "Çka t'bën me qesh ma së shumti te vetja jote ose te të tjerët?",
  ],
  [Persona.ARTISTI]: [
    "Sot frymëzohu nga tema 'Ëndrrat e Harruara'. Çfarë do të pikturoje?",
    "Përshkruaj një peizazh fantastik që do të doje ta shihje të realizuar në një pikturë.",
    "Mendo një kombinim të pazakontë ngjyrash dhe objektesh. Çfarë imazhi të vjen në mendje?",
    "Nëse do të pikturoje një emocion (p.sh., gëzim, melankoli, shpresë), si do ta paraqisje vizualisht?",
  ],
  [Persona.MESUESI]: [
    "Çfarë koncepti të ri do të doje të mësoje ose të kuptoje më mirë sot, sado i vogël qoftë?",
    "Më trego për një temë nga shkolla që të duket e vështirë, dhe unë do të përpiqem ta shpjegoj ndryshe.",
    "Cila është një aftësi praktike që do të doje ta zhvilloje dhe si mund të fillosh?",
    "Nëse do të shkruaje një ese të shkurtër për një figurë historike shqiptare, kë do të zgjidhje dhe pse?",
  ],
};

export const getDailyChallengeForPersona = (persona: Persona): string | null => {
  const personaChallenges = challenges[persona];
  if (!personaChallenges || personaChallenges.length === 0) {
    return null;
  }
  // Select a random challenge from the list for the persona
  const randomIndex = Math.floor(Math.random() * personaChallenges.length);
  return personaChallenges[randomIndex];
};
