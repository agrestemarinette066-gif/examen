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
import { consultasApi } from '../api/mochiApi';

interface Consulta {
  id: string;
  titulo: string;
  necesitaParametro: boolean;
  tipoParametro: 'string' | 'number' | 'fecha' | 'ninguno';
  metodo: (param?: any) => Promise<any>;
}

const ConsultasScreen = () => {
  const [consultaActiva, setConsultaActiva] = useState<string | null>(null);
  const [parametro, setParametro] = useState<string>('');
  const [resultados, setResultados] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);

  const consultas: Consulta[] = [
    { 
      id: 'area', 
      titulo: '1. Maestros por área', 
      necesitaParametro: true,
      tipoParametro: 'string',
      metodo: (area: string) => consultasApi.listarPorArea(area)
    },
    { 
      id: 'cursos-maestro', 
      titulo: '2. Cursos por maestro', 
      necesitaParametro: true,
      tipoParametro: 'number',
      metodo: (id: number) => consultasApi.cursosPorMaestro(id)
    },
    { 
      id: 'parcial', 
      titulo: '3. Exámenes parciales', 
      necesitaParametro: false,
      tipoParametro: 'ninguno',
      metodo: () => consultasApi.examenesParcial()
    },
    { 
      id: 'fecha', 
      titulo: '4. Exámenes por fecha', 
      necesitaParametro: true,
      tipoParametro: 'fecha',
      metodo: (fecha: string) => consultasApi.examenesPorFecha(fecha)
    },
    { 
      id: 'contar', 
      titulo: '5. Contar exámenes por curso', 
      necesitaParametro: true,
      tipoParametro: 'number',
      metodo: (id: number) => consultasApi.contarExamenesCurso(id)
    },
    { 
      id: 'grupo', 
      titulo: '6. Cursos por grupo', 
      necesitaParametro: true,
      tipoParametro: 'string',
      metodo: (grupo: string) => consultasApi.cursosPorGrupo(grupo)
    },
    { 
      id: 'doctorado', 
      titulo: '7. Maestros con doctorado', 
      necesitaParametro: false,
      tipoParametro: 'ninguno',
      metodo: () => consultasApi.maestrosDoctorado()
    },
    { 
      id: 'todos', 
      titulo: '8. Cursos con exámenes', 
      necesitaParametro: false,
      tipoParametro: 'ninguno',
      metodo: () => consultasApi.cursosConExamenes()
    },
  ];

  const ejecutarConsulta = async () => {
    if (!consultaActiva) return;

    setCargando(true);
    setResultados([]);
    
    try {
      const consulta = consultas.find(c => c.id === consultaActiva);
      if (!consulta) return;

      let respuesta;
      
      if (!consulta.necesitaParametro) {
        respuesta = await consulta.metodo();
      } else if (consulta.tipoParametro === 'number') {
        const idNumero = parseInt(parametro);
        if (isNaN(idNumero)) {
          Alert.alert('Error', 'Debe ingresar un número válido');
          return;
        }
        respuesta = await consulta.metodo(idNumero);
      } else {
        if (!parametro.trim()) {
          Alert.alert('Error', 'Debe ingresar un valor');
          return;
        }
        respuesta = await consulta.metodo(parametro);
      }

      setResultados(respuesta.data || []);
    } catch (error: any) {
      console.error('Error en consulta:', error);
      Alert.alert('Error', error.response?.data?.message || 'Error en la consulta');
    } finally {
      setCargando(false);
    }
  };

  const obtenerPlaceholder = (): string => {
    if (!consultaActiva) return '';
    
    const consulta = consultas.find(c => c.id === consultaActiva);
    if (!consulta) return '';

    switch (consulta.id) {
      case 'area':
        return 'Ej: matematicas, ciencias, humanidades...';
      case 'fecha':
        return 'Ej: 2024-01-15';
      case 'cursos-maestro':
        return 'ID del maestro (número)';
      case 'contar':
        return 'ID del curso (número)';
      case 'grupo':
        return 'Ej: Grupo A, 101, etc.';
      default:
        return 'Ingrese valor';
    }
  };

  const mostrarInputParametro = (): boolean => {
    if (!consultaActiva) return false;
    const consulta = consultas.find(c => c.id === consultaActiva);
    return consulta?.necesitaParametro || false;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Consultas del Sistema</Text>
      
      <View style={styles.grid}>
        {consultas.map((consulta) => (
          <TouchableOpacity
            key={consulta.id}
            style={[
              styles.botonConsulta,
              consultaActiva === consulta.id && styles.botonActivo
            ]}
            onPress={() => {
              setConsultaActiva(consulta.id);
              setParametro('');
              setResultados([]);
            }}
          >
            <Text style={styles.botonTexto}>{consulta.titulo}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {consultaActiva && (
        <View style={styles.panel}>
          <Text style={styles.consultaSeleccionada}>
            {consultas.find(c => c.id === consultaActiva)?.titulo}
          </Text>

          {mostrarInputParametro() && (
            <TextInput
              style={styles.input}
              placeholder={obtenerPlaceholder()}
              value={parametro}
              onChangeText={setParametro}
            />
          )}

          <TouchableOpacity
            style={[
              styles.botonEjecutar,
              (mostrarInputParametro() && !parametro.trim()) && styles.botonDeshabilitado
            ]}
            onPress={ejecutarConsulta}
            disabled={cargando || (mostrarInputParametro() && !parametro.trim())}
          >
            {cargando ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.botonEjecutarTexto}>Ejecutar Consulta</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {resultados.length > 0 && (
        <View style={styles.resultados}>
          <Text style={styles.resultadosTitulo}>
            Resultados ({resultados.length})
          </Text>
          {resultados.map((item, index) => (
            <View key={index} style={styles.itemResultado}>
              <Text style={styles.itemTexto}>
                {JSON.stringify(item, null, 2)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {resultados.length === 0 && !cargando && consultaActiva && (
        <View style={styles.sinResultados}>
          <Text style={styles.sinResultadosTexto}>
            Ejecuta la consulta para ver resultados
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  botonConsulta: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  botonActivo: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  botonTexto: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  panel: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  consultaSeleccionada: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2196f3',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  botonEjecutar: {
    backgroundColor: '#2196f3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonDeshabilitado: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
  botonEjecutarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultados: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  resultadosTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  itemResultado: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  itemTexto: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  sinResultados: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  sinResultadosTexto: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default ConsultasScreen;