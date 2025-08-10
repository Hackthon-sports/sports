import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Animated,
  ImageBackground,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

interface KabaddiMatch {
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
  currentHalf: 'first' | 'second' | 'completed';
  timeElapsed: number; // in minutes
  halfDuration: number; // typically 20 minutes per half
  raidingTeam: 'teamA' | 'teamB' | null;
  currentRaider: string;
  raidStatus: 'ongoing' | 'successful' | 'failed' | 'empty' | null;
  matchStatus: 'not_started' | 'in_progress' | 'completed' | 'interrupted';
  tossWinner: string;
  tossDecision: 'raid' | 'defend';
  teamAPlayers: number; // players on mat
  teamBPlayers: number; // players on mat
}

interface Tournament {
  tournamentName: string;
  isLive: boolean;
}

interface ScoreButtonProps {
  points: number;
  onPress: (points: number, type: string) => void;
  type: string;
  label: string;
  disabled?: boolean;
  color?: string;
}

const matches: KabaddiMatch[] = [
  {
    id: '1',
    tournamentName: 'Pro Kabaddi League 2025',
    matchName: 'Match 45',
    date: '2025-08-10',
    teamA: 'Patna Pirates',
    teamB: 'Bengaluru Bulls',
    scoreA: 28,
    scoreB: 24,
    isLive: true,
    description: 'Patna Pirates leading by 4 points',
    location: 'Patna',
    organisation: 'PKL',
    currentHalf: 'second',
    timeElapsed: 32,
    halfDuration: 20,
    raidingTeam: 'teamA',
    currentRaider: 'Pardeep Narwal',
    raidStatus: 'ongoing',
    matchStatus: 'in_progress',
    tossWinner: 'Patna Pirates',
    tossDecision: 'raid',
    teamAPlayers: 6,
    teamBPlayers: 5,
  },
  {
    id: '2',
    tournamentName: 'World Kabaddi Championship 2025',
    matchName: 'Semi Final 1',
    date: '2025-08-10',
    teamA: 'India',
    teamB: 'Iran',
    scoreA: 35,
    scoreB: 31,
    isLive: true,
    description: 'India leading by 4 points in 2nd half',
    location: 'Dubai',
    organisation: 'IKF',
    currentHalf: 'second',
    timeElapsed: 25,
    halfDuration: 20,
    raidingTeam: 'teamB',
    currentRaider: 'Mohammad Nabibakhsh',
    raidStatus: 'ongoing',
    matchStatus: 'in_progress',
    tossWinner: 'Iran',
    tossDecision: 'defend',
    teamAPlayers: 7,
    teamBPlayers: 6,
  },
  {
    id: '3',
    tournamentName: 'Kabaddi Masters 2025',
    matchName: 'Group A - Match 2',
    date: '2025-08-10',
    teamA: 'Tamil Thalaivas',
    teamB: 'U Mumba',
    scoreA: 15,
    scoreB: 12,
    isLive: true,
    description: 'Tamil Thalaivas leading by 3 points',
    location: 'Chennai',
    organisation: 'PKL',
    currentHalf: 'first',
    timeElapsed: 14,
    halfDuration: 20,
    raidingTeam: 'teamB',
    currentRaider: 'Abhishek Singh',
    raidStatus: 'ongoing',
    matchStatus: 'in_progress',
    tossWinner: 'U Mumba',
    tossDecision: 'raid',
    teamAPlayers: 7,
    teamBPlayers: 7,
  },
];

