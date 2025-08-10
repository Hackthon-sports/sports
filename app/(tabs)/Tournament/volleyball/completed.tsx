import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ImageBackground,
} from 'react-native';
type Match = {
  id: string;
  tournamentName: string;
  matchName: string;
  date: string;
  teamA: string;
  teamB: string;
  teamAScore: string;
  teamBScore: string;
  isLive: boolean;
  isCompleted: boolean;
  description: string;
  location: string;
  organisation: string;
};

const matches: Match[] = [
  {
    id: '1',
    tournamentName: 'Asian Volleyball Championship',
    matchName: 'Final',
    date: '2025-08-02T18:00:00',
    teamA: 'India',
    teamB: 'Iran',
    teamAScore: '3',
    teamBScore: '1',
    isLive: false,
    isCompleted: true,
    description: 'India won 3-1 in sets',
    location: 'Bangkok',
    organisation: 'AVC',
  },
  {
    id: '2',
    tournamentName: 'South Asian Volleyball Games',
    matchName: 'Bronze Match',
    date: '2025-08-01T17:00:00',
    teamA: 'Sri Lanka',
    teamB: 'Nepal',
    teamAScore: '3',
    teamBScore: '2',
    isLive: false,
    isCompleted: true,
    description: 'Sri Lanka won a tight 5-setter',
    location: 'Colombo',
    organisation: 'SAVC',
  },
];

export default function CompletedVolleyballScreen() {
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null);

  const completedMatches = matches.filter((m) => m.isCompleted && !m.isLive);
  const tournaments = Array.from(new Set(completedMatches.map((m) => m.tournamentName)));

  const renderMatch = ({ item }: { item: Match }) => (
    <View className="bg-white rounded-2xl p-4 mt-4 shadow shadow-black/10">
      <Text className="text-base font-semibold text-[#2C1371]">{item.matchName}</Text>
      <Text className="text-xs text-purple-600 mt-1">
        {new Date(item.date).toLocaleDateString()} · {item.location}
      </Text>
      <Text className="text-xs italic text-purple-500">{item.organisation}</Text>

      <View className="flex-row justify-between mt-3">
        <Text className="text-sm font-medium text-[#2C1371]">{item.teamA}</Text>
        <Text className="text-sm font-bold text-black">{item.teamAScore}</Text>
      </View>
      <View className="flex-row justify-between mt-1">
        <Text className="text-sm font-medium text-[#2C1371]">{item.teamB}</Text>
        <Text className="text-sm font-bold text-black">{item.teamBScore}</Text>
      </View>

      <Text className="text-sm font-extrabold text-orange-700 mt-3 italic">{item.description}</Text>
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
          Tournaments
        </Text>

        {tournaments.map((t) => {
          const isSelected = selectedTournament === t;
          const currentMatches = completedMatches.filter(
            (m) => m.tournamentName === t
          );

          return (
            <View key={t} className="mb-6">
              <Pressable
                onPress={() =>
                  setSelectedTournament(selectedTournament === t ? null : t)
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
                  {t}
                </Text>
              </Pressable>

              {isSelected && (
                <>
                  <Text className="mt-4 text-sm font-semibold text-[#2C1371]">Completed Matches</Text>
                  {currentMatches.length > 0 ? (
                    <FlatList
                      data={currentMatches}
                      keyExtractor={(m) => m.id}
                      renderItem={renderMatch}
                    />
                  ) : (
                    <Text className="text-xs italic text-gray-500 mt-2">No completed matches.</Text>
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
