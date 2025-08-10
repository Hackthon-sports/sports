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

interface Match {
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
  battingTeam: 'teamA' | 'teamB' | null;
  currentBall: number;
  innings: 'first' | 'second' | 'completed';
  targetRuns: number | null;
  tossWinner: string;
  tossDecision: 'bat' | 'bowl';
  matchStatus: 'not_started' | 'in_progress' | 'completed' | 'interrupted';
  ballsLeft: number;
}

interface Tournament {
  tournamentName: string;
  isLive: boolean;
}

interface RunButtonProps {
  runs: number;
  onPress: (runs: number, isExtra?: boolean) => void;
  isExtra?: boolean;
  label?: string;
  disabled?: boolean;
}

const matches: Match[] = [
  {
    id: '1',
    tournamentName: 'Asia Cup 2025',
    matchName: 'Super 4 - Match 1',
    date: '2025-08-10',
    teamA: 'India',
    teamB: 'Pakistan',
    runsa: 165,
    wicketsa: 10,
    oversa: 19.4,
    runsb: 158,
    wicketsb: 7,
    oversb: 18.2,
    isLive: true,
    description: 'Pakistan need 8 runs from 10 balls',
    location: 'Colombo',
    organisation: 'ACC',
    battingTeam: 'teamB',
    currentBall: 2,
    innings: 'second',
    targetRuns: 166,
    tossWinner: 'Pakistan',
    tossDecision: 'bowl',
    matchStatus: 'in_progress',
    ballsLeft: 10,
  },
  {
    id: '2',
    tournamentName: 'World Cup 2025',
    matchName: 'Group A - Match 3',
    date: '2025-08-10',
    teamA: 'Australia',
    teamB: 'England',
    runsa: 187,
    wicketsa: 6,
    oversa: 20.0,
    runsb: 142,
    wicketsb: 4,
    oversb: 16.3,
    isLive: true,
    description: 'England need 46 runs from 22 balls',
    location: 'Melbourne',
    organisation: 'ICC',
    battingTeam: 'teamB',
    currentBall: 3,
    innings: 'second',
    targetRuns: 188,
    tossWinner: 'England',
    tossDecision: 'bowl',
    matchStatus: 'in_progress',
    ballsLeft: 22,
  },
  {
    id: '3',
    tournamentName: 'IPL 2025',
    matchName: 'Match 45',
    date: '2025-08-10',
    teamA: 'Chennai Super Kings',
    teamB: 'Mumbai Indians',
    runsa: 164,
    wicketsa: 4,
    oversa: 15.2,
    runsb: 0,
    wicketsb: 0,
    oversb: 0.0,
    isLive: true,
    description: 'CSK: 164/4 after 15.2 overs',
    location: 'Chennai',
    organisation: 'BCCI',
    battingTeam: 'teamA',
    currentBall: 2,
    innings: 'first',
    targetRuns: null,
    tossWinner: 'Chennai Super Kings',
    tossDecision: 'bat',
    matchStatus: 'in_progress',
    ballsLeft: 28,
  },
];

