// ══════════════════════════════════════
//  PAW'D — PET PROFILES
// ══════════════════════════════════════

const PETS = [
  // ── DOGS ──
  {
    id: 1, type: 'dog', emoji: '🐶',
    photo: 'https://loremflickr.com/900/1100/dog?lock=1',
    name: 'Bruno', age: 3, breed: 'Golden Retriever',
    bio: 'I love long walks, belly rubs, and stealing socks. Looking for someone to throw the ball. Forever. 🎾',
    tags: ['Playful', 'Loyal', 'Ball Obsessed'],
    bg: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
  },
  {
    id: 2, type: 'dog', emoji: '🐕',
    photo: 'https://loremflickr.com/900/1100/dog?lock=2',
    name: 'Max', age: 5, breed: 'German Shepherd',
    bio: 'Serious on the outside, absolute goofball on the inside. I will protect you from delivery guys 💪',
    tags: ['Protective', 'Smart', 'Dramatic'],
    bg: 'linear-gradient(135deg, #e0c3fc, #8ec5fc)',
  },
  {
    id: 3, type: 'dog', emoji: '🐩',
    photo: 'https://loremflickr.com/900/1100/dog?lock=3',
    name: 'Coco', age: 2, breed: 'Poodle',
    bio: 'Fancy? Yes. High maintenance? Also yes. But I\'ll look fabulous while doing it 💅 Let\'s go to brunch.',
    tags: ['Sassy', 'Elegant', 'Foodie'],
    bg: 'linear-gradient(135deg, #fddb92, #d1fdff)',
  },
  {
    id: 4, type: 'dog', emoji: '🦮',
    photo: 'https://loremflickr.com/900/1100/dog?lock=4',
    name: 'Simba', age: 4, breed: 'Labrador',
    bio: 'I eat, I sleep, I love unconditionally. Simple dog, big heart ❤️ Treat me right and I\'m yours forever.',
    tags: ['Gentle', 'Cuddly', 'Foodie'],
    bg: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)',
  },
  {
    id: 5, type: 'dog', emoji: '🐕‍🦺',
    photo: 'https://loremflickr.com/900/1100/dog?lock=5',
    name: 'Rocky', age: 6, breed: 'Beagle',
    bio: 'Expert sniffer. Amateur howler. Professional couch potato 🛋️ Will follow you to the kitchen every single time.',
    tags: ['Nosy', 'Loud', 'Adorable'],
    bg: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)',
  },
  {
    id: 6, type: 'dog', emoji: '🐶',
    photo: 'https://loremflickr.com/900/1100/dog?lock=6',
    name: 'Biscuit', age: 1, breed: 'Corgi',
    bio: 'Short legs, big dreams. I run the zoomies at 3am and I have ZERO regrets 🌙 Ear scritches = instant love.',
    tags: ['Zoomy', 'Stubby', 'Chaotic'],
    bg: 'linear-gradient(135deg, #ffeaa7, #fab1a0)',
  },
  {
    id: 7, type: 'dog', emoji: '🐕',
    photo: 'https://loremflickr.com/900/1100/dog?lock=7',
    name: 'Duke', age: 7, breed: 'Dalmatian',
    bio: 'Yes I have spots. No I\'m not from a Disney movie. I\'m looking for a couch, snacks, and someone to binge Netflix with 🎬',
    tags: ['Spotted', 'Chill', 'Netflix Buddy'],
    bg: 'linear-gradient(135deg, #d4fc79, #96e6a1)',
  },

  // ── CATS ──
  {
    id: 8, type: 'cat', emoji: '🐱',
    photo: 'https://loremflickr.com/900/1100/cat?lock=8',
    name: 'Mochi', age: 2, breed: 'Scottish Fold',
    bio: 'I will knock things off your shelf and make eye contact while doing it 👀 Still deserve treats tho.',
    tags: ['Mischievous', 'Fluffy', 'Independent'],
    bg: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
  },
  {
    id: 9, type: 'cat', emoji: '🐈',
    photo: 'https://loremflickr.com/900/1100/cat?lock=9',
    name: 'Luna', age: 3, breed: 'Siamese',
    bio: 'I\'m loud, I\'m opinionated, and I will talk back. Looking for someone who appreciates a strong personality 😤',
    tags: ['Vocal', 'Bold', 'Dramatic'],
    bg: 'linear-gradient(135deg, #c3cfe2, #c3cfe2)',
  },
  {
    id: 10, type: 'cat', emoji: '🐈‍⬛',
    photo: 'https://loremflickr.com/900/1100/cat?lock=10',
    name: 'Shadow', age: 4, breed: 'Black Cat',
    bio: 'No I won\'t bring bad luck. I WILL bring you dead birds as gifts because I love you 🐦 You\'re welcome.',
    tags: ['Misunderstood', 'Mysterious', 'Generous'],
    bg: 'linear-gradient(135deg, #2c3e50, #4a4a6a)',
  },
  {
    id: 11, type: 'cat', emoji: '🐱',
    photo: 'https://loremflickr.com/900/1100/cat?lock=11',
    name: 'Nala', age: 1, breed: 'Maine Coon',
    bio: 'I\'m basically a dog trapped in a cat\'s body. I fetch, I follow you around, and I have the fluffiest tail 🌪️',
    tags: ['Dog-like', 'Fluffy', 'Follower'],
    bg: 'linear-gradient(135deg, #f093fb, #f5576c)',
  },
  {
    id: 12, type: 'cat', emoji: '🐈',
    photo: 'https://loremflickr.com/900/1100/cat?lock=12',
    name: 'Simba', age: 5, breed: 'Persian',
    bio: 'Flat face. Big attitude. I sit in a sunbeam for 6 hours and call it a productive day ☀️ Looking for a warm lap.',
    tags: ['Sun Lover', 'Grumpy Face', 'Soft'],
    bg: 'linear-gradient(135deg, #fddb92, #d1fdff)',
  },
  {
    id: 13, type: 'cat', emoji: '🐱',
    photo: 'https://loremflickr.com/900/1100/cat?lock=13',
    name: 'Pepper', age: 2, breed: 'Tabby',
    bio: 'I ignore you for 23 hours then demand ALL your attention at 2am. It\'s called balance 🌙 Very romantic.',
    tags: ['Selective', 'Midnight Energy', 'Purrs Loudly'],
    bg: 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
  },
  {
    id: 14, type: 'cat', emoji: '🐈',
    photo: 'https://loremflickr.com/900/1100/cat?lock=14',
    name: 'Ginger', age: 3, breed: 'Orange Tabby',
    bio: 'Certified chaotic gremlin. I eat lasagna, nap 18 hours, and hate Mondays. We have so much in common 🍝',
    tags: ['Garfield Energy', 'Lasagna Fan', 'Monday Hater'],
    bg: 'linear-gradient(135deg, #ff9a9e, #fecfef)',
  },
];

