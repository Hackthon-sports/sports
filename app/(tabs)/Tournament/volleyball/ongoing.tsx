import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Animated,
  ImageBackground,
} from 'react-native';

// ✅ Define Match type
type VolleyballMatch = {
  id: string;
  tournamentName: string;
  matchName: string;
  date: string;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  isLive: boolean;
  description: string;
  location: string;
  organisation: string;
};

// ✅ Sample Data
const volleyballMatches: VolleyballMatch[] = [
  {
    id: '1',
    tournamentName: 'Asian Volleyball League',
    matchName: 'Group Stage',
    date: '2025-08-08',
    teamA: 'India',
    teamB: 'Iran',
    scoreA: 2,
    scoreB: 2,
    isLive: true,
    description: 'Set 5 in progress',
    location: 'Delhi',
    organisation: 'AVC',
  },
  {
    id: '2',
    tournamentName: 'Asian Volleyball League',
    matchName: 'Group Stage',
    date: '2025-08-07',
    teamA: 'Japan',
    teamB: 'South Korea',
    scoreA: 3,
    scoreB: 2,
    isLive: false,
    description: 'Japan won in 5 sets',
    location: 'Delhi',
    organisation: 'AVC',
  },
  {
    id: '3',
    tournamentName: 'World Volleyball Championship',
    matchName: 'Quarterfinal',
    date: '2025-08-08',
    teamA: 'Brazil',
    teamB: 'USA',
    scoreA: 2,
    scoreB: 2,
    isLive: true,
    description: 'Final set underway',
    location: 'Tokyo',
    organisation: 'FIVB',
  },
];

// ✅ Background Image
const BG_IMAGE_URL = 'https://cdn.pixabay.com/photo/2017/08/30/07/52/cricket-2691846_1280.jpg';

export default function OngoingVolleyballScreen() {
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null);
  const blinkAnim = useRef(new Animated.Value(0)).current;

  // ✅ Generate tournaments dynamically from matches
  const volleyballTournaments = Array.from(
    new Set(volleyballMatches.map((m) => m.tournamentName))
  ).map((name) => ({ tournamentName: name }));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // ✅ Check if match is today
  const isToday = (dateStr: string): boolean => {
    const matchDate = new Date(dateStr);
    const today = new Date();
    return (
      matchDate.getFullYear() === today.getFullYear() &&
      matchDate.getMonth() === today.getMonth() &&
      matchDate.getDate() === today.getDate()
    );
  };

  // ✅ Match card
  const renderMatch = ({ item }: { item: VolleyballMatch }) => (
    <View className="bg-white rounded-2xl p-4 mt-4 shadow shadow-black/10">
      <Text className="text-base font-semibold text-[#2C1371]">{item.matchName}</Text>
      <Text className="text-xs text-purple-600 mt-1">
        {item.date} · {item.location}
      </Text>
      <Text className="text-xs italic text-purple-500">{item.organisation}</Text>

      <View className="flex-row justify-between mt-3">
        <Text className="text-sm font-medium text-[#2C1371]">{item.teamA}</Text>
        <Text className="text-sm font-bold text-black">{item.scoreA} sets</Text>
      </View>
      <View className="flex-row justify-between mt-1">
        <Text className="text-sm font-medium text-[#2C1371]">{item.teamB}</Text>
        <Text className="text-sm font-bold text-black">{item.scoreB} sets</Text>
      </View>

      <Text className="text-sm font-extrabold text-orange-700 mt-3 italic">{item.description}</Text>

      {item.isLive && (
        <Animated.Text style={{ opacity: blinkAnim }} className="text-xs ml-40 font-bold text-[#e11313] mt-2">
          ● LIVE
        </Animated.Text>
      )}
    </View>
  );

  return (
    <ImageBackground
      source={{ uri: BG_IMAGE_URL }}
      resizeMode="cover"
      className="flex-1"
      imageStyle={{ opacity: 0.07 }}
    >
      <View className="flex-1 bg-[#F1EAFE] px-4 pt-12">
        <Text className="text-2xl font-bold text-[#2C1371] text-center mb-6">
          Volleyball Tournaments
        </Text>

        {volleyballTournaments.map((t) => {
          const isSelected = selectedTournament === t.tournamentName;
          const todayMatches = volleyballMatches.filter(
            (m) =>
              m.tournamentName === t.tournamentName &&
              m.isLive &&
              isToday(m.date)
          );

          return (
            <View key={t.tournamentName} className="mb-6">
              <Pressable
                onPress={() =>
                  setSelectedTournament(
                    selectedTournament === t.tournamentName ? null : t.tournamentName
                  )
                }
                className={`px-4 py-3 rounded-2xl ${
                  isSelected ? 'bg-[#9B77F6]' : 'bg-[#c5acf7]'
                }`}
              >
                <Text
                  className={`text-base font-semibold ${
                    isSelected ? 'text-white' : 'text-[#2C1371]'
                  }`}
                >
                  {t.tournamentName}
                </Text>
              </Pressable>

              {isSelected && (
                <>
                  <Text className="mt-4 text-sm font-semibold text-[#2C1371]">
                    Ongoing Matches
                  </Text>

                  {todayMatches.length > 0 ? (
                    <FlatList
                      data={todayMatches}
                      keyExtractor={(m) => m.id}
                      renderItem={renderMatch}
                    />
                  ) : (
                    <Text className="text-xs italic text-gray-500 mt-2">
                      No live matches today.
                    </Text>
                  )}
                </>
              )}
            </View>
          );
        })}
      </View>
    </ImageBackground>
  );
}
