import { Stack } from 'expo-router';
export default function Layout2() {
  return (
    <Stack>
      
      {/* <Stack.Screen name="coachscreen" options={{headerShown: false }} /> */}
      <Stack.Screen name="adminscreen" options={{headerShown: false }} />
      {/* <Stack.Screen name="mainscreen"  options={{headerShown: false  }} /> */}
      <Stack.Screen name="kabaddi/adminkabaddihome" options={{headerShown: false }} />
      <Stack.Screen name="volleyball/adminvolleyballhome" options={{headerShown: false }} />
      <Stack.Screen name="cricket/usercrickethome" options={{headerShown: false }} />
      <Stack.Screen name="kabaddi/coachkabaddihome" options={{headerShown: false }} />
      <Stack.Screen name="kabaddi/userkabaddihome" options={{headerShown: false }} />
      <Stack.Screen name="volleyball/uservolleyballhome" options={{headerShown: false }} />
      <Stack.Screen name="cricket/coachcrickethome" options={{headerShown: false }} />
    <Stack.Screen name="volleyball/coachvolleyballhome" options={{headerShown: false }} />
    <Stack.Screen name="cricket/admincrickethome" options={{headerShown: false }} />
      

    </Stack>
  );
}
