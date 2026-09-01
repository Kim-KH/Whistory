import { View, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import AppText from '../components/AppText';
import { getCountByLevel, getTotalCount, MOCK_EXAM_TOTAL, MOCK_EXAM_MINUTES } from '../content/quizRegistry';
import { useWrongAnswers } from '../content/useWrongAnswers';

export default function QuizHomeScreen({ navigation }) {
  const { wrongIds, loaded } = useWrongAnswers();
  const basicCount = getCountByLevel('기본');
  const advancedCount = getCountByLevel('심화');

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <AppText style={s.backText}>← 홈</AppText>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.scroll}>
        <AppText style={s.badge}>📝 문제풀이</AppText>
        <AppText style={s.title}>세계사 대비 예상문제</AppText>
        <AppText style={s.subtitle}>총 {getTotalCount()}문제 · 기출 유형을 반영한 예상문제</AppText>

        <TouchableOpacity
          style={[s.levelCard, s.basicCard]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Quiz', { level: '기본' })}
        >
          <AppText style={s.levelTitle}>기본 (쉬움)</AppText>
          <AppText style={s.levelDesc}>널리 알려진 핵심 사실 위주 · {basicCount}문제 중 10문제</AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.levelCard, s.advancedCard]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Quiz', { level: '심화' })}
        >
          <AppText style={s.levelTitle}>심화 (어려움)</AppText>
          <AppText style={s.levelDesc}>세부 사실과 비교·구별 위주 · {advancedCount}문제 중 10문제</AppText>
        </TouchableOpacity>

        <AppText style={s.sectionLabel}>⏱ 실전 모의고사</AppText>
        <AppText style={s.sectionDesc}>
          실제 시험처럼 시대 비중({MOCK_EXAM_TOTAL}문항)에 맞춰 문제가 구성되고, 제한 시간이 흐릅니다.
        </AppText>
        <View style={s.mockRow}>
          <TouchableOpacity
            style={[s.mockCard, s.mockBasic]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Quiz', { level: '기본', mode: 'mock' })}
          >
            <AppText style={s.mockTitle}>기본 모의고사</AppText>
            <AppText style={s.mockDesc}>{MOCK_EXAM_MINUTES['기본']}분 · {MOCK_EXAM_TOTAL}문항</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.mockCard, s.mockAdvanced]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Quiz', { level: '심화', mode: 'mock' })}
          >
            <AppText style={s.mockTitle}>심화 모의고사</AppText>
            <AppText style={s.mockDesc}>{MOCK_EXAM_MINUTES['심화']}분 · {MOCK_EXAM_TOTAL}문항</AppText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={s.wrongNoteCard}
          activeOpacity={0.85}
          disabled={!loaded || wrongIds.length === 0}
          onPress={() => navigation.navigate('Quiz', { mode: 'wrong' })}
        >
          <AppText style={s.wrongNoteTitle}>📌 오답노트</AppText>
          <AppText style={s.wrongNoteDesc}>
            {!loaded
              ? '불러오는 중...'
              : wrongIds.length === 0
              ? '아직 틀린 문제가 없어요. 문제를 풀어보세요!'
              : `틀렸던 문제 ${wrongIds.length}개 다시 풀기`}
          </AppText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#eef2f4',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  backBtn: { paddingVertical: 8, paddingHorizontal: 4, alignSelf: 'flex-start' },
  backText: { fontSize: 17, fontWeight: '700', color: '#2c5f7c' },

  scroll: { padding: 20, paddingBottom: 48 },
  badge: { fontSize: 14, fontWeight: '700', color: '#2c5f7c', marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', color: '#1f2d33' },
  subtitle: { fontSize: 15, color: '#66767d', marginTop: 8, marginBottom: 24 },

  levelCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 14,
  },
  basicCard: { backgroundColor: '#3d6b4a' },
  advancedCard: { backgroundColor: '#a8471f' },
  levelTitle: { fontSize: 22, fontWeight: '800', color: '#f7fafb' },
  levelDesc: { fontSize: 14, color: '#e5f0e8', marginTop: 6 },

  sectionLabel: { fontSize: 18, fontWeight: '800', color: '#1f2d33', marginTop: 6, marginBottom: 4 },
  sectionDesc: { fontSize: 13, color: '#66767d', marginBottom: 12, lineHeight: 19 },
  mockRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  mockCard: { flex: 1, borderRadius: 16, padding: 16 },
  mockBasic: { backgroundColor: '#1e4054' },
  mockAdvanced: { backgroundColor: '#2c5f7c' },
  mockTitle: { fontSize: 17, fontWeight: '800', color: '#f7fafb' },
  mockDesc: { fontSize: 13, color: '#cfe3ec', marginTop: 6 },

  wrongNoteCard: {
    backgroundColor: '#f7fafb',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d7e0e3',
    padding: 20,
    marginTop: 10,
  },
  wrongNoteTitle: { fontSize: 20, fontWeight: '800', color: '#b8912f' },
  wrongNoteDesc: { fontSize: 14, color: '#66767d', marginTop: 6 },
});
