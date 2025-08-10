import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Animated,
  ImageBackground,
} from 'react-native';

const matches = [
  {
    id: '1',
    tournamentName: 'Asia Cup 2025',
    matchName: 'Super 4 - Match 1',
    date: '2025-08-10',
    teamA: 'India',
    teamB: 'Pakistan',
    runsa: 172,
    wicketsa: 4,
    oversa: 20.0,
    runsb: 165,
    wicketsb: 8,
    oversb: 18.0,
    isLive: true,
    description: 'Pakistan needs 8 runs in 12 balls',
    location: 'Colombo',
    organisation: 'ACC',
  },
  {
    id: '2',
    tournamentName: 'World Cup 2025',
    matchName: 'Group A - Match 3',
    date: '2025-08-10',
    teamA: 'Australia',
    teamB: 'England',
    runsa: 190,
    wicketsa: 5,
    oversa: 20.0,
    runsb: 140,
    wicketsb: 6,
    oversb: 17.2,
    isLive: true,
    description: 'England needs 51 runs in 14 balls',
    location: 'Melbourne',
    organisation: 'ICC',
  },
  {
    id: '3',
    tournamentName: 'Tri-Series Final',
    matchName: 'Final',
    date: '2025-08-05',
    teamA: 'South Africa',
    teamB: 'New Zealand',
    runsa: 250,
    wicketsa: 7,
    oversa: 50.0,
    runsb: 248,
    wicketsb: 9,
    oversb: 50.0,
    isLive: false,
    description: 'Match Finished',
    location: 'Cape Town',
    organisation: 'CSA',
  },
];

export default function TournamentOngoingScreen() {
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null);
  const blinkAnim = useRef(new Animated.Value(0)).current;

  // derive tournaments from matches
  const tournaments = Array.from(
    new Set(matches.map((m) => m.tournamentName))
  ).map((name) => ({
    tournamentName: name,
    isLive: matches.some((m) => m.tournamentName === name && m.isLive),
  }));

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
        <Text className="text-sm font-bold text-black">
          {item.runsa} - {item.wicketsa} ({item.oversa} ov)
        </Text>
      </View>
      <View className="flex-row justify-between mt-1">
        <Text className="text-sm font-medium text-[#2C1371]">{item.teamB}</Text>
        <Text className="text-sm font-bold text-black">
          {item.runsb} - {item.wicketsb} ({item.oversb} ov)
        </Text>
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
      source={{ uri: 'https://cdn.pixabay.com/photo/2017/08/30/07/52/cricket-2691846_1280.jpg' }}
      resizeMode="cover"
      className="flex-1"
      imageStyle={{ opacity: 0.07 }}
    >
      <View className="flex-1 bg-[#F1EAFE] px-4 pt-12">
        <Text className="text-2xl font-bold text-[#2C1371] text-center mb-6">Tournaments</Text>

        {tournaments.map((t) => {
          const isSelected = selectedTournament === t.tournamentName;
          const todayMatches = matches.filter(
            (m) =>
              m.tournamentName === t.tournamentName &&
              m.isLive &&
              isToday(m.date)
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
