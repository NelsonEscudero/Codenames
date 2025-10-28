const WORDS = [
  "NURSE","DOCTOR","HOSPITAL","PATIENT","BANDAGE","BLOOD","BONES","SKULL","ZOMBIE","WITCH",
  "SYRINGE","GHOST","VIRUS","COFFIN","MASK","PLAGUE","HEART","TOMB","CURE","POTION",
  "FRACTURE","MORGUE","FEVER","GRAVE","BRAIN","STITCH","LAB","MONSTER","CAST","SCREAM",
];

const ROLES = {
  RED: "red",
  BLUE: "blue",
  NEUTRAL: "neutral",
  ASSASSIN: "assassin",
};

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function drawBoardWords(words) {
  return shuffle(words).slice(0, 25);
}

function assignRoles(startingTeam) {
  const counts = startingTeam === ROLES.RED
    ? { red: 9, blue: 8, neutral: 7, assassin: 1 }
    : { red: 8, blue: 9, neutral: 7, assassin: 1 };

  const roles = [
    ...Array(counts.red).fill(ROLES.RED),
    ...Array(counts.blue).fill(ROLES.BLUE),
    ...Array(counts.neutral).fill(ROLES.NEUTRAL),
    ROLES.ASSASSIN,
  ];
  return shuffle(roles);
}

function makeNewGame() {
  const startingTeam = Math.random() < 0.5 ? ROLES.RED : ROLES.BLUE;
  const words = drawBoardWords(WORDS);
  const roles = assignRoles(startingTeam);
  const cards = words.map((w, i) => ({ word: w, role: roles[i], revealed: false }));
  const remaining = {
    red: roles.filter(r => r === ROLES.RED).length,
    blue: roles.filter(r => r === ROLES.BLUE).length,
  };
  return { cards, currentTeam: startingTeam, remaining, winner: null, assassinHit: false };
}

export { ROLES, makeNewGame };