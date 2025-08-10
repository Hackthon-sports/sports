import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StatusBar,
  Pressable,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import MaskedView from '@react-native-masked-view/masked-view';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const sports = [
  {
    id: '1',
    name: 'Cricket',
    iconUrl:
      'https://media.gettyimages.com/id/467029165/vector/cricket-logo.jpg?s=1024x1024&w=gi&k=20&c=T5M11w6ndn7X0BFZESGaLiOZLNTKpLouQ0RZ-oQfEoY=',
    info: {
      description: 'A bat-and-ball game played between two teams where runs decide the winner.',
      rules: [
        'Each team bats and bowls once.',
        'Score runs by hitting the ball and running.',
        'Bowlers aim to dismiss batters.',
        'Team with most runs wins.',
      ],
      players: '11 players per team',
      duration: '20 overs per team',
      equipment: 'Bat, ball, wickets, pads, gloves, helmet',
    },
  },
  {
    id: '2',
    name: 'Kabaddi',
    iconUrl:
      'https://sportbetsindia.net/wp-content/uploads/2024/01/kabaddi-header.webp',
    info: {
      description: 'A contact sport where raiders try to tag opponents without being caught.',
      rules: [
        'Raider enters opponent half to tag players.',
        'Must chant "Kabaddi" without stopping.',
        'Defenders try to tackle raider.',
        'Points scored by tags or tackles.',
      ],
      players: '7 players per team',
      duration: '2 halves of 20 minutes',
      equipment: 'No special equipment',
    },
  },
  {
    id: '3',
    name: 'Volleyball',
    iconUrl:
      'https://previews.123rf.com/images/romul/romul1501/romul150100042/35313962-volleyball-net-with-ball-flat-icon-beach-sport.jpg',
    info: {
      description: 'A net game where two teams aim to ground the ball on the opponent’s side.',
      rules: [
        'Teams serve to start play.',
        'Ball must be returned in 3 touches.',
        'Players rotate positions after winning serve.',
        'First to 25 points wins set.',
      ],
      players: '6 players per team',
      duration: 'Best of 5 sets',
      equipment: 'Volleyball, net, knee pads',
    },
  },
];

type TwinkleTextProps = {
  children: React.ReactNode;
  className?: string;
  style?: object;
};

const TwinkleText = ({ children, className = '', style = {} }: TwinkleTextProps) => {
  const shineX = useSharedValue(-width);
  useEffect(() => {
    shineX.value = withRepeat(
      withTiming(width, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
      -1
    );
  }, []);
  const shineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shineX.value }],
  }));
  return (
    <MaskedView
      maskElement={
        <Text className={className} style={style}>
          {children}
        </Text>
      }
    >
      <View className="bg-white">
        <Animated.View
          style={[
            { position: 'absolute', width: width * 1.5, height: 50 },
            shineStyle,
          ]}
        >
          <LinearGradient
            colors={['#8B5FBF', '#FFFFFF', '#D6C6FF', '#8B5FBF']}
            locations={[0.2, 0.4, 0.6, 0.8]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: '100%', height: '100%' }}
          />
        </Animated.View>
        <Text className={className} style={style}>
          {children}
        </Text>
      </View>
    </MaskedView>
  );
};

type ZoomAnimatedButtonProps = {
  children: React.ReactNode;
  onPress: () => void;
};

const ZoomAnimatedButton = ({ children, onPress }: ZoomAnimatedButtonProps) => {
  const scale = useSharedValue(1);
  const animatedScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <Pressable
      onPressIn={() => (scale.value = withSpring(0.96))}
      onPressOut={() => (scale.value = withSpring(1))}
      onPress={onPress}
    >
      <Animated.View style={animatedScaleStyle}>{children}</Animated.View>
    </Pressable>
  );
};

