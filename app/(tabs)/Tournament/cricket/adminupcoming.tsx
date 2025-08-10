import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ImageBackground,
  TextInput,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Modal from "react-native-modal";
import { ScrollView } from 'react-native';

// Type definitions
interface Match {
  id: string;
  tournamentName: string;
  matchName: string;
  date: string;
  teamA: string;
  teamB: string;
  isLive: boolean;
  location: string;
  organisation: string;
  round: string;
  isCompleted: boolean;
  tournamentId?: string;
}

interface Tournament {
  id: string;
  tournamentName: string;
  organisation: string;
  location: string;
  registrationEnd: string;
  maxTeams: number;
  registeredTeams: number;
  startDate: string;
}

interface NewTournament {
  id: string;
  tournamentName: string;
  organisation: string;
  location: string;
  registrationStart: string;
  registrationEnd: string;
  teamSize: string;
  startDate: string;
  overs: string;
  noOfTeams: string;
}

interface TournamentSchedule {
  quarterfinals: Match[];
  semifinals: Match[];
  final: Match[];
  currentPhase: string;
  phasesCompleted: string[];
}

interface NewTournamentData {
  tournamentName: string;
  organisation: string;
  location: string;
  registrationStart: string;
  registrationEnd: string;
  teamSize: string;
  startDate: string;
  overs: string;
  noOfTeams: string;
}

const BG_IMAGE_URL =
  "https://cdn.pixabay.com/photo/2017/08/30/07/52/cricket-2691846_1280.jpg";

const initialMatches: Match[] = [
  {
    id: "1",
    tournamentName: "Asia Cup 2025",
    matchName: "Qualifier",
    date: "2025-08-19T14:00:00",
    teamA: "UAE",
    teamB: "Nepal",
    isLive: false,
    location: "Dubai",
    organisation: "ACC",
    round: "Qualifier",
    isCompleted: false,
  },
  {
    id: "2",
    tournamentName: "World Cup 2025",
    matchName: "Group B - Match 1",
    date: "2025-08-08T18:00:00",
    teamA: "Bangladesh",
    teamB: "Sri Lanka",
    isLive: false,
    location: "Dhaka",
    organisation: "ICC",
    round: "Group",
    isCompleted: false,
  },
];

