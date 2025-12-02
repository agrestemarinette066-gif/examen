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
import { cursosApi, AREAS } from '../api/mochiApi';

interface FormularioCurso {
  codigo: string;
  nombre: string;
  descripcion: string;
  creditos: string;
  area: string;
  grupo: string;
}

const CursoScreen = () => {
  const [formulario, setFormulario] = useState<FormularioCurso>({
    codigo: '',
    nombre: '',
    descripcion: '',
    creditos: '',
    area: AREAS[0],
    grupo: '',
  });
  const [cargando, setCargando] = useState<boolean>(false);

  const manejarCambio = (campo: keyof FormularioCurso, valor: string) => {
    setFormulario({ ...formulario, [campo]: valor });
  };

  const enviarFormulario = async () => {
    if (!formulario.codigo.trim()) {
      Alert.alert('Error', 'El código del curso es requerido');
      return;
    }
    if (!formulario.nombre.trim()) {
      Alert.alert('Error', 'El nombre del curso es requerido');
      return;
    }
    if (!formulario.creditos.trim() || isNaN(parseInt(formulario.creditos))) {
      Alert.alert('Error', 'Los créditos deben ser un número válido');
      return;
    }

    setCargando(true);
    try {
      const datosEnviar = {
        ...formulario,
        creditos: parseInt(formulario.creditos)
      };
      
      const respuesta = await cursosApi.crear(datosEnviar);
      Alert.alert('Éxito', 'Curso registrado correctamente');
      
      setFormulario({
        codigo: '',
        nombre: '',
        descripcion: '',
        creditos: '',
        area: AREAS[0],
        grupo: '',
      });
      
      console.log('Respuesta:', respuesta.data);
    } catch (error: any) {
      console.error('Error:', error);
      Alert.alert('Error', error.response?.data?.message || 'No se pudo registrar el curso');
    } finally {
      setCargando(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Registrar Nuevo Curso</Text>
        <Text style={styles.subtitulo}>
          Completa todos los campos del curso
        </Text>
      </View>

      <View style={styles.formulario}>
        <View style={styles.campo}>
          <Text style={styles.label}>Código del Curso *</Text>
          <TextInput
            style={styles.input}
            value={formulario.codigo}
            onChangeText={(text: string) => manejarCambio('codigo', text)}
            placeholder="Ej: MAT101"
            editable={!cargando}
          />
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Nombre del Curso *</Text>
          <TextInput
            style={styles.input}
            value={formulario.nombre}
            onChangeText={(text: string) => manejarCambio('nombre', text)}
            placeholder="Ej: Álgebra Lineal"
            editable={!cargando}
          />
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formulario.descripcion}
            onChangeText={(text: string) => manejarCambio('descripcion', text)}
            placeholder="Descripción del curso"
            multiline
            numberOfLines={3}
            editable={!cargando}
          />
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Créditos *</Text>
          <TextInput
            style={styles.input}
            value={formulario.creditos}
            onChangeText={(text: string) => manejarCambio('creditos', text)}
            placeholder="Ej: 4"
            keyboardType="numeric"
            editable={!cargando}
          />
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Área de Conocimiento</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formulario.area}
              onValueChange={(itemValue: string) => manejarCambio('area', itemValue)}
              enabled={!cargando}
            >
              {AREAS.map((area: string) => (
                <Picker.Item
                  key={area}
                  label={area.charAt(0).toUpperCase() + area.slice(1)}
                  value={area}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Grupo</Text>
          <TextInput
            style={styles.input}
            value={formulario.grupo}
            onChangeText={(text: string) => manejarCambio('grupo', text)}
            placeholder="Ej: Grupo A, 101"
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
            <Text style={styles.botonEnviarTexto}>Guardar Curso</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.informacion}>
        <Text style={styles.informacionTitulo}>📋 Campos del Curso:</Text>
        <Text style={styles.informacionItem}>• Código: Identificador único (obligatorio)</Text>
        <Text style={styles.informacionItem}>• Nombre: Nombre completo del curso</Text>
        <Text style={styles.informacionItem}>• Descripción: Detalles del contenido</Text>
        <Text style={styles.informacionItem}>• Créditos: Valor numérico (obligatorio)</Text>
        <Text style={styles.informacionItem}>• Área: Área de conocimiento</Text>
        <Text style={styles.informacionItem}>• Grupo: Grupo asignado</Text>
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
  botonEnviar: {
    backgroundColor: '#198754',
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
    backgroundColor: '#d1e7dd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#a3cfbb',
  },
  informacionTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0a3622',
    marginBottom: 10,
  },
  informacionItem: {
    fontSize: 14,
    color: '#0a3622',
    marginBottom: 5,
  },
});

export default CursoScreen;