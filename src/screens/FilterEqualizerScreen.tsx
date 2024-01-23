import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import RadioButton from '../components/RadioButton';

interface FilterEqualizerScreenProps {
  createGaiaMessage: (command: Buffer) => void;
}

const FilterEqualizerScreen: React.FC<FilterEqualizerScreenProps> = ({ createGaiaMessage }) => {
  const [frequency, setFrequency] = useState<number>(0.3);
  const [gain, setGain] = useState<number>(-12);
  const [quality, setQuality] = useState<number>(0.25);
  const [selectedOptionBand, setSelectedOptionBand] = useState<string | null>(null);
  const options = ['1', '2', '3', '4', '5'];

  const handleSelect = (option: string) => {
    setSelectedOptionBand(option);
  };

  const generateCodeAndSendToGaia = (filterId: number, value: string) => {
    const code = `FF010005000A021A01${selectedOptionBand}${filterId}${value}01`;

    createGaiaMessage(Buffer.from(code, 'hex'));
  };

  const generateCodeForFrequency = (frequency: number) => {
    const filterId = 1;

    const multiply = frequency < 1 ? 100 : 1000;

    frequency *= multiply * 3;

    const valueFrequencyToHex = convertValueToHex(frequency);

    generateCodeAndSendToGaia(filterId, valueFrequencyToHex);
  };

  const convertQualityToHex = (quality: number): string => {
    quality *= 4096;
    return convertValueToHex(quality);
  };

  const generateCodeForGain = (gain: number) => {
    const filterId = 2; // Use o ID correto para ganho
    // Limitando o ganho dentro do intervalo permitido
    let clampedGain = Number((Math.max(-12, Math.min(12, gain)) * 60).toFixed());

    if (gain < 0) {
      clampedGain = 4096 + clampedGain;
    }
    // Calculando o valor em hexadecimal com base na relação de 60 dB por unidade
    const hexValue = clampedGain.toString(16).toUpperCase();
    console.log('clampedGain', clampedGain);
    // Adicionando o prefixo "0" para valores positivos, "F" para valores negativos
    const prefix = gain >= 0 ? '0' : 'F';

    // Concatenando o prefixo com o valor calculado em hexadecimal
    const valueGainHex = prefix + hexValue;

    generateCodeAndSendToGaia(filterId, valueGainHex);
  };

  const generateCodeForQuality = (quality: number) => {
    const filterId = 3; // Use o ID correto para qualidade

    const hexValue = convertQualityToHex(quality);
    generateCodeAndSendToGaia(filterId, hexValue);
  };

  const convertValueToHex = (decimalValue: number): string => {
    decimalValue = Number(decimalValue.toFixed());
    // Converte o valor decimal para hexadecimal
    const hexValue = decimalValue.toString(16).toUpperCase();
    // Garante que o valor tenha quatro dígitos
    return hexValue.padStart(4, '0');
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Escolha uma opção de band:</Text>
      <RadioButton options={options} selectedOption={selectedOptionBand} onSelect={handleSelect} />

      <Text>Frequência: {frequency.toFixed(2)}</Text>
      <Slider
        style={{ width: '100%', marginVertical: 10 }}
        minimumValue={0.2}
        maximumValue={20}
        value={frequency}
        onValueChange={(value) => setFrequency(value)}
        onSlidingComplete={generateCodeForFrequency}
      />

      <Text>Ganho: {gain}</Text>
      <Slider
        style={{ width: '100%', marginVertical: 10 }}
        minimumValue={-12}
        maximumValue={12}
        value={gain}
        onValueChange={(value) => setGain(value)}
        onSlidingComplete={generateCodeForGain}
      />

      <Text>Qualidade: {quality}</Text>
      <Slider
        style={{ width: '100%', marginVertical: 10 }}
        minimumValue={0.25}
        maximumValue={8}
        value={quality}
        onValueChange={(value) => setQuality(value)}
        onSlidingComplete={generateCodeForQuality}
      />
    </View>
  );
};

export default FilterEqualizerScreen;
