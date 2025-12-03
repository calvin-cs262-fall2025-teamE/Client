
import { useCommunityContext } from "@/context/CommunityContext";
import { useTheme } from "@/context/ThemeContext";
import { commonStyles } from "@/styles/common";
import { Community, defaultCommunity } from "@/types/Community";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { useAuth } from "./AuthContext";


export default function joinPage() {
  // Steps to find the current context:
  const { id } = useLocalSearchParams();
  const { communities } = useCommunityContext();
  const { user, updateUser } = useAuth();
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
    <ScrollView style={commonStyles.container}>
      <LinearGradient
        colors={theme.colors.background as [string, string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={commonStyles.background}
      >
        <Text style={[commonStyles.titleText, {color: theme.colors.text}]}>You aren't a member of {selectedCommunity.communityName} yet</Text>
        
        <TouchableOpacity
          style={[commonStyles.button, {backgroundColor: theme.colors.primary}]}
          onPress={() => {
            user?.communities?.push(id.toString())
            router.replace({
              pathname: `/CommunityPage`,
              params: {id},
            })
          }}>Join Now</TouchableOpacity>
        <TouchableOpacity
          style={[commonStyles.button, {backgroundColor: theme.colors.primary}]}
          onPress={() =>
            // Goes to home if the router does not recognize a way to go back
            router.canGoBack() ? router.back() : router.push("/(tabs)")
          }
        >Go Back</TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  )
}