export default function AdminOngoingScreen() {
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [matchData, setMatchData] = useState<Match[]>(matches);
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

  // The original calculateBallsLeft function was incorrect as it produced float values.
  // The logic is now integrated directly into generateMatchDescription.
  const formatOvers = (overs: number): string => {
    const completeOvers = Math.floor(overs);
    const balls = Math.round((overs - completeOvers) * 10);
    return balls === 0 ? `${completeOvers}` : `${completeOvers}.${balls}`;
  };

  // -----------------
  // FIXED FUNCTIONALITY
  // -----------------
  const generateMatchDescription = (match: Match): string => {
    if (match.innings === 'completed' || !match.isLive) {
      if (match.runsa > match.runsb) {
        const margin = match.runsa - match.runsb;
        return `${match.teamA} won by ${margin} runs`;
      } else if (match.runsb > match.runsa) {
        const wicketsLeft = 10 - match.wicketsb;
        return `${match.teamB} won by ${wicketsLeft} ${wicketsLeft === 1 ? 'wicket' : 'wickets'}`;
      } else {
        return 'Match tied';
      }
    }

    if (match.innings === 'first') {
      const battingTeamName = match.battingTeam === 'teamA' ? match.teamA : match.teamB;
      const runs = match.battingTeam === 'teamA' ? match.runsa : match.runsb;
      const wickets = match.battingTeam === 'teamA' ? match.wicketsa : match.wicketsb;
      const overs = match.battingTeam === 'teamA' ? match.oversa : match.oversb;

      if (wickets >= 10) {
        return `${battingTeamName}: ${runs}/10 (${formatOvers(overs)} ov) - All out`;
      } else if (overs >= 20.0) {
        return `${battingTeamName}: ${runs}/${wickets} (20 ov) - Innings closed`;
      } else {
        return `${battingTeamName}: ${runs}/${wickets} (${formatOvers(overs)} ov)`;
      }
    }

    if (match.innings === 'second' && match.targetRuns) {
      const chasingTeam = match.battingTeam === 'teamA' ? match.teamA : match.teamB;
      const currentRuns = match.battingTeam === 'teamA' ? match.runsa : match.runsb;
      const currentWickets = match.battingTeam === 'teamA' ? match.wicketsa : match.wicketsb;
      const currentOvers = match.battingTeam === 'teamA' ? match.oversa : match.oversb;
      const runsNeeded = match.targetRuns - currentRuns;

      if (runsNeeded <= 0) {
        const wicketsLeft = 10 - currentWickets;
        return `${chasingTeam} won by ${wicketsLeft} ${wicketsLeft === 1 ? 'wicket' : 'wickets'}`;
      }

      // Convert currentOvers float to total balls bowled
      const oversInt = Math.floor(currentOvers);
      const ballsInCurrentOver = Math.round((currentOvers - oversInt) * 10);
      const ballsBowled = oversInt * 6 + ballsInCurrentOver;

      const totalBalls = 20 * 6; // Assuming 20-over match
      const ballsLeft = totalBalls - ballsBowled;

      if (currentWickets >= 10 || ballsLeft <= 0) {
        const firstTeam = match.battingTeam === 'teamA' ? match.teamB : match.teamA;
        const margin = (match.battingTeam === 'teamA' ? match.runsb : match.runsa) - currentRuns;
        return `${firstTeam} won by ${margin} runs`;
      }

      let oversDisplay: string;
      const remainingOvers = Math.floor(ballsLeft / 6);
      const remainingBalls = ballsLeft % 6;

      if (remainingOvers > 0 && remainingBalls === 0) {
        oversDisplay = `${remainingOvers} overs`;
      } else if (remainingOvers > 0 && remainingBalls > 0) {
        oversDisplay = `${remainingOvers}.${remainingBalls} overs`;
      } else {
        oversDisplay = `${ballsLeft} ball${ballsLeft === 1 ? '' : 's'}`;
      }

      return `${chasingTeam} need ${runsNeeded} runs from ${oversDisplay}`;
    }

    return match.description;
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

  const openMatchModal = (match: Match): void => {
    setSelectedMatch(match);
    setModalVisible(true);
  };

  const closeModal = (): void => {
    setModalVisible(false);
    setTimeout(() => setSelectedMatch(null), 300);
  };

  const checkInningsComplete = (match: Match): boolean => {
    const currentTeam = match.battingTeam;
    if (!currentTeam) return false;
    
    const wickets = currentTeam === 'teamA' ? match.wicketsa : match.wicketsb;
    const overs = currentTeam === 'teamA' ? match.oversa : match.oversb;
    
    return wickets >= 10 || overs >= 20.0;
  };

  const checkMatchComplete = (match: Match): boolean => {
    if (match.innings === 'first') return false;
    
    if (match.targetRuns) {
      const chasingRuns = match.battingTeam === 'teamA' ? match.runsa : match.runsb;
      const chasingWickets = match.battingTeam === 'teamA' ? match.wicketsa : match.wicketsb;
      const chasingOvers = match.battingTeam === 'teamA' ? match.oversa : match.oversb;
      
      if (chasingRuns >= match.targetRuns) return true;
      
      if (chasingWickets >= 10 || chasingOvers >= 20.0) return true;
    }
    
    return false;
  };
  
  // A helper function to update the ballsLeft property
  const updateBallsLeft = (match: Match): Match => {
    if (match.innings === 'second') {
        const currentOvers = match.battingTeam === 'teamA' ? match.oversa : match.oversb;
        const oversInt = Math.floor(currentOvers);
        const ballsInCurrentOver = Math.round((currentOvers - oversInt) * 10);
        const ballsBowled = oversInt * 6 + ballsInCurrentOver;
        const totalBalls = 20 * 6;
        return { ...match, ballsLeft: totalBalls - ballsBowled };
    }
    return match;
  };

  const updateMatchScore = (matchId: string, updateData: Partial<Match>): void => {
    setMatchData(prev => 
      prev.map(match => {
        if (match.id === matchId) {
          let updatedMatch = { ...match, ...updateData };
          
          // Update ballsLeft
          updatedMatch = updateBallsLeft(updatedMatch);
          
          // Check if current innings is complete
          if (checkInningsComplete(updatedMatch) && updatedMatch.innings === 'first') {
            updatedMatch.battingTeam = updatedMatch.battingTeam === 'teamA' ? 'teamB' : 'teamA';
            updatedMatch.innings = 'second';
            updatedMatch.currentBall = 0;
            updatedMatch.targetRuns = updatedMatch.battingTeam === 'teamA' ? updatedMatch.runsb + 1 : updatedMatch.runsa + 1;
            updatedMatch = updateBallsLeft(updatedMatch);
          }
          
          // Check if match is complete
          if (checkMatchComplete(updatedMatch)) {
            updatedMatch.innings = 'completed';
            updatedMatch.isLive = false;
            updatedMatch.battingTeam = null;
            updatedMatch.matchStatus = 'completed';
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
        
        updatedMatch = updateBallsLeft(updatedMatch);

        if (checkInningsComplete(updatedMatch) && updatedMatch.innings === 'first') {
          updatedMatch.battingTeam = updatedMatch.battingTeam === 'teamA' ? 'teamB' : 'teamA';
          updatedMatch.innings = 'second';
          updatedMatch.currentBall = 0;
          updatedMatch.targetRuns = updatedMatch.battingTeam === 'teamA' ? updatedMatch.runsb + 1 : updatedMatch.runsa + 1;
          updatedMatch = updateBallsLeft(updatedMatch);
        }
        
        if (checkMatchComplete(updatedMatch)) {
          updatedMatch.innings = 'completed';
          updatedMatch.isLive = false;
          updatedMatch.battingTeam = null;
          updatedMatch.matchStatus = 'completed';
        }
        
        updatedMatch.description = generateMatchDescription(updatedMatch);
        return updatedMatch;
      });
    }
  };

  const addRuns = (runs: number, isExtra: boolean = false): void => {
    if (!selectedMatch || !selectedMatch.battingTeam) return;

    const match = { ...selectedMatch };
    const battingTeam = match.battingTeam;

    if (battingTeam === 'teamA') {
      match.runsa += runs;
    } else {
      match.runsb += runs;
    }

    if (!isExtra) {
      const currentOvers = battingTeam === 'teamA' ? match.oversa : match.oversb;
      const currentWickets = battingTeam === 'teamA' ? match.wicketsa : match.wicketsb;
      
      if (currentOvers >= 20.0 || currentWickets >= 10) {
        updateMatchScore(match.id, match);
        return;
      }
      
      match.currentBall++;
      
      if (match.currentBall >= 6) {
        match.currentBall = 0;
        const completeOvers = Math.floor(currentOvers) + 1;
        
        if (battingTeam === 'teamA') {
          match.oversa = Math.min(completeOvers, 20.0);
        } else {
          match.oversb = Math.min(completeOvers, 20.0);
        }
      } else {
        const completeOvers = Math.floor(currentOvers);
        const newOvers = completeOvers + (match.currentBall / 10);
        
        if (battingTeam === 'teamA') {
          match.oversa = parseFloat(newOvers.toFixed(1));
        } else {
          match.oversb = parseFloat(newOvers.toFixed(1));
        }
      }
    }

    updateMatchScore(match.id, match);
  };

  const addWicket = (): void => {
    if (!selectedMatch || !selectedMatch.battingTeam) return;

    const match = { ...selectedMatch };
    const battingTeam = match.battingTeam;

    if (battingTeam === 'teamA') {
      match.wicketsa++;
    } else {
      match.wicketsb++;
    }

    const currentWickets = battingTeam === 'teamA' ? match.wicketsa : match.wicketsb;
    const currentOvers = battingTeam === 'teamA' ? match.oversa : match.oversb;

    if (currentWickets >= 10 || currentOvers >= 20.0) {
      updateMatchScore(match.id, match);
      return;
    }

    match.currentBall++;
    
    if (match.currentBall >= 6) {
      match.currentBall = 0;
      const completeOvers = Math.floor(currentOvers) + 1;
      
      if (battingTeam === 'teamA') {
        match.oversa = Math.min(completeOvers, 20.0);
      } else {
        match.oversb = Math.min(completeOvers, 20.0);
      }
    } else {
      const completeOvers = Math.floor(currentOvers);
      const newOvers = completeOvers + (match.currentBall / 10);
      
      if (battingTeam === 'teamA') {
        match.oversa = parseFloat(newOvers.toFixed(1));
      } else {
        match.oversb = parseFloat(newOvers.toFixed(1));
      }
    }

    updateMatchScore(match.id, match);
  };

  const switchBattingTeam = (): void => {
    if (!selectedMatch) return;
    
    const match = { ...selectedMatch };
    match.battingTeam = match.battingTeam === 'teamA' ? 'teamB' : 'teamA';
    match.currentBall = 0; 
    
    if (match.innings === 'first') {
      match.innings = 'second';
      match.targetRuns = match.battingTeam === 'teamA' ? match.runsb + 1 : match.runsa + 1;
    }
    
    updateMatchScore(match.id, match);
  };

  const renderMatch = ({ item }: { item: Match }) => (
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
          <Text className="text-sm font-bold text-black">
            {item.runsa}/{item.wicketsa} ({formatOvers(item.oversa)})
          </Text>
        </View>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-sm font-medium text-[#2C1371] flex-1">{item.teamB}</Text>
          <Text className="text-sm font-bold text-black">
            {item.runsb}/{item.wicketsb} ({formatOvers(item.oversb)})
          </Text>
        </View>
      </View>

      <View className="mt-3 p-2 bg-orange-50 rounded-lg">
        <Text className="text-sm font-extrabold text-orange-700 text-center">{item.description}</Text>
      </View>

      {item.innings === 'second' && item.isLive && (
        <View className="flex-row justify-center mt-2">
          <Text className="text-xs text-gray-600">Balls Left: {item.ballsLeft}</Text>
        </View>
      )}
    </Pressable>
  );

  const RunButton: React.FC<RunButtonProps> = ({ runs, onPress, isExtra = false, label, disabled = false }) => (
    <Pressable
      onPress={() => onPress(runs, isExtra)}
      disabled={disabled}
      className={`px-4 py-2 m-1 rounded-lg ${
        disabled 
          ? 'bg-gray-300' 
          : isExtra 
            ? 'bg-orange-500' 
            : 'bg-blue-500'
      }`}
    >
      <Text className={`font-semibold text-center ${disabled ? 'text-gray-500' : 'text-white'}`}>
        {label || `+${runs}`}
      </Text>
    </Pressable>
  );

  return (
    <ImageBackground
      source={{ uri: 'https://cdn.pixabay.com/photo/2017/08/30/07/52/cricket-2691846_1280.jpg' }}
      resizeMode="cover"
      className="flex-1"
      imageStyle={{ opacity: 0.07 }}
    >
      <View className="flex-1 bg-[#F1EAFE] px-4 pt-12">
        <Text className="text-2xl font-bold text-[#2C1371] text-center mb-6">Admin - Live Matches</Text>

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
                    Toss: {selectedMatch.tossWinner} won and elected to {selectedMatch.tossDecision} first
                  </Text>
                </View>

                {/* Innings Status */}
                <View className="bg-[#F1EAFE] rounded-2xl p-4 mb-4">
                  <Text className="text-lg font-semibold text-[#2C1371] text-center">
                    {selectedMatch.innings === 'first' ? '1st Innings' : 
                     selectedMatch.innings === 'second' ? '2nd Innings' : 'Match Completed'}
                  </Text>
                  {selectedMatch.innings === 'second' && selectedMatch.targetRuns && (
                    <Text className="text-center text-purple-600 text-sm mt-1">
                      Target: {selectedMatch.targetRuns} runs
                    </Text>
                  )}
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
                      selectedMatch.battingTeam === 'teamA' ? 'bg-green-100 border-2 border-green-300' : 'bg-white'
                    }`}>
                      <View>
                        <Text className="text-xl font-bold text-black">
                          {selectedMatch.runsa}/{selectedMatch.wicketsa}
                        </Text>
                        <Text className="text-sm text-gray-600">
                          ({formatOvers(selectedMatch.oversa)} overs)
                        </Text>
                      </View>
                      {selectedMatch.battingTeam === 'teamA' && (
                        <Text className="text-xs font-bold text-green-600 bg-green-200 px-2 py-1 rounded">
                          BATTING
                        </Text>
                      )}
                    </View>

                    <View className={`flex-row justify-between items-center p-4 rounded-xl ${
                      selectedMatch.battingTeam === 'teamB' ? 'bg-green-100 border-2 border-green-300' : 'bg-white'
                    }`}>
                      <View>
                        <Text className="text-xl font-bold text-black">
                          {selectedMatch.runsb}/{selectedMatch.wicketsb}
                        </Text>
                        <Text className="text-sm text-gray-600">
                          ({formatOvers(selectedMatch.oversb)} overs)
                        </Text>
                      </View>
                      {selectedMatch.battingTeam === 'teamB' && (
                        <Text className="text-xs font-bold text-green-600 bg-green-200 px-2 py-1 rounded">
                          BATTING
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

                {selectedMatch.isLive && selectedMatch.battingTeam && selectedMatch.innings !== 'completed' && (
                  <>
                    {/* Auto Innings Complete Alert */}
                    {checkInningsComplete(selectedMatch) && (
                      <View className="bg-yellow-100 rounded-xl p-4 mb-4 border border-yellow-300">
                        <Text className="text-center text-yellow-800 font-bold text-lg">
                          🏏 Innings Complete!
                        </Text>
                        <Text className="text-center text-yellow-700 text-sm mt-1">
                          {selectedMatch.innings === 'first' 
                            ? 'Auto-switching to 2nd innings...' 
                            : 'Match completed automatically'
                          }
                        </Text>
                      </View>
                    )}

                    {/* Current Ball Info */}
                    <View className="bg-blue-50 rounded-xl p-4 mb-4">
                      <View className="flex-row justify-between items-center">
                        <View>
                          <Text className="text-blue-800 font-bold">
                            Current Ball: {Math.floor(selectedMatch.battingTeam === 'teamA' ? selectedMatch.oversa : selectedMatch.oversb)}.{selectedMatch.currentBall + 1}
                          </Text>
                          <Text className="text-blue-600 text-sm">
                            Batting: {selectedMatch.battingTeam === 'teamA' ? selectedMatch.teamA : selectedMatch.teamB}
                          </Text>
                        </View>
                        <View className="items-center">
                          <Text className="text-xs text-blue-600">Wickets Left</Text>
                          <Text className="font-bold text-blue-800 text-lg">
                            {10 - (selectedMatch.battingTeam === 'teamA' ? selectedMatch.wicketsa : selectedMatch.wicketsb)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Manual Innings Switch */}
                    <Pressable
                      onPress={switchBattingTeam}
                      className="bg-purple-600 rounded-xl p-3 mb-4"
                    >
                      <Text className="text-white font-semibold text-center">
                        Manual Innings Switch
                      </Text>
                    </Pressable>

                    {/* Scoring Interface */}
                    <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                      <Text className="text-lg font-bold text-[#2C1371] mb-4 text-center">
                        Score Update
                      </Text>
                      
                      {/* Regular Runs */}
                      <Text className="text-md font-semibold text-gray-700 mb-2">Regular Deliveries</Text>
                      <View className="flex-row flex-wrap justify-center mb-4">
                        {[0, 1, 2, 3, 4, 5, 6].map(runs => (
                          <RunButton
                            key={runs}
                            runs={runs}
                            onPress={addRuns}
                            disabled={checkInningsComplete(selectedMatch)}
                          />
                        ))}
                      </View>

                      {/* Extras - No Balls */}
                      <Text className="text-md font-semibold text-orange-700 mb-2">No Balls (Extra Ball)</Text>
                      <View className="flex-row flex-wrap justify-center mb-4">
                        {[1, 2, 3, 4, 5, 6].map(runs => (
                          <RunButton
                            key={`nb${runs}`}
                            runs={runs}
                            onPress={addRuns}
                            isExtra={true}
                            label={`NB+${runs}`}
                            disabled={checkInningsComplete(selectedMatch)}
                          />
                        ))}
                      </View>

                      {/* Extras - Wides */}
                      <Text className="text-md font-semibold text-orange-700 mb-2">Wides (Extra Ball)</Text>
                      <View className="flex-row flex-wrap justify-center mb-4">
                        {[1, 2, 3, 4, 5].map(runs => (
                          <RunButton
                            key={`wd${runs}`}
                            runs={runs}
                            onPress={addRuns}
                            isExtra={true}
                            label={`WD+${runs}`}
                            disabled={checkInningsComplete(selectedMatch)}
                          />
                        ))}
                      </View>

                      {/* Byes and Leg Byes */}
                      <Text className="text-md font-semibold text-green-700 mb-2">Byes & Leg Byes (Legal Ball)</Text>
                      <View className="flex-row flex-wrap justify-center mb-4">
                        {[1, 2, 3, 4].map(runs => (
                          <RunButton
                            key={`bye${runs}`}
                            runs={runs}
                            onPress={addRuns}
                            isExtra={false}
                            label={`B${runs}`}
                            disabled={checkInningsComplete(selectedMatch)}
                          />
                        ))}
                        {[1, 2, 3, 4].map(runs => (
                          <RunButton
                            key={`lb${runs}`}
                            runs={runs}
                            onPress={addRuns}
                            isExtra={false}
                            label={`LB${runs}`}
                            disabled={checkInningsComplete(selectedMatch)}
                          />
                        ))}
                      </View>
                    </View>

                    {/* Wicket Button */}
                    <Pressable
                      onPress={addWicket}
                      disabled={
                        (selectedMatch.battingTeam === 'teamA' ? selectedMatch.wicketsa : selectedMatch.wicketsb) >= 10 ||
                        checkInningsComplete(selectedMatch)
                      }
                      className={`rounded-xl p-4 mb-4 ${
                        (selectedMatch.battingTeam === 'teamA' ? selectedMatch.wicketsa : selectedMatch.wicketsb) >= 10 ||
                        checkInningsComplete(selectedMatch)
                          ? 'bg-gray-400' 
                          : 'bg-red-600'
                      }`}
                    >
                      <Text className="text-white font-bold text-center text-lg">
                        {(selectedMatch.battingTeam === 'teamA' ? selectedMatch.wicketsa : selectedMatch.wicketsb) >= 10
                          ? 'ALL OUT' 
                          : 'WICKET'
                        }
                      </Text>
                    </Pressable>
                  </>
                )}

                {!selectedMatch.isLive && (
                  <View className="bg-gray-100 rounded-xl p-4">
                    <Text className="text-center text-gray-600 font-semibold text-lg">
                      🏏 Match Completed
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