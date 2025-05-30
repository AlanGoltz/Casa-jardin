import { NextApiRequest, NextApiResponse } from "next";

export default async function getLocalidadesByProvincia(req: NextApiRequest, res: NextApiResponse) {
    try {
        const url = `https://apis.datos.gob.ar/georef/api/localidades?provincia=${req.query.provincia}&max=1000`;
        const response = await fetch(url);
        
        if (!response.ok) {
          return res.status(500).json({ error: "Error al consultar la API de provincias." });
        }
    
        const data = await response.json();
        return res.status(200).json(data.provincias);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "No se pudo conectar con la API de provincias." });
      }
    
}