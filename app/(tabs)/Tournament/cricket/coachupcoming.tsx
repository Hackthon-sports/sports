import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ImageBackground,
  TextInput,
  Modal,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const BG_IMAGE_URL =
  "https://cdn.pixabay.com/photo/2017/08/30/07/52/cricket-2691846_1280.jpg";

const allMatches = [
  {
    id: "1",
    tournamentName: "Asia Cup 2025",
    matchName: "Qualifier",
    date: "2025-08-09T14:00:00",
    teamA: "UAE",
    teamB: "Nepal",
    isLive: false,
    location: "Dubai",
    organisation: "ACC",
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
  },
];

const upcomingTournaments = [
  {
    id: "t1",
    tournamentName: "Champions Trophy 2025",
    organisation: "ICC",
    location: "London",
    registrationEnd: "2025-08-20",
    maxTeams: 10,
    registeredTeams: 3,
    startDate: "2025-09-01",
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
];

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

  let prefix = "";
  if (isSameDay(matchDate, now)) {
    prefix = "Today";
  } else if (isSameDay(matchDate, addDays(now, 1))) {
    prefix = "Tomorrow";
  } else {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    prefix = matchDate.toLocaleDateString(undefined, options);
  }

  const timeString = matchDate.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${prefix} at ${timeString}`;
};

export default function Coachupcoming() {
  const [expandedTournament, setExpandedTournament] = useState<string | null>(
    null
  );
  const [expandedUpcoming, setExpandedUpcoming] = useState<string | null>(null);
  const [showFormFor, setShowFormFor] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    teamName: "",
    coachName: "",
    players: Array(15).fill(""),
  });
  const [registeredTournaments, setRegisteredTournaments] = useState<string[]>(
    []
  );
  const [modal, setModal] = useState<{
    visible: boolean;
    type: "success" | "error" | "info";
    message: string;
  }>({ visible: false, type: "info", message: "" });

  const now = new Date();
  const tournaments = Array.from(
    new Set(allMatches.map((m) => m.tournamentName))
  );

  const openModal = (
    type: "success" | "error" | "info",
    message: string
  ) => {
    setModal({ visible: true, type, message });
  };

  const handleRegisterSubmit = (tournamentId: string) => {
    const tournament = upcomingTournaments.find((t) => t.id === tournamentId);
    if (!tournament) return;

    if (
      !formData.teamName.trim() ||
      !formData.coachName.trim() ||
      formData.players.some((p) => !p.trim())
    ) {
      openModal("error", "Please fill all fields.");
      return;
    }

    if (tournament.registeredTeams >= tournament.maxTeams) {
      openModal("error", "Teams are already full for this tournament.");
      return;
    }

    tournament.registeredTeams += 1;
    setRegisteredTournaments((prev) => [...prev, tournamentId]);
    setShowFormFor(null);
    setExpandedUpcoming(null);
    openModal("success", `Successfully registered for ${tournament.tournamentName}`);
    setFormData({
      teamName: "",
      coachName: "",
      players: Array(15).fill(""),
    });
  };

  const renderMatchCard = (item: typeof allMatches[number]) => (
    <View
      key={item.id}
      className="mb-3 rounded-2xl bg-white p-4 shadow-md"
    >
      <Text className="text-[#2C1371] font-semibold text-sm mb-1">
        {item.matchName}
      </Text>
      <View className="flex-row justify-between">
        <Text className="text-xs text-purple-700">
          {item.date.split("T")[0]}
        </Text>
        <Text className="text-xs text-purple-700">{item.location}</Text>
      </View>
      <Text className="text-xs italic text-purple-500 mt-1">
        {item.organisation}
      </Text>

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
    <View style={{ flex: 1, backgroundColor: "#F1EAFE" }}>
      <ImageBackground
        source={{ uri: BG_IMAGE_URL }}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <KeyboardAwareScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 48,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={80}
          enableOnAndroid={true}
          showsVerticalScrollIndicator={false}
        >
          {/* Modal Popup */}
          <Modal transparent visible={modal.visible} animationType="fade">
            <View className="flex-1 justify-center items-center bg-black/50">
              <View className="bg-white w-4/5 rounded-2xl p-5">
                <Text
                  className={`text-lg font-bold mb-3 ${
                    modal.type === "success"
                      ? "text-green-600"
                      : modal.type === "error"
                      ? "text-red-600"
                      : "text-blue-600"
                  }`}
                >
                  {modal.type === "success"
                    ? "Success"
                    : modal.type === "error"
                    ? "Error"
                    : "Info"}
                </Text>
                <Text className="text-gray-700 mb-5">{modal.message}</Text>
                <TouchableOpacity
                  className="bg-orange-500 rounded-lg py-2"
                  onPress={() => setModal((prev) => ({ ...prev, visible: false }))}
                >
                  <Text className="text-white font-semibold text-center">OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Text className="text-2xl font-bold text-[#2C1371] text-center mb-3">
            Upcoming Matches in Ongoing Tournaments
          </Text>

          {tournaments.map((tournamentName) => {
            const isOpen = expandedTournament === tournamentName;
            const upcoming = allMatches.filter(
              (m) =>
                m.tournamentName === tournamentName &&
                !m.isLive &&
                new Date(m.date) >= now
            );

            return (
              <View key={tournamentName} className="mb-3">
                <Pressable
                  onPress={() =>
                    setExpandedTournament((prev) =>
                      prev === tournamentName ? null : tournamentName
                    )
                  }
                  className={`px-4 py-3 rounded-2xl ${
                    isOpen ? "bg-[#9B77F6]" : "bg-[#c5acf7]"
                  }`}
                >
                  <Text
                    className={`text-base font-semibold ${
                      isOpen ? "text-white" : "text-[#2C1371]"
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

          <Text className="text-2xl font-bold text-[#2C1371] text-center mb-3">
            Upcoming Tournaments
          </Text>

          {upcomingTournaments.map((t) => {
            const isOpen = expandedUpcoming === t.id;
            const isRegistered = registeredTournaments.includes(t.id);

            return (
              <View key={t.id} className="mb-3">
                <Pressable
                  onPress={() => {
                    setExpandedUpcoming((prev) => (prev === t.id ? null : t.id));
                    setShowFormFor(null);
                  }}
                  className={`px-4 py-3 rounded-2xl ${
                    isOpen ? "bg-[#9B77F6]" : "bg-[#c5acf7]"
                  }`}
                >
                  <Text
                    className={`text-base font-semibold ${
                      isOpen ? "text-white" : "text-[#2C1371]"
                    }`}
                  >
                    {t.tournamentName}
                  </Text>
                </Pressable>

                {isOpen && !showFormFor && (
                  <View className="mt-3 bg-white p-4 rounded-xl shadow">
                    <Text className="text-lg font-semibold text-gray-900">
                      Organisation: {t.organisation}
                    </Text>
                    <Text className="text-sm text-gray-700">Location: {t.location}</Text>
                    <Text className="text-sm text-gray-700">Start Date: {t.startDate}</Text>
                    <Text className="text-sm text-gray-700">
                      Registration Ends: {t.registrationEnd}
                    </Text>
                    <Text className="text-sm text-gray-700">
                      Teams: {t.registeredTeams}/{t.maxTeams}
                    </Text>

                    {t.registeredTeams >= t.maxTeams ? (
                      <Pressable className="mt-3 py-2 rounded-lg bg-gray-400" disabled>
                        <Text className="text-white font-semibold text-center">Full Teams</Text>
                      </Pressable>
                    ) : !isRegistered ? (
                      <Pressable
                        className="mt-3 py-2 rounded-lg bg-orange-500"
                        onPress={() => setShowFormFor(t.id)}
                      >
                        <Text className="text-white font-semibold text-center">Register</Text>
                      </Pressable>
                    ) : (
                      <Pressable className="mt-3 py-2 rounded-lg bg-gray-400" disabled>
                        <Text className="text-white font-semibold text-center">Registered</Text>
                      </Pressable>
                    )}
                  </View>
                )}

                {isOpen && showFormFor === t.id && !isRegistered && (
                  <View className="mt-3 bg-white p-4 rounded-xl shadow">
                    <Pressable onPress={() => setShowFormFor(null)} className="mb-3">
                      <Text className="text-orange-600">← Back</Text>
                    </Pressable>

                    <Text className="mt-1 text-2xl text-center font-semibold text-[#2C1371]">
                      Register Your Team
                    </Text>

                    <TextInput
                      placeholder="Team Name"
                      className={`border rounded-lg px-3 py-2 bg-purple-100 mt-3 ${
                        focusedField === "teamName"
                          ? "border-orange-500 border-2"
                          : "border-gray-300"
                      }`}
                      value={formData.teamName}
                      onFocus={() => setFocusedField("teamName")}
                      onBlur={() => setFocusedField(null)}
                      onChangeText={(text) =>
                        setFormData((prev) => ({ ...prev, teamName: text }))
                      }
                    />
                    <TextInput
                      placeholder="Coach Name"
                      className={`border rounded-lg px-3 py-2 bg-purple-100 mt-3 ${
                        focusedField === "coachName"
                          ? "border-orange-500 border-2"
                          : "border-gray-300"
                      }`}
                      value={formData.coachName}
                      onFocus={() => setFocusedField("coachName")}
                      onBlur={() => setFocusedField(null)}
                      onChangeText={(text) =>
                        setFormData((prev) => ({ ...prev, coachName: text }))
                      }
                    />

                    <Text className="text-base font-semibold text-[#2C1371] mt-4 mb-2">
                      Players List
                    </Text>
                    <View className="flex-row flex-wrap justify-between">
                      {formData.players.map((player, idx) => (
                        <View key={idx} style={{ width: "48%", marginBottom: 10 }}>
                          <Text className="text-xs text-gray-600 mb-1">Player {idx + 1}</Text>
                          <TextInput
                            placeholder="Enter name"
                            className={`border rounded-lg px-3 bg-purple-100 ${
                              focusedField === `player-${idx}`
                                ? "border-orange-500 border-2"
                                : "border-gray-300"
                            }`}
                            style={{ height: 40, fontSize: 14 }}
                            value={player}
                            onFocus={() => setFocusedField(`player-${idx}`)}
                            onBlur={() => setFocusedField(null)}
                            onChangeText={(text) => {
                              const newPlayers = [...formData.players];
                              newPlayers[idx] = text;
                              setFormData((prev) => ({
                                ...prev,
                                players: newPlayers,
                              }));
                            }}
                          />
                        </View>
                      ))}
                    </View>

                    <Pressable
                      className="mt-3 py-3 rounded-lg bg-orange-500"
                      onPress={() => handleRegisterSubmit(t.id)}
                    >
                      <Text className="text-white font-semibold text-center">
                        Submit Registration
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            );
          })}
        </KeyboardAwareScrollView>
      </ImageBackground>
    </View>
  );
}
