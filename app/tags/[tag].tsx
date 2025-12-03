import { useCommunityContext } from '@/context/CommunityContext';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function TagScreen() {
  const { tag } = useLocalSearchParams();
  const { theme } = useTheme();
  const { communities } = useCommunityContext();

  const normalized = String(tag).toLowerCase();

  const matched = communities.filter(
    (c) => c.communityName.toLowerCase() === normalized,
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={theme.colors.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      >
        <View style={{ padding: 20, flex: 1 }}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            #
            {String(tag).toUpperCase()}
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            Communities with this tag
          </Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ marginTop: 18 }}
          >
            {matched.length > 0 ? (
              matched.map((c) => (
                <TouchableOpacity
                  key={c.communityID}
                  style={[
                    styles.card,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  onPress={() => router.push({
                    pathname: '/CommunityPage',
                    params: { id: c.communityID },
                  })}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                      {c.communityName}
                    </Text>
                    <Text
                      style={[styles.cardDesc, { color: theme.colors.textSecondary }]}
                    >
                      {c.description}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={22}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="alert-circle-outline"
                  size={50}
                  color={theme.colors.textSecondary}
                />
                <Text
                  style={[styles.emptyText, { color: theme.colors.textSecondary }]}
                >
                  No communities found for this tag.
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 15, marginTop: 6 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  cardDesc: {
    marginTop: 4,
    fontSize: 14,
  },
  emptyContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
  },
});
