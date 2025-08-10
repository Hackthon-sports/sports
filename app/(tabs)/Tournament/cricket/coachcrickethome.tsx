import React from 'react';
import { View, Text, Dimensions, Platform } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TournamentOngoingScreen from './ongoing';
import UpcomingScreen from './upcoming';
import CompletedScreen from './completed';
import Coachupcoming from './coachupcoming';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const Tab = createMaterialTopTabNavigator();

const CricketScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
      {/* 🔰 U-Shaped Title Bar */}
      <View
        style={{
          height: 110,
          position: 'relative',
          ...Platform.select({
            android: {
              elevation: 4,
            },
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
            },
          }),
        }}
      >
        <LinearGradient
          colors={['#8B5FBF', '#A374D9', '#B690E8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            flex: 1,
            paddingTop: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 26, fontWeight: 'bold' }}>🏏 Cricket   </Text>
        </LinearGradient>

        <View
          style={{
            position: 'absolute',
            bottom: -25,
            left: 0,
            right: 0,
            height: 40,
            backgroundColor: '#f0f0f0',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          }}
        />
      </View>

      {/* 📌 Tabs */}
      <View style={{ flex: 1, paddingTop: 10 }}>
        <Tab.Navigator
          initialRouteName="Ongoing"
          screenOptions={{
            tabBarActiveTintColor: '#9370DB',
            tabBarLabelStyle: { fontSize: 14, fontWeight: '800' },
            tabBarStyle: {
              backgroundColor: '#f0f0f0',
              elevation: 0,
            },
            tabBarIndicatorStyle: {
              backgroundColor: '#9370DB',
              height: 3,
              borderRadius: 2,
            },
          }}
        >
          <Tab.Screen name="Ongoing" component={TournamentOngoingScreen} />

          <Tab.Screen name="Upcoming" component={Coachupcoming} />
          <Tab.Screen name="Completed" component={CompletedScreen} />
        </Tab.Navigator>
      </View>
    </View>
  );
};

export default CricketScreen;