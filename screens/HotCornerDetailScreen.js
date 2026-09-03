import { useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import AppText from '../components/AppText';
import * as Speech from 'expo-speech';

function factsOf(item) {
  return item.movieFacts || item.issueFacts || {};
}
function introText(item) {
  const f = factsOf(item);
  const directorPart = f.director ? ` 감독 ${f.director}.` : '';
  return `${f.title}.${directorPart} ${f.summary}`;
}
function fullText(item) {
  return [introText(item), ...item.cards.flatMap((c) => [c.title, c.body])].join(' ');
}

function SegmentSpeaker({ segmentId, text, activeSegment, onPlay }) {
  const isActive = activeSegment === segmentId;
  return (
    <TouchableOpacity onPress={() => onPlay(segmentId, text)} style={s.segBtn} hitSlop={8}>
      <AppText style={s.segBtnText}>{isActive ? '⏹' : '🔊'}</AppText>
    </TouchableOpacity>
  );
}

export default function HotCornerDetailScreen({ route, navigation }) {
  const { item } = route.params;
  const facts = factsOf(item);
  const [activeSegment, setActiveSegment] = useState(null);

  useEffect(() => {
    return () => { Speech.stop(); };
  }, []);

  function playSegment(segmentId, text) {
    if (activeSegment === segmentId) {
      Speech.stop();
      setActiveSegment(null);
      return;
    }
    Speech.stop();
    setActiveSegment(segmentId);
    Speech.speak(text, {
      language: 'ko-KR',
      rate: 0.95,
      onDone: () => setActiveSegment(null),
      onStopped: () => setActiveSegment(null),
      onError: () => setActiveSegment(null) });
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => { Speech.stop(); navigation.goBack(); }} style={s.backBtn}>
          <AppText style={s.backText}>← 목록</AppText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => playSegment('all', fullText(item))}
          style={[s.listenBtn, activeSegment === 'all' && s.listenBtnActive]}
        >
          <AppText style={s.listenText}>{activeSegment === 'all' ? '⏹ 정지' : '🔊 전체 듣기'}</AppText>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.scroll}>
        <AppText style={s.badge}>🔥 핫코너 · {item.addedDate}</AppText>
        <AppText style={s.title}>{facts.title}</AppText>
        {facts.director ? <AppText style={s.director}>감독 · {facts.director}</AppText> : null}
        {facts.cast ? <AppText style={s.cast}>출연 · {facts.cast.join(' · ')}</AppText> : null}

        <View style={s.introRow}>
          <AppText style={s.summary}>{facts.summary}</AppText>
          <SegmentSpeaker segmentId="intro" text={introText(item)} activeSegment={activeSegment} onPlay={playSegment} />
        </View>

        <View style={s.divider} />

        {item.cards.map((card) => (
          <View key={card.id} style={s.card}>
            <View style={s.cardHeadRow}>
              <AppText style={s.cardTitle}>{card.title}</AppText>
              <SegmentSpeaker segmentId={card.id} text={`${card.title}. ${card.body}`} activeSegment={activeSegment} onPlay={playSegment} />
            </View>
            <AppText style={s.cardBody}>{card.body}</AppText>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#eef2f4',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  backBtn: { paddingVertical: 8, paddingHorizontal: 4 },
  backText: { fontSize: 17, fontWeight: '700', color: '#2c5f7c' },
  listenBtn: {
    backgroundColor: '#b8562c', borderRadius: 22,
    paddingVertical: 10, paddingHorizontal: 18 },
  listenBtnActive: { backgroundColor: '#8a4020' },
  listenText: { color: '#f7fafb', fontSize: 16, fontWeight: '700' },

  scroll: { padding: 24, paddingBottom: 56 },

  badge: { fontSize: 15, fontWeight: '700', color: '#b8562c', marginBottom: 8 },
  title: { fontSize: 30, fontWeight: '800', color: '#1f2d33', lineHeight: 38 },
  director: { fontSize: 16, color: '#4a5a61', marginTop: 10 },
  cast: { fontSize: 15, color: '#66767d', marginTop: 4, lineHeight: 22 },

  introRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 18 },
  summary: { flex: 1, fontSize: 18, color: '#1f2d33', lineHeight: 27 },

  divider: { height: 1, backgroundColor: '#d7e0e3', marginVertical: 26 },

  card: {
    backgroundColor: '#f7fafb',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#d7e0e3',
    padding: 18,
    marginBottom: 14 },
  cardHeadRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 10 },
  cardTitle: { flex: 1, fontSize: 19, fontWeight: '800', color: '#2c5f7c' },
  cardBody: { fontSize: 17, color: '#1f2d33', lineHeight: 26 },

  segBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#e2ecf0',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0 },
  segBtnText: { fontSize: 15 } });
