import nodemailer from 'nodemailer';

//const url=process.env.URL_API;

const emailRegistro=async (datos)=>{
    // Looking to send emails in production? Check out our Email API/SMTP product!
    const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
    });

    const {email,nombre,token}=datos;
    //enviar el email
    const info=await transporter.sendMail({
        from:"APV Administrador de Pacientes de Veterinaria",
        to:email,
        subject:'Confirma tu cuenta en APV',
        text:'Confirma tu cuenta en APV',
        html:`
            <p>Hola ${nombre}, confirma tu cuenta en el siguiente enlace</p>
            <a href="${process.env.URL_FRONTEND}/confirmar.html?token=${token}">Confirma tu cuenta</a>
            <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje</p>
        `
    });

    console.log('Mensaje enviado: %s',info.messageId);
}

export default emailRegistro