import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, Alert, StyleSheet} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const defaultForm = 'Form1';

  const [selectedForm, setSelectedForm] = useState(defaultForm);
  const [formData, setFormData] = useState({
    Form1: {firstName: '', lastName: '', email: '', phone: ''},
    Form2: {firstName: '', lastName: '', email: '', phone: ''},
    Form3: {firstName: '', lastName: '', email: '', phone: ''},
    Form4: {firstName: '', lastName: '', email: '', phone: ''},
    Form5: {firstName: '', lastName: '', email: '', phone: ''},
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Load saved data when the component mounts
    loadFormData();
  }, [selectedForm]);

  useEffect(() => {
    // Set the default form on component mount
    setSelectedForm(defaultForm);
    setIsFormVisible(true); // Show the form when the component mounts
  }, []); // Empty dependency array means it runs only once on mount

  const saveFormData = async () => {
    try {
      // Save data to AsyncStorage
      await AsyncStorage.setItem(
        selectedForm,
        JSON.stringify(formData[selectedForm]),
      );
      setSuccessMessage('Data saved successfully!');
      console.log('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const loadFormData = async () => {
    try {
      // Load data from AsyncStorage based on the selected form
      const savedData = await AsyncStorage.getItem(selectedForm);
      if (savedData) {
        setFormData(prevData => ({
          ...prevData,
          [selectedForm]: JSON.parse(savedData),
        }));
        console.log('Data loaded successfully!');
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleFormChange = value => {
    // Update selected form and show/hide form based on selection
    setSelectedForm(value);
    setSuccessMessage(''); // Clear success message when changing forms
  };

  const handleInputChange = (key, value) => {
    // Update the formData state when input changes
    setFormData(prevData => ({
      ...prevData,
      [selectedForm]: {
        ...prevData[selectedForm],
        [key]: value,
      },
    }));
    setSuccessMessage(''); // Clear success message when changing input
  };

  const handleSubmit = () => {
    // Save form data when the submit button is pressed
    saveFormData();
  };

  const handleClearData = async () => {
    try {
      // Clear data for the selected form
      setFormData(prevData => ({
        ...prevData,
        [selectedForm]: {firstName: '', lastName: '', email: '', phone: ''},
      }));
      // Clear data from AsyncStorage
      await AsyncStorage.removeItem(selectedForm);
      setSuccessMessage('Data cleared successfully!');
      console.log('Data cleared successfully!');
      Alert.alert('Success', 'Data cleared successfully!');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Fill the Form</Text>
      <RNPickerSelect
        onValueChange={handleFormChange}
        items={[
          {label: 'Form 1', value: 'Form1'},
          {label: 'Form 2', value: 'Form2'},
          {label: 'Form 3', value: 'Form3'},
          {label: 'Form 4', value: 'Form4'},
          {label: 'Form 5', value: 'Form5'},
        ]}
      />
      {isFormVisible && (
        <>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={formData[selectedForm].firstName}
            onChangeText={text => handleInputChange('firstName', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={formData[selectedForm].lastName}
            onChangeText={text => handleInputChange('lastName', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData[selectedForm].email}
            onChangeText={text => handleInputChange('email', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={formData[selectedForm].phone}
            onChangeText={text => handleInputChange('phone', text)}
          />
          <Button title="Submit" onPress={handleSubmit} />
          <Text style={styles.successMessage}>{successMessage}</Text>
        </>
      )}
      <Button title="Clear Data" onPress={handleClearData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginVertical: 8,
    padding: 8,
  },
  successMessage: {
    color: 'green',
    marginTop: 8,
  },
});

export default App;
