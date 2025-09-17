import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { StyleSheet, Text, TextInput } from 'react-native';

type Props = {
  control: Control<any>;
  name: string;
  placeholder: string;
  secureTextEntry?: boolean;
  rules?: any;
};

const InputField: React.FC<Props> = ({ control, name, placeholder, secureTextEntry, rules }) => (
  <Controller
    control={control}
    name={name}
    rules={rules}
    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
      <>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType={name === 'email' ? 'email-address' : 'default'}
        />
        {error && <Text style={styles.errorText}>{error.message}</Text>}
      </>
    )}
  />
);

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 8, fontSize: 16, backgroundColor: '#f9f9f9' },
  errorText: { color: 'red', marginBottom: 8 },
});

export default InputField;
