import topicsData from './topics.json';

const TOPICS = topicsData.topics;

// 한국사 한입과 달리 '왕조 편년체' 카탈로그가 없다 — 세계사는 동시대에 여러 문명이
// 나란히 존재해 왕조 목록 하나로 시대를 대표할 수 없기 때문에, 주제(기전체) 중심
// 하나의 모드로 시작한다. 콘텐츠가 쌓이면 500_01.txt의 '부' 단위를 시대별 보기로
// 추가할 수 있다.
export const TOPIC_CATEGORIES = [
  { key: '선사/문명', title: '선사·문명', icon: '🌍' },
  { key: '전쟁', title: '전쟁', icon: '⚔️' },
  { key: '사건', title: '사건', icon: '📜' },
  { key: '제도', title: '제도', icon: '🏛️' },
  { key: '경제', title: '경제', icon: '💰' },
  { key: '사회', title: '사회', icon: '👥' },
  { key: '종교/사상', title: '종교·사상', icon: '☯️' },
  { key: '과학/기술', title: '과학·기술', icon: '🔬' },
  { key: '문화/예술', title: '문화·예술', icon: '🎨' },
  { key: '인물', title: '인물', icon: '🧑' },
];

// 세계사는 선사시대처럼 연도가 마이너스로 아주 크거나 불명확한 항목이 많다 —
// yearStart가 없으면 목록 맨 뒤로 보낸다. 왕조 카탈로그가 없어 정렬 방향을 정해줄
// 다른 기준이 없으므로, 교과서처럼 오래된 시대부터 최신 순으로 보여준다.
function sortYear(topic) {
  return typeof topic.yearStart === 'number' ? topic.yearStart : Infinity;
}

export function getTopicsByCategory(category) {
  return TOPICS.filter((t) => t.category === category)
    .slice()
    .sort((a, b) => sortYear(a) - sortYear(b));
}

export function getTopic(id) {
  return TOPICS.find((t) => t.id === id) || null;
}

export function starsFor(importance) {
  if (!importance) return '';
  return '★'.repeat(importance);
}

function matchesQuery(topic, q) {
  const hay = [topic.title, topic.oneLiner, topic.era, topic.region, ...(topic.keyFacts || [])]
    .filter(Boolean)
    .join(' ');
  return hay.toLowerCase().includes(q.toLowerCase());
}

export function searchTopics(query) {
  const q = query.trim();
  if (!q) return [];
  return TOPICS.filter((t) => matchesQuery(t, q)).sort((a, b) => sortYear(a) - sortYear(b));
}

export function getTotalTopicCount() {
  return TOPICS.length;
}
