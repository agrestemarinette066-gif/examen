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
import { Picker } from '@react-native-picker/picker';
import { examenesApi, TIPOS_EXAMEN } from '../api/mochiApi';

interface FormularioExamen {
  nombre: string;
  tipo: string;
  descripcion: string;
  duracion_minutos: string;
  fecha: string;
  curso_id: string;
}

const ExamenScreen = () => {
  const [formulario, setFormulario] = useState<FormularioExamen>({
    nombre: '',
    tipo: TIPOS_EXAMEN[0],
    descripcion: '',
    duracion_minutos: '',
    fecha: new Date().toISOString().split('T')[0],
    curso_id: '',
  });
  const [cargando, setCargando] = useState<boolean>(false);

  const manejarCambio = (campo: keyof FormularioExamen, valor: string) => {
    setFormulario({ ...formulario, [campo]: valor });
  };

  const enviarFormulario = async () => {
    if (!formulario.nombre.trim()) {
      Alert.alert('Error', 'El nombre del examen es requerido');
      return;
    }
    if (!formulario.duracion_minutos.trim() || isNaN(parseInt(formulario.duracion_minutos))) {
      Alert.alert('Error', 'La duración debe ser un número válido (minutos)');
      return;
    }
    if (!formulario.curso_id.trim() || isNaN(parseInt(formulario.curso_id))) {
      Alert.alert('Error', 'El ID del curso debe ser un número válido');
      return;
    }

    setCargando(true);
    try {
      const datosEnviar = {
        ...formulario,
        duracion_minutos: parseInt(formulario.duracion_minutos),
        curso_id: parseInt(formulario.curso_id)
      };
      
      const respuesta = await examenesApi.crear(datosEnviar);
      Alert.alert('Éxito', 'Examen registrado correctamente');
      
      setFormulario({
        nombre: '',
        tipo: TIPOS_EXAMEN[0],
        descripcion: '',
        duracion_minutos: '',
        fecha: new Date().toISOString().split('T')[0],
        curso_id: '',
      });
      
      console.log('Respuesta:', respuesta.data);
    } catch (error: any) {
      console.error('Error:', error);
      Alert.alert('Error', error.response?.data?.message || 'No se pudo registrar el examen');
    } finally {
      setCargando(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Registrar Nuevo Examen</Text>
        <Text style={styles.subtitulo}>
          Completa todos los campos del examen
        </Text>
      </View>

      <View style={styles.formulario}>
        <View style={styles.campo}>
          <Text style={styles.label}>Nombre del Examen *</Text>
          <TextInput
            style={styles.input}
            value={formulario.nombre}
            onChangeText={(text: string) => manejarCambio('nombre', text)}
            placeholder="Ej: Examen Parcial 1"
            editable={!cargando}
          />
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Tipo de Examen</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formulario.tipo}
              onValueChange={(itemValue: string) => manejarCambio('tipo', itemValue)}
              enabled={!cargando}
            >
              {TIPOS_EXAMEN.map((tipo: string) => (
                <Picker.Item
                  key={tipo}
                  label={tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  value={tipo}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formulario.descripcion}
            onChangeText={(text: string) => manejarCambio('descripcion', text)}
            placeholder="Descripción del examen"
            multiline
            numberOfLines={3}
            editable={!cargando}
          />
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Duración (minutos) *</Text>
          <TextInput
            style={styles.input}
            value={formulario.duracion_minutos}
            onChangeText={(text: string) => manejarCambio('duracion_minutos', text)}
            placeholder="Ej: 90"
            keyboardType="numeric"
            editable={!cargando}
          />
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Fecha *</Text>
          <TextInput
            style={styles.input}
            value={formulario.fecha}
            onChangeText={(text: string) => manejarCambio('fecha', text)}
            placeholder="AAAA-MM-DD"
            editable={!cargando}
          />
          <Text style={styles.ayuda}>Formato: Año-Mes-Día</Text>
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>ID del Curso *</Text>
          <TextInput
            style={styles.input}
            value={formulario.curso_id}
            onChangeText={(text: string) => manejarCambio('curso_id', text)}
            placeholder="Ej: 1"
            keyboardType="numeric"
            editable={!cargando}
          />
        </View>

        <TouchableOpacity
          style={[styles.botonEnviar, cargando && styles.botonDeshabilitado]}
          onPress={enviarFormulario}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.botonEnviarTexto}>Guardar Examen</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.informacion}>
        <Text style={styles.informacionTitulo}>📋 Campos del Examen:</Text>
        <Text style={styles.informacionItem}>• Nombre: Nombre del examen (obligatorio)</Text>
        <Text style={styles.informacionItem}>• Tipo: Parcial, Final, Extraordinario</Text>
        <Text style={styles.informacionItem}>• Descripción: Detalles del examen</Text>
        <Text style={styles.informacionItem}>• Duración: Tiempo en minutos (obligatorio)</Text>
        <Text style={styles.informacionItem}>• Fecha: Fecha de aplicación (obligatorio)</Text>
        <Text style={styles.informacionItem}>• Curso ID: ID del curso asociado (obligatorio)</Text>
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
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
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
    backgroundColor: '#dc3545',
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
    backgroundColor: '#f8d7da',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f1aeb5',
  },
  informacionTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#58151c',
    marginBottom: 10,
  },
  informacionItem: {
    fontSize: 14,
    color: '#58151c',
    marginBottom: 5,
  },
});

export default ExamenScreen;