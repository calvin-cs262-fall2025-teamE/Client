import { useState } from 'react';
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
      { backgroundColor: props.selected ? '#007BFF' : '#FFF' }, // Change background color based on selection
      styles.type_button
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
  const [currentSelected, setCurrentSelected] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Post Here</Text>

      <Text>Posting in community: RVD</Text>
      
      <View style={styles.button_container}>
        <CustomRadioButton
          label='Question'
          selected={currentSelected === 0}
          onSelect={() => setCurrentSelected(0)}
        />
        <CustomRadioButton
          label='Advice'
          selected={currentSelected === 1}
          onSelect={() => setCurrentSelected(1)}
        />
      </View>
      
      <View style={styles.container}>
        <Text>Your {currentSelected === 0 ? 'Question' : 'Advice'}</Text>
        <TextInput
          placeholder={currentSelected === 0 ? 'What is your question?' : 'What is your advice?'}
          style={styles.text_field}
        />
      </View>


      <View style={styles.container}>
        <Text>Details</Text>
        <TextInput
          multiline
          numberOfLines={5}
          placeholder='Any additional context or information?'
          style={styles.text_field}
        />
      </View>

      {/* Floating Post Button */}
      <TouchableOpacity style={styles.post_button}>
        <Text style={{color: '#fff'}}>Post</Text>
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
  button_container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#000',
  },
  title: {
    fontSize: 32,
    padding: 10,
  },
  text_field: {
    backgroundColor: '#fff',
    padding: 6,
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 5
  },
  big_text_field: {
    backgroundColor: '#fff',
    padding: 6,
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 5
  },
  type_button: {
    flex: 0,
    display: 'flex',
    padding: 20,
    margin: 5,
    borderRadius: 5
  },
  post_button: {
    backgroundColor: '#007BFF',
    width: '80%',
    justifyContent: 'center',
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 5,
    padding: 15
  }
});