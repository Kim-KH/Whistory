import { useMemo, useState } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import AppText from '../components/AppText';
import { TOPIC_CATEGORIES, getTopicsByCategory, searchTopics, getTotalTopicCount } from '../content/registry';
import { useHotCornerItems } from '../content/useHotCorner';

export default function HomeScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const q = query.trim();
  const isSearching = q !== '';
  const searchResults = useMemo(() => searchTopics(q), [q]);
  const { items: hotCornerItems } = useHotCornerItems();
  const latestHotCorner = hotCornerItems[0];

  return (
    <SafeAreaView style={s.safe}>
      <FlatList
        data={isSearching ? searchResults : TOPIC_CATEGORIES}
        keyExtractor={(item, index) => (isSearching ? item.id : item.key) + '-' + index}
        contentContainerStyle={s.listContent}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <>
            <View style={s.titleRow}>
              <View style={s.titleTextWrap}>
                <AppText style={s.appTitle}>세계사 한입</AppText>
                <AppText style={s.appSubtitle}>매일 한 조각, 크게 보고 편하게 듣는 세계사</AppText>
              </View>
              <TouchableOpacity
                style={s.settingsBtn}
                onPress={() => navigation.navigate('Settings')}
                hitSlop={10}
              >
                <AppText style={s.settingsIcon}>Aa</AppText>
              </TouchableOpacity>
            </View>

            <View style={s.searchBox}>
              <AppText style={s.searchIcon}>🔍</AppText>
              <TextInput
                style={s.searchInput}
                placeholder="시대, 사건, 인물로 검색 (예: 르네상스, 나폴레옹)"
                placeholderTextColor="#a8997a"
                value={query}
                onChangeText={setQuery}
                returnKeyType="search"
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery('')} hitSlop={10}>
                  <AppText style={s.clearIcon}>✕</AppText>
                </TouchableOpacity>
              )}
            </View>

            {!isSearching && (
              <>
                <TouchableOpacity
                  style={s.hotCard}
                  onPress={() => navigation.navigate('HotCornerList')}
                  activeOpacity={0.85}
                >
                  <AppText style={s.hotBadge}>🔥 핫코너 · {hotCornerItems.length}개</AppText>
                  {latestHotCorner && (
                    <>
                      <AppText style={s.hotTitle}>
                        {latestHotCorner.movieFacts?.title || latestHotCorner.issueFacts?.title}
                      </AppText>
                      <AppText style={s.hotDesc} numberOfLines={2}>{latestHotCorner.trigger}</AppText>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={s.quizCard}
                  onPress={() => navigation.navigate('QuizHome')}
                  activeOpacity={0.85}
                >
                  <AppText style={s.quizBadge}>📝 문제풀이</AppText>
                  <AppText style={s.quizTitle}>세계사 예상문제 풀어보기</AppText>
                  <AppText style={s.quizDesc}>기본·심화 난이도 · 오답노트 자동 저장</AppText>
                </TouchableOpacity>
              </>
            )}

            <AppText style={s.sectionTitle}>
              {isSearching ? `"${q}" 검색 결과` : `주제별로 살펴보기 · 총 ${getTotalTopicCount()}개 항목`}
            </AppText>
            {isSearching && <AppText style={s.sectionSub}>{searchResults.length}건 찾았어요</AppText>}
          </>
        }
        ListEmptyComponent={
          isSearching ? <AppText style={s.emptyText}>검색 결과가 없습니다. 다른 단어로 찾아보세요.</AppText> : null
        }
        renderItem={({ item }) => {
          if (isSearching) {
            const categoryInfo = TOPIC_CATEGORIES.find((c) => c.key === item.category);
            return (
              <TouchableOpacity
                style={s.topicRow}
                onPress={() => navigation.navigate('TopicDetail', { id: item.id })}
                activeOpacity={0.7}
              >
                <View style={s.categoryIconBadge}>
                  <AppText style={s.categoryIconText}>{categoryInfo?.icon}</AppText>
                </View>
                <View style={s.topicInfo}>
                  <AppText style={s.eraTag}>{item.category} · {item.era}</AppText>
                  <AppText style={s.topicTitle}>{item.title}</AppText>
                  <AppText style={s.topicOneLiner} numberOfLines={2}>{item.oneLiner}</AppText>
                </View>
              </TouchableOpacity>
            );
          }

          const count = getTopicsByCategory(item.key).length;
          return (
            <TouchableOpacity
              style={s.categoryCard}
              onPress={() => navigation.navigate('TopicList', { category: item.key })}
              activeOpacity={0.85}
            >
              <AppText style={s.categoryIcon}>{item.icon}</AppText>
              <View style={s.categoryTextWrap}>
                <AppText style={s.categoryTitle}>{item.title}</AppText>
                <AppText style={s.categoryCount}>{count}개 항목</AppText>
              </View>
              <AppText style={s.chevron}>›</AppText>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f3ecdc',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  listContent: { padding: 20, paddingBottom: 48 },

  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  titleTextWrap: { flex: 1 },
  appTitle: { fontSize: 32, fontWeight: '800', color: '#2b2118', marginTop: 8 },
  appSubtitle: { fontSize: 16, color: '#7a6f5d', marginTop: 6, marginBottom: 18 },
  settingsBtn: {
    marginTop: 8,
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#faf6ec', borderWidth: 1, borderColor: '#e2d6bc',
    alignItems: 'center', justifyContent: 'center',
  },
  settingsIcon: { fontSize: 18, fontWeight: '800', color: '#b8912f' },

  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#faf6ec', borderRadius: 16,
    borderWidth: 1, borderColor: '#e2d6bc',
    paddingHorizontal: 14, marginBottom: 18,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 16, color: '#2b2118' },
  clearIcon: { fontSize: 16, color: '#a8997a', paddingLeft: 8 },

  hotCard: {
    backgroundColor: '#a83c32',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  hotBadge: { fontSize: 14, fontWeight: '700', color: '#fff8ee' },
  hotTitle: { fontSize: 19, fontWeight: '800', color: '#fff8ee', marginTop: 6, lineHeight: 26 },
  hotDesc: { fontSize: 14, color: '#fff8ee', marginTop: 8, lineHeight: 20 },

  quizCard: {
    backgroundColor: '#2f6b76',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  quizBadge: { fontSize: 14, fontWeight: '700', color: '#fff8ee' },
  quizTitle: { fontSize: 19, fontWeight: '800', color: '#fff8ee', marginTop: 6 },
  quizDesc: { fontSize: 14, color: '#fff8ee', marginTop: 4 },

  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#2b2118', marginBottom: 4 },
  sectionSub: { fontSize: 14, color: '#7a6f5d', marginBottom: 14 },
  emptyText: { fontSize: 16, color: '#7a6f5d', marginTop: 20, textAlign: 'center' },

  categoryCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#faf6ec', borderRadius: 14,
    borderWidth: 1, borderColor: '#e2d6bc',
    padding: 16, marginTop: 10,
  },
  categoryIcon: { fontSize: 26, marginRight: 14 },
  categoryTextWrap: { flex: 1 },
  categoryTitle: { fontSize: 19, fontWeight: '800', color: '#2b2118' },
  categoryCount: { fontSize: 14, color: '#7a6f5d', marginTop: 2 },
  chevron: { fontSize: 24, color: '#c7ba98' },

  topicRow: {
    flexDirection: 'row',
    backgroundColor: '#faf6ec', borderRadius: 14,
    borderWidth: 1, borderColor: '#e2d6bc',
    padding: 14, marginTop: 10,
  },
  categoryIconBadge: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#efe4cc',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  categoryIconText: { fontSize: 18 },
  topicInfo: { flex: 1 },
  eraTag: { fontSize: 12, fontWeight: '700', color: '#2f6b76', marginBottom: 2 },
  topicTitle: { fontSize: 18, fontWeight: '800', color: '#2b2118' },
  topicOneLiner: { fontSize: 14, color: '#5a5142', marginTop: 4, lineHeight: 20 },
});
