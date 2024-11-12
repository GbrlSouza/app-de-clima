import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';

const API_KEY = 'SUA_API_KEY_DO_OPENWEATHER';

const ClimaApp = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getWeatherByCity = async () => {
    if (city === '') return;
    setLoading(true);
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pt_br`);
      setWeatherData(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter os dados do clima.');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherByLocation = () => {
    setLoading(true);
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=pt_br`);
          setWeatherData(response.data);
        } catch (error) {
          Alert.alert('Erro', 'Não foi possível obter os dados do clima.');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        Alert.alert('Erro', 'Não foi possível obter a localização.');
        setLoading(false);
      },
    );
  };

  useEffect(() => {
    getWeatherByLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clima App</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite a cidade"
        value={city}
        onChangeText={setCity}
      />
      <TouchableOpacity onPress={getWeatherByCity} style={styles.button}>
        <Text style={styles.buttonText}>Buscar por cidade</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={getWeatherByLocation} style={styles.button}>
        <Text style={styles.buttonText}>Usar localização atual</Text>
      </TouchableOpacity>

      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        weatherData && (
          <View style={styles.weatherInfo}>
            <Text style={styles.weatherText}>Temperatura: {weatherData.main.temp}°C</Text>
            <Text style={styles.weatherText}>Umidade: {weatherData.main.humidity}%</Text>
            <Text style={styles.weatherText}>Condição: {weatherData.weather[0].description}</Text>
          </View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingLeft: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6200EE',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  weatherInfo: {
    marginTop: 20,
  },
  weatherText: {
    fontSize: 18,
  },
});

export default ClimaApp;
