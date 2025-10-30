import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface buttonProps {
  label?: string,
  selected?: boolean,
  onSelect: Function,
}
// Implimentation modified from on this webpage
// https://www.geeksforgeeks.org/react-native/how-to-implement-radio-button-in-react-native/
const CustomRadioButton = (props: buttonProps) => (
  <TouchableOpacity
    style={[
      { backgroundColor: props.selected ? '#007BFF' : '#FFF' } // Change background color based on selection
    ]}
    onPress= {() => props.onSelect()} // Trigger onSelect callback when pressed
  >
    <Text
      style={[
        { color: props.selected ? '#FFF' : '#000' } // Change text color based on selection
      ]}
    >
      {props.label || ""} {/* Display the label text */}
    </Text>
  </TouchableOpacity>
);

export default function AboutScreen() {
  let currentSelected: number = 0;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Create Post Here</Text>
      
      {/* TODO: Add question/info selector */}
      <View>
        <CustomRadioButton
          label='Question'
          selected={currentSelected === 0}
          onSelect={() => currentSelected = 0}
        />
        <CustomRadioButton
          label='Advice'
          selected={currentSelected === 1}
          onSelect={() => currentSelected = 1}
        />
      </View>
      
      <Text>Your {currentSelected === 0 ? 'Question' : 'Advice'}</Text>
      <TextInput
        placeholder={currentSelected === 0 ? 'What is your question?' : 'What is your advice?'}
      />

      <Text>Details</Text>
      <TextInput
        placeholder='Any additional context or information?'
      />

      {/* Floating Post Button */}
      <TouchableOpacity>
        
      </TouchableOpacity>
        
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#000',
  },
});