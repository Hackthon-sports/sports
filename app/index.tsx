import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-blue-400">
      <Text className="text-5xl"> Hello</Text>
       <Link href="/onboarding"><Text>Onboarding</Text></Link>
       <Link href="/store"> <Text>go to tabs</Text></Link>
    </View>
  );
}  
 