export default function Adminupcoming() {
  const [expandedTournament, setExpandedTournament] = useState<string | null>(null);
  const [expandedUpcoming, setExpandedUpcoming] = useState<string | null>(null);
  const [expandedNew, setExpandedNew] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<any>(null);
  const [allMatches, setAllMatches] = useState<Match[]>(initialMatches);
  const [tournamentSchedules, setTournamentSchedules] = useState<Record<string, TournamentSchedule>>({});

  const [upcomingTournaments, setUpcomingTournaments] = useState<Tournament[]>([
    {
      id: "t1",
      tournamentName: "Champions Trophy 2025",
      organisation: "ICC",
      location: "London",
      registrationEnd: "2025-08-09",
      maxTeams: 8,
      registeredTeams: 8,
      startDate: "2025-08-09",
    },
    {
      id: "t2",
      tournamentName: "Emerging Nations Cup",
      organisation: "ACC",
      location: "Kuala Lumpur",
      registrationEnd: "2025-08-15",
      maxTeams: 8,
      registeredTeams: 8,
      startDate: "2025-08-25",
    },
  ]);

  const [newTournaments, setNewTournaments] = useState<NewTournament[]>([
    {
      id: "n1",
      tournamentName: "Legends Trophy 2025",
      organisation: "BCCI",
      location: "Mumbai",
      registrationStart: "2025-08-09",
      registrationEnd: "2025-08-20",
      teamSize: "11",
      startDate: "2025-09-05",
      overs: "50",
      noOfTeams: "8",
    },
    {
      id: "n2",
      tournamentName: "Desert Smash Cup",
      organisation: "ECB",
      location: "Abu Dhabi",
      registrationStart: "2025-08-15",
      registrationEnd: "2025-08-22",
      teamSize: "11",
      startDate: "2025-09-08",
      overs: "20",
      noOfTeams: "6",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTournamentData, setNewTournamentData] = useState<NewTournamentData>({
    tournamentName: "",
    organisation: "",
    location: "",
    registrationStart: "",
    registrationEnd: "",
    teamSize: "",
    startDate: "",
    overs: "",
    noOfTeams: "",
  });

  const now = new Date();

  const getMatchDescription = (matchDateStr: string): string => {
    const matchDate = new Date(matchDateStr);
    const isSameDay = (d1: Date, d2: Date) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    let prefix = "";
    if (isSameDay(matchDate, now)) {
      prefix = "Today";
    } else if (isSameDay(matchDate, new Date(now.getTime() + 86400000))) {
      prefix = "Tomorrow";
    } else {
      prefix = matchDate.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    }

    const timeString = matchDate.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return `${prefix} at ${timeString}`;
  };

  const generateTournamentSchedule = (tournament: Tournament | NewTournament): TournamentSchedule => {
    const teamCount = parseInt('noOfTeams' in tournament ? tournament.noOfTeams : tournament.maxTeams.toString());
    const teams = Array.from({ length: teamCount }, (_, i) => `Team ${i + 1}`);

    // FIX: Create a unique prefix for each schedule generation using a timestamp.
    const uniquePrefix = `${tournament.id}_${Date.now()}_`;
    const qfMatches: Match[] = [
      { id: `${uniquePrefix}QF1`, teamA: teams[0], teamB: teams[1], round: "Quarterfinal", tournamentName: tournament.tournamentName, matchName: "Quarterfinal - QF1", date: "", location: tournament.location, organisation: tournament.organisation, isLive: false, isCompleted: false, tournamentId: tournament.id },
      { id: `${uniquePrefix}QF2`, teamA: teams[2], teamB: teams[3], round: "Quarterfinal", tournamentName: tournament.tournamentName, matchName: "Quarterfinal - QF2", date: "", location: tournament.location, organisation: tournament.organisation, isLive: false, isCompleted: false, tournamentId: tournament.id },
      { id: `${uniquePrefix}QF3`, teamA: teams[4], teamB: teams[5], round: "Quarterfinal", tournamentName: tournament.tournamentName, matchName: "Quarterfinal - QF3", date: "", location: tournament.location, organisation: tournament.organisation, isLive: false, isCompleted: false, tournamentId: tournament.id },
      { id: `${uniquePrefix}QF4`, teamA: teams[6], teamB: teams[7], round: "Quarterfinal", tournamentName: tournament.tournamentName, matchName: "Quarterfinal - QF4", date: "", location: tournament.location, organisation: tournament.organisation, isLive: false, isCompleted: false, tournamentId: tournament.id },
    ];
    const sfMatches: Match[] = [
      { id: `${uniquePrefix}SF1`, teamA: "Winner QF1", teamB: "Winner QF2", round: "Semifinal", tournamentName: tournament.tournamentName, matchName: "Semifinal - SF1", date: "", location: tournament.location, organisation: tournament.organisation, isLive: false, isCompleted: false, tournamentId: tournament.id },
      { id: `${uniquePrefix}SF2`, teamA: "Winner QF3", teamB: "Winner QF4", round: "Semifinal", tournamentName: tournament.tournamentName, matchName: "Semifinal - SF2", date: "", location: tournament.location, organisation: tournament.organisation, isLive: false, isCompleted: false, tournamentId: tournament.id },
    ];
    const finalMatch: Match[] = [
      { id: `${uniquePrefix}Final`, teamA: "Winner SF1", teamB: "Winner SF2", round: "Final", tournamentName: tournament.tournamentName, matchName: "Final", date: "", location: tournament.location, organisation: tournament.organisation, isLive: false, isCompleted: false, tournamentId: tournament.id }
    ];

    let baseDate = new Date(tournament.startDate);
    const getDateString = (daysOffset: number) => {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + daysOffset);
      return d.toISOString();
    };

    const formatMatch = (match: Match, daysOffset: number): Match => ({
      ...match,
      date: getDateString(daysOffset),
    });

    return {
      quarterfinals: qfMatches.map((m, i) => formatMatch(m, i)),
      semifinals: sfMatches.map((m, i) => formatMatch(m, i + 4)),
      final: finalMatch.map(m => formatMatch(m, 6)),
      currentPhase: 'quarterfinals',
      phasesCompleted: []
    };
  };

  const checkAndUpdateTournamentStatus = () => {
    const todayStr = now.toISOString().split("T")[0];
    
    upcomingTournaments.forEach((tournament) => {
      // FIX: Add a check to ensure schedule isn't generated multiple times
      if (tournament.startDate <= todayStr && !tournamentSchedules[tournament.id]) {
        const schedule = generateTournamentSchedule(tournament);
        
        setTournamentSchedules((prev: Record<string, TournamentSchedule>) => ({
          ...prev,
          [tournament.id]: {
            ...schedule,
            currentPhase: 'quarterfinals',
            phasesCompleted: []
          }
        }));

        setAllMatches((prev: Match[]) => [...prev, ...schedule.quarterfinals]);
        
        Alert.alert(
          "Tournament Started", 
          `${tournament.tournamentName} has started! Quarterfinal matches are now available.`
        );
      }
    });
  };

  const progressTournamentPhase = (tournamentId: string, completedPhase: string) => {
    const schedule = tournamentSchedules[tournamentId];
    if (!schedule) return;

    let nextMatches: Match[] = [];
    let nextPhase = '';
    let alertMessage = '';

    if (completedPhase === 'quarterfinals' && !schedule.phasesCompleted.includes('quarterfinals')) {
      nextMatches = schedule.semifinals;
      nextPhase = 'semifinals';
      alertMessage = 'Quarterfinals completed! Semifinal matches are now available.';
    } else if (completedPhase === 'semifinals' && !schedule.phasesCompleted.includes('semifinals')) {
      nextMatches = schedule.final;
      nextPhase = 'final';
      alertMessage = 'Semifinals completed! Final match is now available.';
    }

    if (nextMatches.length > 0) {
      setTournamentSchedules((prev: Record<string, TournamentSchedule>) => ({
        ...prev,
        [tournamentId]: {
          ...prev[tournamentId],
          currentPhase: nextPhase,
          phasesCompleted: [...prev[tournamentId].phasesCompleted, completedPhase]
        }
      }));

      setAllMatches((prev: Match[]) => [...prev, ...nextMatches]);
      
      Alert.alert("Tournament Progress", alertMessage);
    }
  };

  const markMatchCompleted = (matchId: string) => {
    setAllMatches((prev: Match[]) => 
      prev.map(match => 
        match.id === matchId 
          ? { ...match, isCompleted: true }
          : match
      )
    );

    const match = allMatches.find(m => m.id === matchId);
    if (match && match.tournamentId) {
      const tournamentMatches = allMatches.filter(m => 
        m.tournamentId === match.tournamentId && 
        m.round === match.round &&
        !m.isCompleted
      );
      
      // If this was the last match of this round
      if (tournamentMatches.length === 1) { 
        progressTournamentPhase(match.tournamentId, match.round.toLowerCase());
      }
    }
  };

  const tournaments = Array.from(new Set(allMatches.map((m) => m.tournamentName)));

  useEffect(() => {
    const todayStr = now.toISOString().split("T")[0];
    let moved: NewTournament[] = [];
    let remaining: NewTournament[] = [];

    newTournaments.forEach((t) => {
      if (t.registrationStart <= todayStr) {
        moved.push(t);
        if (t.registrationStart === todayStr) {
          Alert.alert("Registration Starts Today", `${t.tournamentName} registration starts today`);
        }
      } else {
        remaining.push(t);
      }
    });

    if (moved.length > 0) {
      const tournamentsForUpcoming: Tournament[] = moved.map(t => ({
        id: t.id,
        tournamentName: t.tournamentName,
        organisation: t.organisation,
        location: t.location,
        registrationEnd: t.registrationEnd,
        startDate: t.startDate,
        maxTeams: parseInt(t.noOfTeams),
        registeredTeams: parseInt(t.noOfTeams)
      }));
      setUpcomingTournaments((prev) => [...prev, ...tournamentsForUpcoming]);
      setNewTournaments(remaining);
    }

    checkAndUpdateTournamentStatus();
  }, []);

  useEffect(() => {
    checkAndUpdateTournamentStatus();
  }, [upcomingTournaments]);

  const renderMatchCard = (item: Match) => (
    <View key={item.id} className="mb-3 rounded-2xl bg-white p-4 shadow-md">
      <Text className="text-[#2C1371] font-semibold text-sm mb-1">{item.matchName || item.round}</Text>
      <View className="flex-row justify-between">
        <Text className="text-xs text-purple-700">{item.date.split("T")[0]}</Text>
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
      {item.isCompleted && (
        <Text className="text-xs text-green-600 font-semibold mt-1">✓ Completed</Text>
      )}
      {!item.isCompleted && item.tournamentId && (
        <Pressable
          className="mt-2 py-1 px-3 bg-blue-500 rounded"
          onPress={() => markMatchCompleted(item.id)}
        >
          <Text className="text-white text-xs text-center">Mark as Completed</Text>
        </Pressable>
      )}
    </View>
  );

  const handleAddTournament = () => {
    for (let key in newTournamentData) {
      if (!newTournamentData[key as keyof typeof newTournamentData]) {
        Alert.alert("Missing Field", "Please fill all fields");
        return;
      }
    }

    const todayStr = now.toISOString().split("T")[0];
    const newItem: NewTournament = { ...newTournamentData, id: Date.now().toString() };

    if (newItem.registrationStart <= todayStr) {
      const tournamentForUpcoming: Tournament = {
        id: newItem.id,
        tournamentName: newItem.tournamentName,
        organisation: newItem.organisation,
        location: newItem.location,
        registrationEnd: newItem.registrationEnd,
        startDate: newItem.startDate,
        maxTeams: parseInt(newItem.noOfTeams),
        registeredTeams: parseInt(newItem.noOfTeams)
      };
      setUpcomingTournaments((prev) => [...prev, tournamentForUpcoming]);
      if (newItem.registrationStart === todayStr) {
        Alert.alert("Registration Starts Today", `${newItem.tournamentName} registration starts today`);
      }
    } else {
      setNewTournaments((prev) => [...prev, newItem]);
    }

    Alert.alert("Success", "Tournament added successfully");
    setNewTournamentData({
      tournamentName: "",
      organisation: "",
      location: "",
      registrationStart: "",
      registrationEnd: "",
      teamSize: "",
      startDate: "",
      overs: "",
      noOfTeams: "",
    });
    setShowAddForm(false);
  };


  return (
    <View style={{ flex: 1, backgroundColor: "#F1EAFE" }}>
      <ImageBackground source={{ uri: BG_IMAGE_URL }} resizeMode="cover" style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 48, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={80}
          enableOnAndroid={true}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Upcoming Matches */}
          <Text className="text-2xl font-bold text-[#2C1371] text-center mb-3">
            Upcoming Matches in Ongoing Tournaments
          </Text>
          {tournaments.map((tournamentName) => {
            const isOpen = expandedTournament === tournamentName;
            const upcoming = allMatches.filter(
              (m) => m.tournamentName === tournamentName && !m.isLive && new Date(m.date) >= now
            );
            return (
              <View key={tournamentName} className="mb-3">
                <Pressable
                  onPress={() =>
                    setExpandedTournament((prev) => (prev === tournamentName ? null : tournamentName))
                  }
                  className={`px-4 py-3 rounded-2xl ${isOpen ? "bg-[#9B77F6]" : "bg-[#c5acf7]"}`}
                >
                  <Text className={`text-base font-semibold ${isOpen ? "text-white" : "text-[#2C1371]"}`}>
                    {tournamentName}
                  </Text>
                </Pressable>
                {isOpen && (
                  <View className="mt-3">
                    {upcoming.length > 0 ? (
                      upcoming.map(renderMatchCard)
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

          {/* 2. Upcoming Tournaments */}
          <Text className="text-2xl font-bold text-[#2C1371] text-center mb-3">Upcoming Tournaments</Text>
          {upcomingTournaments.map((t) => {
            const isOpen = expandedUpcoming === t.id;
            const hasStarted = t.startDate <= now.toISOString().split("T")[0];
            return (
              <View key={t.id} className="mb-3">
                <Pressable
                  onPress={() => setExpandedUpcoming((prev) => (prev === t.id ? null : t.id))}
                  className={`px-4 py-3 rounded-2xl ${isOpen ? "bg-[#9B77F6]" : "bg-[#c5acf7]"}`}
                >
                  <Text className={`text-base font-semibold ${isOpen ? "text-white" : "text-[#2C1371]"}`}>
                    {t.tournamentName} {hasStarted && "🏏"}
                  </Text>
                </Pressable>
                {isOpen && (
                  <View className="mt-3 bg-white p-4 rounded-xl shadow">
                    <Text>Organisation: {t.organisation}</Text>
                    <Text>Location: {t.location}</Text>
                    <Text>Tournament Starts: {t.startDate}</Text>
                    <Text>Registration Ends: {t.registrationEnd}</Text>
                    <Text>Teams: {t.registeredTeams || 0}/{t.maxTeams}</Text>
                    {hasStarted && (
                      <Text className="text-green-600 font-semibold mt-2">✓ Tournament Started</Text>
                    )}
                    <Pressable
                      className={`mt-3 py-2 rounded-lg ${
                        (t.registeredTeams || 0) >= t.maxTeams
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                      disabled={(t.registeredTeams || 0) < t.maxTeams}
                      onPress={() => {
                        const schedule = generateTournamentSchedule(t);
                        setSelectedTournament({
                          ...t,
                          matches: [...schedule.quarterfinals, ...schedule.semifinals, ...schedule.final],
                        });
                        setShowScheduleModal(true);
                      }}
                    >
                      <Text className="text-white font-semibold text-center">Schedule</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            );
          })}

          {/* 3. New Tournaments */}
          <Text className="text-2xl font-bold text-[#2C1371] text-center mb-3">New Tournaments</Text>
          {newTournaments.map((t) => {
            const isOpen = expandedNew === t.id;
            return (
              <View key={t.id} className="mb-3">
                <Pressable
                  onPress={() => setExpandedNew((prev) => (prev === t.id ? null : t.id))}
                  className={`px-4 py-3 rounded-2xl ${isOpen ? "bg-[#9B77F6]" : "bg-[#c5acf7]"}`}
                >
                  <Text className={`text-base font-semibold ${isOpen ? "text-white" : "text-[#2C1371]"}`}>
                    {t.tournamentName}
                  </Text>
                </Pressable>
                {isOpen && (
                  <View className="mt-3 bg-white p-4 rounded-xl shadow">
                    <Text>Organisation: {t.organisation}</Text>
                    <Text>Location: {t.location}</Text>
                    <Text>Registration Starts: {t.registrationStart}</Text>
                    <Text>Registration Ends: {t.registrationEnd}</Text>
                    <Text>Team Size: {t.teamSize}</Text>
                    <Text>Tournament Starts: {t.startDate}</Text>
                    <Text>Overs: {t.overs}</Text>
                    <Text>No. of Teams: {t.noOfTeams}</Text>
                  </View>
                )}
              </View>
            );
          })}

          {/* 4. Add Tournament Button */}
          {!showAddForm && (
            <Pressable className="mt-5 py-3 rounded-lg bg-green-500" onPress={() => setShowAddForm(true)}>
              <Text className="text-white font-semibold text-center">Add Tournament</Text>
            </Pressable>
          )}

          {/* Add Tournament Form */}
          {showAddForm && (
            <View className="mt-3 bg-white p-4 rounded-xl shadow">
              <Pressable onPress={() => setShowAddForm(false)}>
                <Text className="text-orange-500 font-semibold mb-2">← Back</Text>
              </Pressable>
              {Object.keys(newTournamentData).map((field) => (
                <TextInput
                  key={field}
                  placeholder={field.replace(/([A-Z])/g, " $1")}
                  className="border border-orange-500 rounded-lg px-3 py-2 bg-purple-100 mt-2"
                  value={(newTournamentData as any)[field]}
                  onChangeText={(text) =>
                    setNewTournamentData((prev) => ({
                      ...prev,
                      [field]: text,
                    }))
                  }
                />
              ))}
              <Pressable className="mt-3 py-3 rounded-lg bg-orange-500" onPress={handleAddTournament}>
                <Text className="text-white font-semibold text-center">Add</Text>
              </Pressable>
            </View>
          )}
        </KeyboardAwareScrollView>

        {/* Schedule Modal */}
        <Modal
          isVisible={showScheduleModal}
          onBackdropPress={() => setShowScheduleModal(false)}
          style={{ justifyContent: "flex-end", margin: 0 }}
        >
          <View className="bg-white rounded-t-2xl p-4 max-h-[80%]">
            <Text className="text-lg font-bold text-center mb-5">Match Schedules</Text>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 16 }}
            >
              {selectedTournament?.matches?.map((match: Match) => (
                <View
                  key={match.id}
                  className="mb-4 rounded-lg border border-gray-300 p-3"
                >
                  <Text className="text-purple-800 font-semibold">
                    {match.round} - {match.id.split('_')[2]}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {match.date.split("T")[0]} • {match.location} • {match.organisation}
                  </Text>
                  <View className="flex-row justify-between mt-2">
                    <Text className="font-medium">{match.teamA}</Text>
                    <Text>vs</Text>
                    <Text className="font-medium">{match.teamB}</Text>
                  </View>
                  <Text className="text-xs italic text-orange-600 mt-1">
                    {getMatchDescription(match.date)}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </Modal>
      </ImageBackground>
    </View>
  );
}