import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ImageBackground,
  StyleSheet,
} from 'react-native';

const BG_IMAGE_URL =
  'https://cdn.pixabay.com/photo/2017/08/30/07/52/cricket-2691846_1280.jpg';

type Match = {
  id: string;
  tournamentName: string;
  matchName: string;
  date: string;
  teamA: string;
  teamB: string;
  location: string;
  organisation: string;
  isLive: boolean;
};

const matches: Match[] = [
  {
    id: '1',
    tournamentName: 'Kabaddi Asia Cup',
    matchName: 'Qualifier 1',
    date: '2025-08-10T18:00:00',
    teamA: 'India',
    teamB: 'Sri Lanka',
    location: 'Ahmedabad',
    organisation: 'AKF',
    isLive: false,
  },
  {
    id: '2',
    tournamentName: 'Kabaddi World Cup',
    matchName: 'Group B - Match 3',
    date: '2025-08-12T20:30:00',
    teamA: 'Iran',
    teamB: 'Pakistan',
    location: 'Tehran',
    organisation: 'IKF',
    isLive: false,
  },
  {
    id: '3',
    tournamentName: 'Pro Kabaddi League',
    matchName: 'Eliminator',
    date: '2025-08-06T19:00:00',
    teamA: 'Bengal Warriors',
    teamB: 'Dabang Delhi',
    location: 'Kolkata',
    organisation: 'PKL',
    isLive: true,
  },
];

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

const getMatchDescription = (matchDateStr: string): string => {
  const now = new Date();
  const matchDate = new Date(matchDateStr);

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const addDays = (d: Date, days: number) => {
    const copy = new Date(d);
    copy.setDate(copy.getDate() + days);
    return copy;
  };

  let prefix = '';
  if (isSameDay(matchDate, now)) {
    prefix = 'Today';
  } else if (isSameDay(matchDate, addDays(now, 1))) {
    prefix = 'Tomorrow';
  } else {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    prefix = matchDate.toLocaleDateString(undefined, options);
  }

  const timeString = matchDate.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return `${prefix} at ${timeString}`;
};

const UpcomingKabaddiScreen = () => {
  const [expandedTournament, setExpandedTournament] = useState<string | null>(null);
  const now = new Date();

  // Extract unique tournaments
  const tournaments = Array.from(
    new Set(matches.map((m) => m.tournamentName))
  );

  const renderMatchCard = (item: Match) => (
    <View
      key={item.id}
      className="mb-4 rounded-2xl bg-white p-4 shadow-md"
    >
      <Text className="text-[#2C1371] font-semibold text-sm mb-1">{item.matchName}</Text>
      <View className="flex-row justify-between">
        <Text className="text-xs text-purple-700">{item.date.split('T')[0]}</Text>
        <Text className="text-xs text-purple-700">{item.location}</Text>
      </View>
      <Text className="text-xs italic text-purple-500 mt-1">{item.organisation}</Text>

      <View className="flex-row justify-between mt-3 mb-2 px-1">
        <Text className="text-[#2C1371] text-sm font-medium">{item.teamA}</Text>
        <Text className="text-[#2C1371] text-sm font-medium">vs</Text>
        <Text className="text-[#2C1371] text-sm font-medium">{item.teamB}</Text>
      </View>

      <Text className="text-sm italic font-extrabold text-orange-700">
        {getMatchDescription(item.date)}
      </Text>
    </View>
  );

  return (
    <ImageBackground
      source={{ uri: BG_IMAGE_URL }}
      resizeMode="cover"
      style={styles.bg}
      imageStyle={{ opacity: 0.06 }}
    >
      <ScrollView className="flex-1 pt-12 px-4 bg-[#F1EAFE]">
        <Text className="text-2xl font-bold text-[#2C1371] text-center mb-6">
          Kabaddi Tournaments
        </Text>

        {tournaments.map((tournamentName) => {
          const isOpen = expandedTournament === tournamentName;

          const upcoming = matches.filter(
            (m) =>
              m.tournamentName === tournamentName &&
              !m.isLive &&
              new Date(m.date) >= now
          );

          return (
            <View key={tournamentName} className="mb-6">
              <Pressable
                onPress={() =>
                  setExpandedTournament(
                    expandedTournament === tournamentName ? null : tournamentName
                  )
                }
                className={`px-4 py-3 rounded-2xl ${
                  isOpen ? 'bg-[#9B77F6]' : 'bg-[#c5acf7]'
                }`}
              >
                <Text
                  className={`text-base font-semibold ${
                    isOpen ? 'text-white' : 'text-[#2C1371]'
                  }`}
                >
                  {tournamentName}
                </Text>
              </Pressable>

              {isOpen && (
                <View className="mt-3">
                  {upcoming.length > 0 ? (
                    <>
                      <Text className="text-base font-semibold text-[#2C1371] mb-2">
                        Upcoming Matches
                      </Text>
                      {upcoming.map(renderMatchCard)}
                    </>
                  ) : (
                    <Text className="text-center text-gray-500 italic mt-2">
                      No upcoming matches.
                    </Text>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </ImageBackground>
  );
};

export default UpcomingKabaddiScreen;
