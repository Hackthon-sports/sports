import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Animated,
  ImageBackground,
} from 'react-native';

const kabaddiMatches = [
  {
    id: '1',
    tournamentName: 'Pro Kabaddi League 2025',
    matchName: 'Match 12',
    date: '2025-08-08',
    teamA: 'Bengal Warriors',
    teamB: 'U Mumba',
    scoreA: 36,
    scoreB: 32,
    isLive: true,
    description: '5 minutes remaining',
    location: 'Kolkata',
    organisation: 'PKL',
  },
  {
    id: '2',
    tournamentName: 'National Kabaddi Championship',
    matchName: 'Quarter Final 1',
    date: '2025-08-06',
    teamA: 'Services',
    teamB: 'Railways',
    scoreA: 42,
    scoreB: 45,
    isLive: true,
    description: 'Railways won by 3 points',
    location: 'Patna',
    organisation: 'AKFI',
  },
  {
    id: '3',
    tournamentName: 'Pro Kabaddi League 2025',
    matchName: 'Match 13',
    date: '2025-08-07',
    teamA: 'Patna Pirates',
    teamB: 'Jaipur Pink Panthers',
    scoreA: 28,
    scoreB: 35,
    isLive: false,
    description: 'Match Ended',
    location: 'Delhi',
    organisation: 'PKL',
  },
];

export default function OngoingKabaddiScreen() {
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null);
  const blinkAnim = useRef(new Animated.Value(0)).current;

  // Dynamically derive tournaments from matches
  const kabaddiTournaments = Array.from(
    new Set(kabaddiMatches.map((m) => m.tournamentName))
  ).map((name) => ({ tournamentName: name }));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const isToday = (dateStr: string) => {
    const matchDate = new Date(dateStr);
    const now = new Date();
    return (
      matchDate.getFullYear() === now.getFullYear() &&
      matchDate.getMonth() === now.getMonth() &&
      matchDate.getDate() === now.getDate()
    );
  };

  const renderMatch = ({ item }: { item: any }) => (
    <View className="bg-white rounded-2xl p-4 mt-4 shadow shadow-black/10">
      <Text className="text-base font-semibold text-[#2C1371]">{item.matchName}</Text>
      <Text className="text-xs text-purple-600 mt-1">
        {item.date} · {item.location}
      </Text>
      <Text className="text-xs italic text-purple-500">{item.organisation}</Text>

      <View className="flex-row justify-between mt-3">
        <Text className="text-sm font-medium text-[#2C1371]">{item.teamA}</Text>
        <Text className="text-sm font-bold text-black">{item.scoreA}</Text>
      </View>
      <View className="flex-row justify-between mt-1">
        <Text className="text-sm font-medium text-[#2C1371]">{item.teamB}</Text>
        <Text className="text-sm font-bold text-black">{item.scoreB}</Text>
      </View>

      <Text className="text-sm font-extrabold text-orange-700 mt-3 italic">{item.description}</Text>

      {item.isLive && !/won|ended/i.test(item.description) && (
        <Animated.Text style={{ opacity: blinkAnim }} className="text-xs ml-40 font-bold text-[#e11313] mt-2">
          ● LIVE
        </Animated.Text>
      )}
    </View>
  );

  return (
    <ImageBackground
      source={{ uri: 'https://cdn.pixabay.com/photo/2017/08/30/07/52/cricket-2691846_1280.jpg' }}
      resizeMode="cover"
      className="flex-1"
      imageStyle={{ opacity: 0.07 }}
    >
      <View className="flex-1 bg-[#F1EAFE] px-4 pt-12">
        <Text className="text-2xl font-bold text-[#2C1371] text-center mb-6">
          Kabaddi Tournaments
        </Text>

        {kabaddiTournaments.map((t) => {
          const isSelected = selectedTournament === t.tournamentName;
          const liveMatches = kabaddiMatches.filter(
            (m) =>
              m.tournamentName === t.tournamentName &&
              m.isLive &&
              isToday(m.date) &&
              !/won|ended/i.test(m.description)
          );

          return (
            <View key={t.tournamentName} className="mb-6">
              <Pressable
                onPress={() =>
                  setSelectedTournament((prev) =>
                    prev === t.tournamentName ? null : t.tournamentName
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
                  <Text className="mt-4 text-sm font-semibold text-[#2C1371]">Ongoing Matches</Text>
                  {liveMatches.length > 0 ? (
                    <FlatList
                      data={liveMatches}
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
