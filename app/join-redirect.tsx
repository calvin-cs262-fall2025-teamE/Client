
import { useCommunityContext } from "@/context/CommunityContext";
import { useTheme } from "@/context/ThemeContext";
import { Community, defaultCommunity } from "@/types/Community";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { ScrollView, Text } from "react-native";
import { useAuth } from "./AuthContext";


export default function joinPage() {
  // Steps to find the current context:
  const { id } = useLocalSearchParams();
  const { communities } = useCommunityContext();
  const { user } = useAuth();
  const router = useRouter();

  const selectedCommunity: Community = communities.find(comm => comm.communityID.toString() === id) || defaultCommunity;

  useEffect( () => {
    if (user?.communities && user.communities.includes(id.toString())) {
        router.replace({
            pathname: `/CommunityPage`,
            params: {id},
        })
    }});
  const { theme } = useTheme();

  return (
    <ScrollView>
        <Text>Join this Community?</Text>
        
    </ScrollView>
  )
}