// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Sistema Académico</Text>
      <Text style={styles.subtitulo}>Gestión de Maestros, Cursos y Exámenes</Text>

      <View style={styles.botonesContainer}>
        <TouchableOpacity 
          style={[styles.boton, styles.botonMaestro]}
          onPress={() => navigation.navigate('Maestro' as never)}
        >
          <Text style={styles.botonTexto}>👨‍🏫 Registrar Maestro</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.boton, styles.botonCurso]}
          onPress={() => navigation.navigate('Curso' as never)}
        >
          <Text style={styles.botonTexto}>📚 Registrar Curso</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.boton, styles.botonExamen]}
          onPress={() => navigation.navigate('Examen' as never)}
        >
          <Text style={styles.botonTexto}>📝 Registrar Examen</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitulo}>Consultas disponibles:</Text>
        <Text>1. Maestros por área</Text>
        <Text>2. Cursos por maestro</Text>
        <Text>3. Exámenes parciales</Text>
        <Text>4. Exámenes por fecha</Text>
        <Text>5. Contar exámenes por curso</Text>
        <Text>6. Cursos por grupo</Text>
        <Text>7. Maestros con doctorado</Text>
        <Text>8. Cursos con exámenes</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitulo: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  botonesContainer: {
    marginBottom: 30,
  },
  boton: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  botonMaestro: {
    backgroundColor: '#2196f3',
  },
  botonCurso: {
    backgroundColor: '#4caf50',
  },
  botonExamen: {
    backgroundColor: '#ff9800',
  },
  botonTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  infoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
});

export default HomeScreen;