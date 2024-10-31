"use server";
import path from "path";
import nodemailer from "nodemailer";
import { guardarCodigoConfirmacion} from "@/services/redis";


// Configuración del servicio de correo
const googleTransporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "maldonado12net@gmail.com",
    pass: process.env.EMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // Ignora la verificación de certificados
},
});

//Código de confirmación de 6 dígitos
const randomCode = Math.floor(100000 + Math.random() * 900000);
// Genera la ruta absoluta desde el directorio raíz del proyecto
const logoPath = path.join(process.cwd(), 'public', 'Images', 'LogoCasaJardin.png');

// Función para enviar un correo electrónico con el código de confirmación
export async function emailTest(receptor: string){
  googleTransporter
    .sendMail({
      from: "maldonado12net@gmail.com",
      to: receptor,
      subject: "Código de confirmación - Casa Jardín",
      text: "Código de confirmación",
      html: `
          <body>
               <div style="font-family: Arial, sans-serif; text-align: center; background-color: black; padding: 2%;">
            <h1 style="color: white;">Casa Jardín</h1>
            <div style="font-family: Arial, sans-serif; text-align: center; 
        background-color: rgb(255, 255, 255); padding-bottom: 5px; margin-left: 10%; margin-right: 10%;">
                <h1 style="color: #333;">Código de confirmación</h1>
               <img src="cid:logoimage" alt="logo"></img> 
                <p>Tu código es: <strong style="font-size: 18px; color: brown;">${randomCode}</strong></p>
                <p>Por favor, ingrésalo en la página para completar su solicitud de inscripción.</p>
            </div>
        </div>
    </body>
        `,
      attachments: [
        {
          filename: "LogoCasaJardin.png", // Nombre de tu imagen
          path: logoPath, // Ruta a tu imagen en el servidor
          cid: "logoimage", // Usado en el src del tag <img>
        },
      ],
    })
    .then((): void => {
      //guarda el código de confirmación en Redis
      guardarCodigoConfirmacion(receptor, randomCode.toString());
      console.log("email sent");
    })
    .catch((error: Error): void => {
      console.error("error sending email", error);
    });
}