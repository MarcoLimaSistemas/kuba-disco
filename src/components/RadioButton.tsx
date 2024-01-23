import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type RadioButtonProps = {
  options: string[];
  selectedOption: string | null;
  onSelect: (option: string) => void;
};

const RadioButton: React.FC<RadioButtonProps> = ({ options, selectedOption, onSelect }) => {
  return (
    <View>
      {options.map((option) => (
        <TouchableOpacity key={option} style={styles.radioButton} onPress={() => onSelect(option)}>
          <View style={styles.radioCircle}>
            {selectedOption === option && <View style={styles.innerCircle} />}
          </View>
          <Text style={styles.radioText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#000',
  },
  radioText: {
    marginLeft: 10,
  },
});

export default RadioButton;
