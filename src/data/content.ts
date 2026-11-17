import { Milestone } from '@/types';

export const RECIPIENT_NAME = 'Geget';

export const MILESTONES: Milestone[] = [
  {
    id: 'first-battle',
    title: 'The First Battle',
    description:
      'Waktu pertama kali kita main bareng. Masih serba coba-coba, tapi dari situ obrolan kita mulai makin nyambung dan seru.',
    icon: '⚔️',
  },
  {
    id: 'endless-challenges',
    title: 'Endless Challenges',
    description:
      'Lewatin match-match berat, lose streak, atau tim yang random. Tapi kamu tetap enjoy dan ga gampang nyerah.',
    icon: '🔥',
  },
  {
    id: 'never-give-up',
    title: 'Never Give Up',
    description:
      'Pelan-pelan makin jago, rotasi makin rapi, dan yang paling penting selalu saling dukung di setiap game.',
    icon: '💪',
  },
  {
    id: 'final-victory',
    title: 'The Final Victory',
    description:
      'Game penentu menuju Mythic. Fokus penuh dan saling percaya, akhirnya match itu berhasil kita menangkan.',
    icon: '👑',
  },
  {
    id: 'mythic-unlocked',
    title: 'Mythic Unlocked',
    description:
      'Selamat atas rank Mythic-nya, Geget! Keren banget bisa lihat dedikasi dan konsistensi kamu selama ini.',
    icon: '🏆',
  },
];

export const LOVE_LETTER_CONTENT = {
  greeting: `Hai ${RECIPIENT_NAME},`,
  paragraphs: [
    'Selamat ya udah berhasil sampai ke Mythic. Aku senang banget bisa nemenin dan lihat perjalanan kamu sampai di titik ini.',
    'Dari sekadar sering main bareng sampai ngobrol hal-hal random tiap hari, aku ngerasa nyaman banget tiap ada kamu.',
    'Hal-hal sederhana yang kita lewatin bareng selalu berhasil bikin hari-hariku jadi lebih seru dan berharga.',
    'Aku mungkin bukan tipe orang yang jago merangkai kata puitis, tapi rasa nyaman dan senang yang aku rasain pas bareng kamu itu beneran tulus.',
    'Karena itu, lewat petualangan kecil ini, ada satu hal penting yang pengen aku tanyain langsung ke kamu...',
  ],
  closing: 'Dari seseorang yang selalu dukung kamu,',
  signature: 'Khusus untuk Geget ✨',
};

export const CARD_SYMBOLS = ['heart', 'star', 'moon', 'sword'] as const;

export const SECRET_REWARD_MESSAGE =
  'Ada satu pesan yang mau aku sampaikan ke kamu. Tapi sebelum membukanya, coba selesaikan permainan kartu kecil ini dulu ya.';

export const PROPOSAL_QUESTION = 'Will You Be My Girlfriend?';
