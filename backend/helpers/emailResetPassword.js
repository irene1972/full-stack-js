import nodemailer from 'nodemailer';

//const url=process.env.URL_API;

const emailResetPass=async (datos)=>{
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
        subject:'Resetea tu password en APV',
        text:'Resetea tu password en APV',
        html:`
            <p>Hola ${nombre}, resetea tu password en el siguiente enlace</p>
            <a href="${process.env.URL_FRONTEND}/reset.html?token=${token}">Resetea tu password</a>
            <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje</p>
        `
    });

    console.log('Mensaje enviado: %s',info.messageId);
}

export default emailResetPass