// ── Helpers ──
function getPetsByFilter(filter) {
  if (filter === 'all') return [...PETS];
  return PETS.filter(p => p.type === filter);
}

// Pet-specific auto-replies for chat
const PET_REPLIES = {
  1:  ["Woof woof!! 🎾", "BALL BALL BALL 🐕", "Can we go for walkies?? 🌳", "I love you already! *wags tail furiously*"],
  2:  ["*suspicious stare*", "I've assessed the threat level. You're acceptable. 🐕", "Don't let anyone else know I'm soft inside.", "I'll protect you. From the mailman. Especially the mailman."],
  3:  ["Omg hiiii! Wanna go to brunch? 🥂", "Do you think my fur looks good today? It always does btw.", "I only eat organic treats, just so you know 💅", "You seem fun. Are you fun? You better be fun."],
  4:  ["❤️❤️❤️", "Do you have snacks?? 🍗", "I'm already in love tbh.", "Can I sit on your feet? I'm asking as a formality."],
  5:  ["*sniffs you intensely*", "OOOOOOO what's that smell?? 👃", "I howled at 3am last night. Peak performance.", "You smell interesting. That's a compliment."],
  6:  ["ZOOMIES ACTIVATED 🌀", "bork bork bork!!", "my legs are short but my heart is BIG", "did someone say T-R-E-A-T-S??"],
  7:  ["Hey. *nods coolly* 😎", "Netflix tonight? I call the remote.", "I have spots. Not a phase.", "I'm more of a vibe than a dog tbh."],
  8:  ["*knocks your phone off the table*", "Feed me. Now. Please. Now. 🍣", "I'm sitting on your keyboard because I love you.", "*judges you silently but affectionately*"],
  9:  ["MROW MROW MROW!! 📢", "I have opinions and I will share ALL of them", "You should've texted back faster honestly.", "I'm not mad. I'm just... vocal."],
  10: ["*emerges from darkness*", "I brought you a gift 🐦 You're welcome.", "Black cats are good luck actually. Do your research.", "The void called. I told it I was busy talking to you."],
  11: ["*follows you to the bathroom*", "I fetched this for you! 🧦", "I'm a cat but make it golden retriever energy", "I missed you! You were gone for 4 minutes!"],
  12: ["...", "*sits in sunbeam and ignores message*", "Warm lap. Now. Please.", "I can't be bothered but I love you I suppose. ☀️"],
  13: ["*taps you at 2am*", "Are you awake? I'm awake. We're awake now.", "I chose you. From all the laps. I chose yours.", "Purrrrrrrr 💜"],
  14: ["I hate Mondays 😒", "Is there lasagna? There should be lasagna.", "I napped 18 hours today. Self care.", "Mondays are cancelled. I have spoken. 😤"],
};

function getPetReplies(petId) {
  return PET_REPLIES[petId] || ["Mrow! 🐾", "*nuzzles*", "You're my favourite human 💕", "🐾🐾🐾"];
}
