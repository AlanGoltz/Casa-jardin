"use client"
import React, {useState, useEffect} from 'react';
import { User, BookOpen, FileSignature, NotebookText } from 'lucide-react';
import { getDireccionCompleta } from '@/services/ubicacion/direccion';
import { getCursoById } from '@/services/cursos';


interface SolicitudCardProps {
  data: {
    id: number;
    cursoSolicitud:{
      id: number,
      solicitudId: number,
      cursoId: number,
      curso:{
        id: number,
        nombre: string,
      }
    }[],
    solicitudMayores: {
      alumno: {
        nombre: string;
        apellido: string;
        dni: number;
        direccionId: number;
        email: string;
        fechaNacimiento: Date;
      }
      firmaReglamento: string;
      firmaUsoImagenes: string;
      observacionesUsoImagenes: string;
    };
  }
}

const SolicitudMayoresCard: React.FC<SolicitudCardProps> = ({ data }) => {
  const [cursos, setCursos] = useState<any>(["No se pudo cargar los cursos"]);
  const [direccionAlumno, setDireccionAlumno] = useState<any>("No se pudo cargar la dirección");
  const [loaded, setLoaded] = useState(false);
  const alumno = data.solicitudMayores.alumno;
  console.log('Alumno mayoooo:', alumno);
 


  useEffect(() => {
    console.log('Fetching data...');
    fetchData();
  }, [data, alumno]);

  const fetchData = async () => {
    console.log('Flag 1');
    try {
        console.log('Flag 2');
        const direccionAlumnoData: any = await getDireccionCompleta(alumno.direccionId);
  
        console.log('Dirección Alumno mayooo:', direccionAlumnoData);

        const cur = data.cursoSolicitud.map(curso => ({
            cursoId: curso.cursoId,
            nombre: curso.curso.nombre
        }));
        setCursos(cur);

        const direccionAlumnoStr = `
        ${direccionAlumnoData?.calle || ''} 
        ${direccionAlumnoData?.numero || ''}, 
        ${direccionAlumnoData?.localidad?.nombre || 'Unknown'}, 
        ${direccionAlumnoData?.localidad?.provincia?.nombre || 'Unknown'}, 
        ${direccionAlumnoData?.localidad?.provincia?.nacionalidad?.nombre || 'Unknown'}`;
  
        setDireccionAlumno(direccionAlumnoStr.trim());
        setLoaded(true);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {loaded ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 p-4 text-white">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <NotebookText className="w-6 h-6" />
              Solicitud N° {data.id}
            </h2>
          </div>
          
          <div className="p-4 sm:p-6 flex flex-col md:grid md:grid-cols-2 gap-6 bg-sky-50">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">
                <User className="w-5 h-5 text-sky-700"/>
                Datos Personales</h3>
              
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">Nombre:</span> {alumno.nombre} {alumno.apellido}</p>
                <p><span className="font-medium">DNI:</span> {alumno.dni}</p>
                <p><span className="font-medium">Email:</span> {alumno.email}</p>
                <p><span className="font-medium">Fecha de Nacimiento:</span> {new Date(alumno.fechaNacimiento).toLocaleDateString()}</p>
                <p><span className="font-medium">Dirección:</span> {direccionAlumno}</p>
              </div>
            </div>
          </div>

           <div className="border-t">
            <div className="bg-indigo-50 p-4">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Cursos seleccionados
              </h3>
             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cursos.map((course: any) => (
                  <div key={course.id}>
                    <p><span className="font-medium"> - </span> {course.nombre}</p>
                  </div>
                ))}
              </div>
            </div>
          </div> 
  
          <div className="border-t">
            <div className="bg-yellow-50 p-4">
              <h3 className="font-semibold text-yellow-700 flex items-center gap-2">
              <FileSignature className="w-6 h-6" />
                Autorizaciones y Observaciones
              </h3>
              <div className="mt-2 space-y-2">
              <p className="text-gray-600">Firma Reglamento: <span className="font-semibold">{data.solicitudMayores.firmaReglamento? 'De acuerdo' : 'Rechazado'}</span></p>
              <p className="text-gray-600">Firma Uso de Imágenes: <span className="font-semibold">{data.solicitudMayores.firmaUsoImagenes? 'De acuerdo' : 'Rechazado'}</span></p>
              <p className="text-gray-600">Observaciones Uso de Imágenes: <span className="font-semibold">{data.solicitudMayores.observacionesUsoImagenes || 'Sin observaciones'}</span></p>
            </div>
            </div>
          </div>
        </div>) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-600 p-4 text-white">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <User className="w-6 h-6" />
                Información Solicitud {data.id}
              </h2>
            </div>
            <div className="p-6">
              <p>Cargando...</p>
            </div>
          </div>
        )}
      </div>
  );
};

export default SolicitudMayoresCard;

