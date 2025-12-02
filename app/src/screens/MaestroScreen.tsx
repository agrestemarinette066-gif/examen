import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { sistemaApi, AREAS, NIVELES_ACADEMICOS } from '../api/mochiApi';

interface FormularioMaestro {
  nombre: string;
  apellido: string;
  correo: string;
  area: string;
  nivel_academico: string;
  fecha_ingreso: string;
}

const MaestroScreen = () => {
  const [formulario, setFormulario] = useState<FormularioMaestro>({
    nombre: '',
    apellido: '',
    correo: '',
    area: AREAS[0],
    nivel_academico: NIVELES_ACADEMICOS[0],
    fecha_ingreso: new Date().toISOString().split('T')[0],
  });
  const [cargando, setCargando] = useState<boolean>(false);

  const manejarCambio = (campo: keyof FormularioMaestro, valor: string) => {
    setFormulario({ ...formulario, [campo]: valor });
  };

  const enviarFormulario = async () => {
    if (!formulario.nombre.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return;
    }
    if (!formulario.apellido.trim()) {
      Alert.alert('Error', 'El apellido es requerido');
      return;
    }
    if (!formulario.correo.trim() || !formulario.correo.includes('@')) {
      Alert.alert('Error', 'Correo electrónico inválido');
      return;
    }

    setCargando(true);
    try {
      const respuesta = await sistemaApi.crearMaestro(formulario);
      Alert.alert('Éxito', 'Maestro registrado correctamente');
      
      setFormulario({
        nombre: '',
        apellido: '',
        correo: '',
        area: AREAS[0],
        nivel_academico: NIVELES_ACADEMICOS[0],
        fecha_ingreso: new Date().toISOString().split('T')[0],
      });
      
      console.log('Respuesta:', respuesta.data);
    } catch (error: any) {
      console.error('Error:', error);
      Alert.alert('Error', error.response?.data?.message || 'No se pudo registrar el maestro');
    } finally {
      setCargando(false);
    }
  };

  const pickerSelectStyles = {
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: '#ced4da',
      borderRadius: 6,
      color: 'black',
      paddingRight: 30,
      backgroundColor: '#fff',
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: '#ced4da',
      borderRadius: 6,
      color: 'black',
      paddingRight: 30,
      backgroundColor: '#fff',
    },
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Registrar Nuevo Maestro</Text>
        <Text style={styles.subtitulo}>
          Completa todos los campos del maestro
        </Text>
      </View>

      <View style={styles.formulario}>
        <View style={styles.campo}>
          <Text style={styles.label}>Nombre *</Text>
          <TextInput
            style={styles.input}
            value={formulario.nombre}
            onChangeText={(text: string) => manejarCambio('nombre', text)}
            placeholder="Ej: Juan"
            editable={!cargando}
          />
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Apellido *</Text>
          <TextInput
            style={styles.input}
            value={formulario.apellido}
            onChangeText={(text: string) => manejarCambio('apellido', text)}
            placeholder="Ej: Pérez"
            editable={!cargando}
          />
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Correo Electrónico *</Text>
          <TextInput
            style={styles.input}
            value={formulario.correo}
            onChangeText={(text: string) => manejarCambio('correo', text)}
            placeholder="Ej: juan.perez@escuela.com"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!cargando}
          />
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Área de Especialización</Text>
          <View style={styles.pickerWrapper}>
            <RNPickerSelect
              onValueChange={(itemValue: string) => manejarCambio('area', itemValue)}
              items={AREAS.map((area: string) => ({
                label: area.charAt(0).toUpperCase() + area.slice(1),
                value: area,
              }))}
              value={formulario.area}
              disabled={cargando}
              style={pickerSelectStyles}
            />
          </View>
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Nivel Académico</Text>
          <View style={styles.pickerWrapper}>
            <RNPickerSelect
              onValueChange={(itemValue: string) => manejarCambio('nivel_academico', itemValue)}
              items={NIVELES_ACADEMICOS.map((nivel: string) => ({
                label: nivel.charAt(0).toUpperCase() + nivel.slice(1),
                value: nivel,
              }))}
              value={formulario.nivel_academico}
              disabled={cargando}
              style={pickerSelectStyles}
            />
          </View>
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Fecha de Ingreso</Text>
          <TextInput
            style={styles.input}
            value={formulario.fecha_ingreso}
            onChangeText={(text: string) => manejarCambio('fecha_ingreso', text)}
            placeholder="AAAA-MM-DD"
            editable={!cargando}
          />
          <Text style={styles.ayuda}>Formato: Año-Mes-Día</Text>
        </View>

        <TouchableOpacity
          style={[styles.botonEnviar, cargando && styles.botonDeshabilitado]}
          onPress={enviarFormulario}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.botonEnviarTexto}>Guardar Maestro</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.informacion}>
        <Text style={styles.informacionTitulo}>📋 Campos del Maestro:</Text>
        <Text style={styles.informacionItem}>• ID: Generado automáticamente</Text>
        <Text style={styles.informacionItem}>• Nombre y Apellido (obligatorios)</Text>
        <Text style={styles.informacionItem}>• Correo electrónico</Text>
        <Text style={styles.informacionItem}>• Área: Matemáticas, Ciencias, etc.</Text>
        <Text style={styles.informacionItem}>• Nivel: Licenciatura, Maestría, Doctorado</Text>
        <Text style={styles.informacionItem}>• Fecha de ingreso</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 16,
    color: '#6c757d',
  },
  formulario: {
    padding: 20,
  },
  campo: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 6,
    overflow: 'hidden',
  },
  ayuda: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 5,
  },
  botonEnviar: {
    backgroundColor: '#0d6efd',
    borderRadius: 6,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  botonDeshabilitado: {
    backgroundColor: '#6c757d',
    opacity: 0.7,
  },
  botonEnviarTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  informacion: {
    margin: 20,
    padding: 20,
    backgroundColor: '#e7f1ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cfe2ff',
  },
  informacionTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#084298',
    marginBottom: 10,
  },
  informacionItem: {
    fontSize: 14,
    color: '#052c65',
    marginBottom: 5,
  },
});

export default MaestroScreen;