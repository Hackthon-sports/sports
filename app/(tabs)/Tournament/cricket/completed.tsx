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
  runsa: number;
  wicketsa: number;
  oversa: number;
  runsb: number;
  wicketsb: number;
  oversb: number;
  isLive: boolean;
  description: string;
  location: string;
  organisation: string;
};

const matches: Match[] = [
  {
    id: '1',
    tournamentName: 'Asia Cup 2025',
    matchName: 'Super 4 - Match 1',
    date: '2025-08-04',
    teamA: 'India',
    teamB: 'Pakistan',
    runsa: 172,
    wicketsa: 4,
    oversa: 20.0,
    runsb: 165,
    wicketsb: 8,
    oversb: 18.0,
    isLive: false,
    description: 'India won by 7 runs',
    location: 'Colombo',
    organisation: 'ACC',
  },
  {
    id: '2',
    tournamentName: 'Asia Cup 2025',
    matchName: 'Super 4 - Match 2',
    date: '2025-08-05',
    teamA: 'Sri Lanka',
    teamB: 'Bangladesh',
    runsa: 190,
    wicketsa: 6,
    oversa: 20,
    runsb: 142,
    wicketsb: 9,
    oversb: 18.5,
    isLive: false,
    description: 'Sri Lanka won by 48 runs',
    location: 'Colombo',
    organisation: 'ACC',
  },
];

export default function CompletedMatchesSection() {
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null);

  const completedMatches = matches.filter((m) => !m.isLive);
  const tournaments = Array.from(new Set(completedMatches.map((m) => m.tournamentName)));

  const renderMatch = ({ item }: { item: Match }) => (
    <View className="bg-white rounded-2xl p-4 mt-4 shadow shadow-black/10">
      <Text className="text-base font-semibold text-[#2C1371]">{item.matchName}</Text>
      <Text className="text-xs text-purple-600 mt-1">
        {item.date} · {item.location}
      </Text>
      <Text className="text-xs italic text-purple-500">{item.organisation}</Text>

      <View className="flex-row justify-between mt-3">
        <Text className="text-sm font-medium text-[#2C1371]">{item.teamA}</Text>
        <Text className="text-sm font-bold text-black">{item.runsa} - {item.wicketsa} ({item.oversa} ov)</Text>
      </View>
      <View className="flex-row justify-between mt-1">
        <Text className="text-sm font-medium text-[#2C1371]">{item.teamB}</Text>
        <Text className="text-sm font-bold text-black">{item.runsb} - {item.wicketsb} ({item.oversb} ov)</Text>
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
                  setSelectedTournament((prev) => (prev === t ? null : t))
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