export default function AdminKabaddiOngoingScreen() {
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<KabaddiMatch | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [matchData, setMatchData] = useState<KabaddiMatch[]>(matches);
  const blinkAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  // derive tournaments from matches
  const tournaments: Tournament[] = Array.from(
    new Set(matchData.map((m) => m.tournamentName))
  ).map((name) => ({
    tournamentName: name,
    isLive: matchData.some((m) => m.tournamentName === name && m.isLive),
  }));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (modalVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);

  const formatTime = (minutes: number): string => {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const generateMatchDescription = (match: KabaddiMatch): string => {
    if (match.currentHalf === 'completed' || !match.isLive) {
      if (match.scoreA > match.scoreB) {
        const margin = match.scoreA - match.scoreB;
        return `${match.teamA} won by ${margin} points`;
      } else if (match.scoreB > match.scoreA) {
        const margin = match.scoreB - match.scoreA;
        return `${match.teamB} won by ${margin} points`;
      } else {
        return 'Match tied';
      }
    }

    const leadingTeam = match.scoreA > match.scoreB ? match.teamA : 
                       match.scoreB > match.scoreA ? match.teamB : null;
    const margin = Math.abs(match.scoreA - match.scoreB);
    
    if (leadingTeam && margin > 0) {
      const halfText = match.currentHalf === 'first' ? '1st half' : '2nd half';
      return `${leadingTeam} leading by ${margin} point${margin === 1 ? '' : 's'} in ${halfText}`;
    } else {
      const halfText = match.currentHalf === 'first' ? '1st half' : '2nd half';
      return `Scores tied in ${halfText}`;
    }
  };

  const isToday = (dateStr: string): boolean => {
    const matchDate = new Date(dateStr);
    const now = new Date();
    return (
      matchDate.getFullYear() === now.getFullYear() &&
      matchDate.getMonth() === now.getMonth() &&
      matchDate.getDate() === now.getDate()
    );
  };

  const openMatchModal = (match: KabaddiMatch): void => {
    setSelectedMatch(match);
    setModalVisible(true);
  };

  const closeModal = (): void => {
    setModalVisible(false);
    setTimeout(() => setSelectedMatch(null), 300);
  };

  const checkHalfComplete = (match: KabaddiMatch): boolean => {
    return match.timeElapsed >= match.halfDuration * (match.currentHalf === 'first' ? 1 : 2);
  };

  const checkMatchComplete = (match: KabaddiMatch): boolean => {
    return match.currentHalf === 'second' && match.timeElapsed >= match.halfDuration * 2;
  };

  const updateMatchScore = (matchId: string, updateData: Partial<KabaddiMatch>): void => {
    setMatchData(prev => 
      prev.map(match => {
        if (match.id === matchId) {
          let updatedMatch = { ...match, ...updateData };
          
          // Check if first half is complete
          if (match.currentHalf === 'first' && checkHalfComplete(updatedMatch)) {
            updatedMatch.currentHalf = 'second';
            updatedMatch.raidingTeam = updatedMatch.raidingTeam === 'teamA' ? 'teamB' : 'teamA';
          }
          
          // Check if match is complete
          if (checkMatchComplete(updatedMatch)) {
            updatedMatch.currentHalf = 'completed';
            updatedMatch.isLive = false;
            updatedMatch.raidingTeam = null;
            updatedMatch.matchStatus = 'completed';
            updatedMatch.raidStatus = null;
          }
          
          updatedMatch.description = generateMatchDescription(updatedMatch);
          
          return updatedMatch;
        }
        return match;
      })
    );
    
    // Also update selectedMatch if it's the same match
    if (selectedMatch && selectedMatch.id === matchId) {
      setSelectedMatch(prev => {
        if (!prev) return null;
        let updatedMatch = { ...prev, ...updateData };
        
        if (prev.currentHalf === 'first' && checkHalfComplete(updatedMatch)) {
          updatedMatch.currentHalf = 'second';
          updatedMatch.raidingTeam = updatedMatch.raidingTeam === 'teamA' ? 'teamB' : 'teamA';
        }
        
        if (checkMatchComplete(updatedMatch)) {
          updatedMatch.currentHalf = 'completed';
          updatedMatch.isLive = false;
          updatedMatch.raidingTeam = null;
          updatedMatch.matchStatus = 'completed';
          updatedMatch.raidStatus = null;
        }
        
        updatedMatch.description = generateMatchDescription(updatedMatch);
        return updatedMatch;
      });
    }
  };

  const addScore = (points: number, type: string): void => {
    if (!selectedMatch || !selectedMatch.raidingTeam || selectedMatch.currentHalf === 'completed') return;

    const match = { ...selectedMatch };
    const raidingTeam = match.raidingTeam;

    // Add points to the appropriate team
    if (raidingTeam === 'teamA') {
      match.scoreA += points;
    } else {
      match.scoreB += points;
    }

    // Handle different scoring types
    if (type === 'raid_success') {
      // Successful raid - defending players go out
      if (raidingTeam === 'teamA') {
        match.teamBPlayers = Math.max(0, match.teamBPlayers - points);
      } else {
        match.teamAPlayers = Math.max(0, match.teamAPlayers - points);
      }
      match.raidStatus = 'successful';
    } else if (type === 'tackle_success') {
      // Successful tackle - raider is out
      match.raidStatus = 'failed';
    } else if (type === 'all_out_bonus') {
      // All out bonus - revive all players
      if (raidingTeam === 'teamA') {
        match.teamBPlayers = 7;
      } else {
        match.teamAPlayers = 7;
      }
    } else if (type === 'super_raid' || type === 'super_tackle') {
      match.raidStatus = type === 'super_raid' ? 'successful' : 'failed';
    }

    // Switch raiding team after each raid
    match.raidingTeam = match.raidingTeam === 'teamA' ? 'teamB' : 'teamA';
    
    // Increment time slightly (for demo purposes)
    match.timeElapsed += 0.5;

    updateMatchScore(match.id, match);
  };

  const switchHalf = (): void => {
    if (!selectedMatch) return;
    
    const match = { ...selectedMatch };
    if (match.currentHalf === 'first') {
      match.currentHalf = 'second';
      match.timeElapsed = match.halfDuration;
      match.raidingTeam = match.raidingTeam === 'teamA' ? 'teamB' : 'teamA';
    }
    
    updateMatchScore(match.id, match);
  };

  const switchRaidingTeam = (): void => {
    if (!selectedMatch) return;
    
    const match = { ...selectedMatch };
    match.raidingTeam = match.raidingTeam === 'teamA' ? 'teamB' : 'teamA';
    match.raidStatus = 'ongoing';
    
    updateMatchScore(match.id, match);
  };

  const renderMatch = ({ item }: { item: KabaddiMatch }) => (
    <Pressable
      onPress={() => openMatchModal(item)}
      className="bg-white rounded-2xl p-4 mt-4 shadow shadow-black/10 border border-gray-100"
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-base font-semibold text-[#2C1371]">{item.matchName}</Text>
          <Text className="text-xs text-purple-600 mt-1">
            {item.date} • {item.location} • {item.organisation}
          </Text>
        </View>
        {item.isLive && (
          <Animated.View style={{ opacity: blinkAnim }} className="bg-red-600 px-2 py-1 rounded-full">
            <Text className="text-xs font-bold text-white">● LIVE</Text>
          </Animated.View>
        )}
      </View>

      <View className="space-y-2 mt-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-sm font-medium text-[#2C1371] flex-1">{item.teamA}</Text>
          <Text className="text-lg font-bold text-black">{item.scoreA}</Text>
        </View>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-sm font-medium text-[#2C1371] flex-1">{item.teamB}</Text>
          <Text className="text-lg font-bold text-black">{item.scoreB}</Text>
        </View>
      </View>

      <View className="mt-3 p-2 bg-orange-50 rounded-lg">
        <Text className="text-sm font-extrabold text-orange-700 text-center">{item.description}</Text>
      </View>

      {item.isLive && (
        <View className="flex-row justify-between mt-2">
          <Text className="text-xs text-gray-600">
            {item.currentHalf === 'first' ? '1st Half' : '2nd Half'} • {formatTime(item.timeElapsed)}
          </Text>
          <Text className="text-xs text-gray-600">
            Raiding: {item.raidingTeam === 'teamA' ? item.teamA : item.teamB}
          </Text>
        </View>
      )}
    </Pressable>
  );

  const ScoreButton: React.FC<ScoreButtonProps> = ({ 
    points, 
    onPress, 
    type, 
    label, 
    disabled = false,
    color = 'bg-blue-500'
  }) => (
    <Pressable
      onPress={() => onPress(points, type)}
      disabled={disabled}
      className={`px-3 py-2 m-1 rounded-lg ${
        disabled ? 'bg-gray-300' : color
      }`}
    >
      <Text className={`font-semibold text-center text-sm ${disabled ? 'text-gray-500' : 'text-white'}`}>
        {label}
      </Text>
    </Pressable>
  );

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070' }}
      resizeMode="cover"
      className="flex-1"
      imageStyle={{ opacity: 0.07 }}
    >
      <View className="flex-1 bg-[#F1EAFE] px-4 pt-12">
        <Text className="text-2xl font-bold text-[#2C1371] text-center mb-6">Admin - Live Kabaddi</Text>

        {tournaments.map((t) => {
          const isSelected = selectedTournament === t.tournamentName;
          const todayMatches = matchData.filter(
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
                  {t.tournamentName} {t.isLive && '●'}
                </Text>
              </Pressable>

              {isSelected && (
                <>
                  <Text className="mt-4 text-sm font-semibold text-[#2C1371]">
                    Live Matches Today
                  </Text>
                  {todayMatches.length > 0 ? (
                    <FlatList
                      data={todayMatches}
                      keyExtractor={(m) => m.id}
                      renderItem={renderMatch}
                      showsVerticalScrollIndicator={false}
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

      {/* Live Scoring Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
      >
        <View className="flex-1 bg-black/50">
          <Animated.View
            style={{
              transform: [{ translateY: slideAnim }],
              flex: 1,
              marginTop: 100,
            }}
            className="bg-white rounded-t-3xl"
          >
            {selectedMatch && (
              <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="flex-row justify-between items-center mb-4">
                  <View className="flex-1">
                    <Text className="text-xl font-bold text-[#2C1371]">
                      {selectedMatch.tournamentName}
                    </Text>
                    <Text className="text-sm text-purple-600">
                      {selectedMatch.matchName} • {selectedMatch.location}
                    </Text>
                  </View>
                  <Pressable onPress={closeModal} className="bg-gray-200 rounded-full p-2">
                    <Text className="text-lg font-bold text-gray-600">×</Text>
                  </Pressable>
                </View>

                {/* Toss Info */}
                <View className="bg-blue-50 rounded-2xl p-3 mb-4">
                  <Text className="text-center text-blue-800 text-sm">
                    Toss: {selectedMatch.tossWinner} won and chose to {selectedMatch.tossDecision} first
                  </Text>
                </View>

                {/* Match Timer */}
                <View className="bg-[#F1EAFE] rounded-2xl p-4 mb-4">
                  <Text className="text-lg font-semibold text-[#2C1371] text-center">
                    {selectedMatch.currentHalf === 'first' ? '1st Half' : 
                     selectedMatch.currentHalf === 'second' ? '2nd Half' : 'Match Completed'}
                  </Text>
                  <Text className="text-center text-purple-600 text-xl font-bold mt-1">
                    {formatTime(selectedMatch.timeElapsed)} / {formatTime(selectedMatch.halfDuration * 2)}
                  </Text>
                </View>

                {/* Live Score Display */}
                <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                  <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-lg font-bold text-[#2C1371]">
                      {selectedMatch.teamA}
                    </Text>
                    <Text className="text-lg font-bold text-gray-500">VS</Text>
                    <Text className="text-lg font-bold text-[#2C1371]">
                      {selectedMatch.teamB}
                    </Text>
                  </View>

                  <View className="space-y-3">
                    <View className={`flex-row justify-between items-center p-4 rounded-xl ${
                      selectedMatch.raidingTeam === 'teamA' ? 'bg-green-100 border-2 border-green-300' : 'bg-white'
                    }`}>
                      <View>
                        <Text className="text-2xl font-bold text-black">
                          {selectedMatch.scoreA}
                        </Text>
                        <Text className="text-sm text-gray-600">
                          Players on mat: {selectedMatch.teamAPlayers}
                        </Text>
                      </View>
                      {selectedMatch.raidingTeam === 'teamA' && (
                        <Text className="text-xs font-bold text-green-600 bg-green-200 px-2 py-1 rounded">
                          RAIDING
                        </Text>
                      )}
                    </View>

                    <View className={`flex-row justify-between items-center p-4 rounded-xl ${
                      selectedMatch.raidingTeam === 'teamB' ? 'bg-green-100 border-2 border-green-300' : 'bg-white'
                    }`}>
                      <View>
                        <Text className="text-2xl font-bold text-black">
                          {selectedMatch.scoreB}
                        </Text>
                        <Text className="text-sm text-gray-600">
                          Players on mat: {selectedMatch.teamBPlayers}
                        </Text>
                      </View>
                      {selectedMatch.raidingTeam === 'teamB' && (
                        <Text className="text-xs font-bold text-green-600 bg-green-200 px-2 py-1 rounded">
                          RAIDING
                        </Text>
                      )}
                    </View>
                  </View>
                </View>

                {/* Match Status */}
                <View className="bg-orange-50 rounded-xl p-4 mb-4">
                  <Text className="text-center text-orange-800 font-bold text-lg">
                    {selectedMatch.description}
                  </Text>
                </View>

                {selectedMatch.isLive && selectedMatch.raidingTeam && selectedMatch.currentHalf !== 'completed' && (
                  <>
                    {/* Current Raid Info */}
                    <View className="bg-blue-50 rounded-xl p-4 mb-4">
                      <View className="flex-row justify-between items-center">
                        <View>
                          <Text className="text-blue-800 font-bold">
                            Current Raider: {selectedMatch.currentRaider}
                          </Text>
                          <Text className="text-blue-600 text-sm">
                            Raiding Team: {selectedMatch.raidingTeam === 'teamA' ? selectedMatch.teamA : selectedMatch.teamB}
                          </Text>
                        </View>
                        <View className="items-center">
                          <Text className="text-xs text-blue-600">Raid Status</Text>
                          <Text className="font-bold text-blue-800 text-sm">
                            {selectedMatch.raidStatus?.toUpperCase() || 'ONGOING'}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Manual Half Switch */}
                    {selectedMatch.currentHalf === 'first' && (
                      <Pressable
                        onPress={switchHalf}
                        className="bg-purple-600 rounded-xl p-3 mb-4"
                      >
                        <Text className="text-white font-semibold text-center">
                          Switch to 2nd Half
                        </Text>
                      </Pressable>
                    )}

                    {/* Switch Raiding Team */}
                    <Pressable
                      onPress={switchRaidingTeam}
                      className="bg-indigo-600 rounded-xl p-3 mb-4"
                    >
                      <Text className="text-white font-semibold text-center">
                        Switch Raiding Team
                      </Text>
                    </Pressable>

                    {/* Scoring Interface */}
                    <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                      <Text className="text-lg font-bold text-[#2C1371] mb-4 text-center">
                        Score Update
                      </Text>
                      
                      {/* Raiding Points */}
                      <Text className="text-md font-semibold text-green-700 mb-2">Raid Points</Text>
                      <View className="flex-row flex-wrap justify-center mb-4">
                        <ScoreButton
                          points={1}
                          onPress={addScore}
                          type="raid_success"
                          label="Touch Point"
                          color="bg-green-600"
                        />
                        <ScoreButton
                          points={2}
                          onPress={addScore}
                          type="raid_success"
                          label="Bonus Point"
                          color="bg-green-600"
                        />
                        <ScoreButton
                          points={3}
                          onPress={addScore}
                          type="super_raid"
                          label="Super Raid"
                          color="bg-green-700"
                        />
                      </View>

                      {/* Defensive Points */}
                      <Text className="text-md font-semibold text-red-700 mb-2">Defensive Points</Text>
                      <View className="flex-row flex-wrap justify-center mb-4">
                        <ScoreButton
                          points={1}
                          onPress={addScore}
                          type="tackle_success"
                          label="Tackle Point"
                          color="bg-red-600"
                        />
                        <ScoreButton
                          points={2}
                          onPress={addScore}
                          type="super_tackle"
                          label="Super Tackle"
                          color="bg-red-700"
                        />
                      </View>

                      {/* Bonus Points */}
                      <Text className="text-md font-semibold text-purple-700 mb-2">Bonus Points</Text>
                      <View className="flex-row flex-wrap justify-center mb-4">
                        <ScoreButton
                          points={2}
                          onPress={addScore}
                          type="all_out_bonus"
                          label="All Out Bonus"
                          color="bg-purple-600"
                        />
                        <ScoreButton
                          points={1}
                          onPress={addScore}
                          type="technical_point"
                          label="Technical Point"
                          color="bg-purple-600"
                        />
                      </View>
                    </View>
                  </>
                )}

                {!selectedMatch.isLive && (
                  <View className="bg-gray-100 rounded-xl p-4">
                    <Text className="text-center text-gray-600 font-semibold text-lg">
                      🏆 Match Completed
                    </Text>
                    <Text className="text-center text-orange-700 font-bold mt-2 text-lg">
                      {selectedMatch.description}
                    </Text>
                  </View>
                )}
              </ScrollView>
            )}
          </Animated.View>
        </View>
      </Modal>
    </ImageBackground>
  );
}