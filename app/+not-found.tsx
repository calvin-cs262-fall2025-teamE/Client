import { View, StyleSheet, Text } from 'react-native';
import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Error 404' }} />
      <View>
        <Text>Error 404, Page not Found</Text>
        <Link href="/">
          Go back to Home screen!
        </Link>
      </View>
    </>
  );
}