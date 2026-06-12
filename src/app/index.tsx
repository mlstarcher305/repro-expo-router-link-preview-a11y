import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

/**
 * Two visually identical rows:
 *
 * - Row A: plain `<Link asChild><Pressable>` — visible to VoiceOver/XCUITest.
 * - Row B: same row wrapped in `<Link.Trigger>` with a sibling `<Link.Preview />`
 *   — the ENTIRE subtree disappears from the iOS accessibility tree, even though
 *   the trigger Pressable has an explicit accessibilityLabel + testID.
 *
 * Verify with the Accessibility Inspector, VoiceOver, or any XCUITest-based
 * tool (e.g. `maestro hierarchy`): only "row-plain-link" is exposed.
 */
export default function Index() {
  return (
    <View style={styles.container}>
      <Link href="/detail" asChild push>
        <Pressable accessibilityLabel="row-plain-link" testID="row-plain-link">
          <View style={styles.row}>
            <Text>Row A — plain Link (exposed to accessibility)</Text>
          </View>
        </Pressable>
      </Link>

      <Link href="/detail" asChild push>
        <Link.Trigger>
          <Pressable accessibilityLabel="row-with-preview" testID="row-with-preview">
            <View style={styles.row}>
              <Text>Row B — Link.Trigger + Link.Preview (MISSING from accessibility)</Text>
            </View>
          </Pressable>
        </Link.Trigger>
        <Link.Preview />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  row: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#e8e8f0',
  },
});
