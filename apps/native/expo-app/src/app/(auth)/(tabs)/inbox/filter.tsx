import { StyleSheet, Text, View } from "react-native";

export default function FilterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filter</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
});