export default function CoachTournamentScreen() {
  const [selectedSport, setSelectedSport] = useState<any>(null);
  const sheetPosition = useSharedValue(height);

  const openInfo = (sport: any) => {
    setSelectedSport(sport);
    sheetPosition.value = withTiming(height * 0.4, { duration: 300, easing: Easing.out(Easing.ease) });
  };

  const closeInfo = () => {
    sheetPosition.value = withTiming(
      height,
      { duration: 300, easing: Easing.in(Easing.ease) },
      (isFinished) => {
        if (isFinished) runOnJS(setSelectedSport)(null);
      }
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      setSelectedSport(null);
      sheetPosition.value = height;
    }, [])
  );

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetPosition.value }],
  }));

  return (
    <View className="flex-1 bg-purple-50">
      <StatusBar barStyle="light-content" backgroundColor="#8B5FBF" />
      <View className="h-[250px] relative overflow-hidden">
        <LinearGradient
          colors={['#8B5FBF', '#A374D9', '#B690E8']}
          className="flex-1 px-6 pt-14 pb-10"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View className="items-center justify-center mt-4">
            <View className="flex-row items-center space-x-3">
              <Text className="text-5xl">🏆</Text>
              <TwinkleText className="text-white text-5xl font-extrabold">
                Tournaments
              </TwinkleText>
            </View>
            <Text className="text-white/90 text-xm text-center mt-2 font-medium tracking-wide">
              Choose your game and join the competition!
            </Text>
          </View>
        </LinearGradient>
        <View className="absolute bottom-[-20px] left-0 right-0 h-[65px] bg-purple-50 rounded-t-[30px]" />
      </View>

      <ScrollView
        className="flex-1 mt-[-20px]"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 60,
          paddingTop: 10,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="space-y-8">
          {sports.map((sport: any) => (
            <View
              key={sport.id}
              className="bg-white rounded-3xl p-5 shadow-lg border border-purple-100"
            >
              <ZoomAnimatedButton
                onPress={() =>
                  router.push(
                    `/Tournament/${
                      sport.id === '1'
                        ? 'cricket/coachcrickethome'
                        : sport.id === '2'
                        ? 'kabaddi/coachkabaddihome'
                        : 'volleyball/coachvolleyballhome'
                    }`
                  )
                }
              >
                <View className="flex-row items-center mb-4">
                  <View className="w-[65px] h-[65px] rounded-2xl mr-4 overflow-hidden border-2 border-purple-200 bg-purple-100 justify-center items-center">
                    <Image
                      source={{ uri: sport.iconUrl }}
                      className="w-10 h-10 rounded-lg"
                      resizeMode="contain"
                    />
                  </View>
                  <View className="flex-1">
                    <TwinkleText className="text-[20px] font-extrabold text-purple-800">
                      {sport.name}
                    </TwinkleText>
                  </View>
                  <View className="w-9 h-9 rounded-full bg-purple-200/30 border border-purple-300 justify-center items-center">
                    <Text className="text-purple-800 font-extrabold text-xl">
                      ➡
                    </Text>
                  </View>
                </View>
              </ZoomAnimatedButton>
              <ZoomAnimatedButton onPress={() => openInfo(sport)}>
                <View className="bg-purple-100/30 rounded-xl p-2 border border-purple-300 flex-row justify-center items-center mt-1">
                  <Text className="text-sm font-semibold text-purple-700 mr-2">
                    ℹ️ Game Info
                  </Text>
                </View>
              </ZoomAnimatedButton>
            </View>
          ))}
        </View>
      </ScrollView>

      {selectedSport && (
        <>
          <TouchableWithoutFeedback onPress={closeInfo}>
            <Animated.View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.4)',
              }}
            />
          </TouchableWithoutFeedback>

          <Animated.View
            style={[
              {
                position: 'absolute',
                left: 0,
                right: 0,
                height: height * 0.6,
                backgroundColor: 'white',
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                padding: 20,
              },
              sheetStyle,
            ]}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="bg-purple-50 p-4 rounded-xl border border-purple-200 mb-4">
                <Text className="text-purple-700 font-semibold mb-1">
                  📖 About {selectedSport.name}
                </Text>
                <Text className="text-gray-700 text-sm leading-relaxed">
                  {selectedSport.info.description}
                </Text>
              </View>
              <View className="flex-row space-x-4 mb-4">
                <View className="flex-1 bg-yellow-50 p-4 rounded-xl border border-yellow-300 items-center">
                  <Text className="text-xl mb-1">👥</Text>
                  <Text className="text-yellow-800 font-semibold text-xs mb-1">
                    PLAYERS
                  </Text>
                  <Text className="text-sm font-semibold text-gray-800 text-center">
                    {selectedSport.info.players}
                  </Text>
                </View>
                <View className="flex-1 bg-blue-50 p-4 rounded-xl border border-blue-300 items-center">
                  <Text className="text-xl mb-1">⏱️</Text>
                  <Text className="text-blue-800 font-semibold text-xs mb-1">
                    DURATION
                  </Text>
                  <Text className="text-sm font-semibold text-gray-800 text-center">
                    {selectedSport.info.duration}
                  </Text>
                </View>
              </View>
              <View className="mb-4">
                <Text className="text-purple-700 font-bold mb-2">
                  📋 Basic Rules
                </Text>
                {selectedSport.info.rules.map((rule: string, idx: number) => (
                  <View
                    key={idx}
                    className="flex-row bg-gray-50 p-3 mb-2 rounded-lg border-l-4 border-purple-400"
                  >
                    <Text className="text-purple-700 font-bold mr-3">
                      {idx + 1}.
                    </Text>
                    <Text className="text-sm text-gray-700 flex-1">
                      {rule}
                    </Text>
                  </View>
                ))}
              </View>
              <View className="bg-green-50 p-4 rounded-xl border border-green-300">
                <Text className="text-green-700 font-semibold mb-1">
                  🏃‍♂️ Equipment Needed
                </Text>
                <Text className="text-sm text-gray-800">
                  {selectedSport.info.equipment}
                </Text>
              </View>
            </ScrollView>
          </Animated.View>
        </>
      )}
    </View>
  );
}
