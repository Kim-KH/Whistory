import questionsData from './questions.json';

const QUESTIONS = questionsData.questions;

export function getQuestionsByLevel(level) {
  // level: '기본' | '심화' | 'all'
  if (level === 'all') return QUESTIONS;
  return QUESTIONS.filter((q) => q.level === level);
}

export function getQuestionById(id) {
  return QUESTIONS.find((q) => q.id === id) || null;
}

export function getQuestionsByIds(ids) {
  const idSet = new Set(ids);
  return QUESTIONS.filter((q) => idSet.has(q.id));
}

// Fisher-Yates 셔플 — 매번 다른 순서로 문제가 나오도록.
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildQuizSet(level, count = 10) {
  const pool = getQuestionsByLevel(level);
  return shuffle(pool).slice(0, Math.min(count, pool.length));
}

export function getTotalCount() {
  return QUESTIONS.length;
}

export function getCountByLevel(level) {
  return getQuestionsByLevel(level).length;
}

// 한국사 한입과 달리 왕조/시대 문자열이 아니라 연도(yearStart) 기준으로 시대를 나눈다 —
// 세계사는 지역마다 시대 이름이 제각각이라 문자열로 묶기보다 연도 구간이 더 안전하다.
function eraBucket(yearStart) {
  if (typeof yearStart !== 'number') return '고대';
  if (yearStart < 500) return '고대';
  if (yearStart < 1500) return '중세';
  if (yearStart < 1900) return '근대';
  return '현대';
}

// 수능·공무원 세계사 기출 경향을 반영한 시대별 목표 문항 수 (50문항 기준).
// 콘텐츠가 아직 고대 위주라 지금 당장은 균등하게 뽑히지 않을 수 있다 — 각 시대
// 문항이 쌓이는 대로 점점 이 비중에 가까워진다.
const MOCK_EXAM_WEIGHTS = { 고대: 8, 중세: 10, 근대: 15, 현대: 17 };
const MOCK_EXAM_ORDER = ['고대', '중세', '근대', '현대'];
export const MOCK_EXAM_TOTAL = 50;
export const MOCK_EXAM_MINUTES = { 기본: 75, 심화: 80 };

// 실제 시험처럼 시대 비중에 맞춰 50문항을 구성하고, 고대→현대 순으로 배열한다.
// 부족한 시대가 있으면 그만큼을 문항이 가장 많은 시대에서 채운다.
export function buildMockExam(level) {
  const pool = getQuestionsByLevel(level);
  const byEra = {};
  MOCK_EXAM_ORDER.forEach((era) => {
    byEra[era] = shuffle(pool.filter((q) => eraBucket(q.yearStart) === era));
  });

  const picked = {};
  let shortfall = 0;
  MOCK_EXAM_ORDER.forEach((era) => {
    const target = MOCK_EXAM_WEIGHTS[era];
    const take = Math.min(target, byEra[era].length);
    picked[era] = byEra[era].slice(0, take);
    shortfall += target - take;
  });

  if (shortfall > 0) {
    // 가장 문항이 많은 시대에서 부족분을 채운다.
    const richest = MOCK_EXAM_ORDER.reduce((a, b) => (byEra[b].length > byEra[a].length ? b : a));
    const extra = byEra[richest].slice(picked[richest].length, picked[richest].length + shortfall);
    picked[richest] = picked[richest].concat(extra);
  }

  return MOCK_EXAM_ORDER.flatMap((era) => picked[era]);
}
